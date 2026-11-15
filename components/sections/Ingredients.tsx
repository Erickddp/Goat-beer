"use client";

import { useSectionMotion } from "@/lib/useSectionMotion";
import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, SplitText } from "@/lib/gsap";
import t from "@/content/i18n/es";

/** Posición de cada hotspot en % sobre ingredients.png (2752×1536). */
const HOTSPOTS: Record<string, { x: number; y: number }> = {
  pechitas: { x: 20, y: 34 },
  avena: { x: 35.5, y: 40 },
  maltas: { x: 26.5, y: 67 },
  cacao: { x: 42, y: 68 },
};

/** Geometría de la lente: círculo centrado en las pechitas que, a escala 1, cubre toda la foto. */
const ASPECT = 2752 / 1536;
const CX = 0.22;
const CY = 0.4;
const R = Math.hypot(1 - CX, (1 - CY) / ASPECT); // radio en unidades del ancho
const LENS_MIN = 0.07;
const pct = (n: number) => `${(n * 100).toFixed(3)}%`;
const LENS = {
  outer: {
    width: pct(2 * R),
    height: pct(2 * R * ASPECT),
    left: pct(CX - R),
    top: pct(CY - R * ASPECT),
  },
  inner: {
    width: pct(1 / (2 * R)),
    height: pct(1 / (2 * R * ASPECT)),
    left: pct((R - CX) / (2 * R)),
    top: pct((R * ASPECT - CY) / (2 * R * ASPECT)),
    transformOrigin: `${CX * 100}% ${CY * 100}%`,
  },
} as const;

/**
 * 06 · Ingredientes
 * Entrada: "lente" — la foto se abre en un círculo que crece desde las
 * pechitas al ritmo del scroll; luego los hotspots brotan uno a uno.
 * El titular entra por letras desde el desenfoque.
 */
export default function Ingredients() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string>(t.ingredients.items[0].id);

  useSectionMotion(root, (q) => {
        const stage = q("[data-stage]")[0];

        // Lente: el contenedor circular escala y la foto se contra-escala (1/s).
        // Solo transform → compuesto en GPU, sin repintar la foto en cada frame.
        const lens = q("[data-lens]")[0];
        const inner = q("[data-lens-inner]")[0];
        const lensState = { s: LENS_MIN };
        const applyLens = () => {
          gsap.set(lens, { scale: lensState.s, force3D: true });
          gsap.set(inner, { scale: 1 / lensState.s, force3D: true });
        };
        applyLens();
        gsap.to(lensState, {
          s: 1,
          ease: "power2.in",
          onUpdate: applyLens,
          scrollTrigger: { trigger: stage, start: "top 90%", end: "center 55%", scrub: 0.8 },
        });

        gsap.from(q("[data-hotspot]"), {
          scale: 0,
          opacity: 0,
          duration: 0.9,
          ease: "back.out(2.2)",
          stagger: 0.14,
          scrollTrigger: { trigger: stage, start: "center 60%" },
        });

        SplitText.create(q("[data-title]"), {
          type: "chars,words",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.chars, {
              opacity: 0,
              filter: "blur(14px)",
              x: () => gsap.utils.random(-20, 20),
              duration: 1.1,
              ease: "power3.out",
              stagger: { each: 0.025, from: "random" },
              scrollTrigger: { trigger: self.elements[0], start: "top 85%" },
            }),
        });

        gsap.from(q("[data-panel-item], [data-eyebrow], [data-hint], [data-hops]"), {
          opacity: 0,
          x: 30,
          stagger: 0.07,
          duration: 0.9,
          scrollTrigger: { trigger: q("[data-panel]")[0], start: "top 80%" },
        });
  });

  const current = t.ingredients.items.find((i) => i.id === active) ?? t.ingredients.items[0];

  return (
    <section
      id="ingredientes"
      ref={root}
      aria-labelledby="ingredients-title"
      className="cv-auto relative overflow-hidden bg-ink py-section xl:py-0"
    >
      <div className="relative">
        {/* Escenario con proporción fija (los hotspots van en % exactos).
            En móvil se recorta a la mitad izquierda, donde están los ingredientes. */}
        <div data-stage className="relative overflow-hidden">
          <div className="relative w-[170%] sm:w-[125%] xl:w-full">
            <div className="relative aspect-[2752/1536]">
              <div data-lens className="absolute overflow-hidden rounded-full" style={LENS.outer}>
                <div data-lens-inner className="absolute" style={LENS.inner}>
                  <Image
                    src="/media/ingredients.png"
                    alt={t.ingredients.imageAlt}
                    fill
                    sizes="(min-width: 1280px) 100vw, 170vw"
                    className="object-cover"
                  />
                  {/* Sombra para que el panel se lea sobre la madera (desktop) */}
                  <div
                    aria-hidden
                    className="absolute inset-0 hidden bg-gradient-to-l from-ink via-ink/70 via-35% to-transparent to-60% xl:block"
                  />
                </div>
              </div>

              {t.ingredients.items.map((item) => {
                const pos = HOTSPOTS[item.id];
                const isActive = item.id === active;
                return (
                  <button
                    key={item.id}
                    type="button"
                    data-hotspot
                    aria-label={item.title}
                    aria-pressed={isActive}
                    aria-controls="ingredient-detail"
                    onClick={() => setActive(item.id)}
                    onMouseEnter={() => setActive(item.id)}
                    onFocus={() => setActive(item.id)}
                    className="group absolute grid size-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  >
                    <span
                      aria-hidden
                      className={`absolute inset-1 rounded-full border border-gold/70 motion-safe:animate-[hotspot-pulse_2.4s_ease-out_infinite] ${
                        isActive ? "opacity-0" : ""
                      }`}
                    />
                    <span
                      aria-hidden
                      className={`relative rounded-full bg-gold shadow-gold-glow transition-all duration-300 ease-brew ${
                        isActive ? "size-5 ring-4 ring-gold/30" : "size-3 group-hover:size-4"
                      }`}
                    />
                    <span
                      aria-hidden
                      className={`pointer-events-none absolute left-full top-1/2 ml-1 hidden -translate-y-1/2 whitespace-nowrap rounded-pill bg-ink/80 px-3 py-1 text-sm text-foam backdrop-blur-md transition-opacity duration-300 sm:block ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {item.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel */}
        <div className="pointer-events-none relative mx-auto flex max-w-site px-gutter xl:absolute xl:inset-0 xl:items-center xl:justify-end">
          <div data-panel className="pointer-events-auto w-full max-w-xl pt-12 xl:w-[36%] xl:pt-0">
            <p data-eyebrow className="mb-5 flex items-center gap-3 text-eyebrow uppercase text-gold">
              <span className="font-display tabular-nums">06</span>
              <span aria-hidden className="h-px w-10 bg-gold-deep" />
              {t.ingredients.eyebrow}
            </p>
            <h2
              id="ingredients-title"
              data-title
              className="font-display text-display-md font-light text-balance text-foam"
            >
              {t.ingredients.title}
            </h2>
            <p data-hint className="mt-5 text-sm text-foam-faint">
              {t.ingredients.hint}
            </p>

            <ul className="mt-8 border-t border-gold/10">
              {t.ingredients.items.map((item, i) => {
                const isActive = item.id === active;
                return (
                  <li key={item.id} data-panel-item className="border-b border-gold/10">
                    <button
                      type="button"
                      aria-expanded={isActive}
                      aria-controls="ingredient-detail"
                      onClick={() => setActive(item.id)}
                      onMouseEnter={() => setActive(item.id)}
                      className="flex min-h-14 w-full cursor-pointer items-center gap-4 py-3 text-left"
                    >
                      <span className="font-display text-sm tabular-nums text-foam-faint">0{i + 1}</span>
                      <span
                        className={`font-display text-2xl transition-colors duration-300 ${
                          isActive ? "text-gold" : "text-foam hover:text-gold-soft"
                        }`}
                      >
                        {item.title}
                      </span>
                      <span
                        aria-hidden
                        className={`ml-auto h-px bg-gold transition-all duration-500 ease-brew ${
                          isActive ? "w-10" : "w-0"
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            <p
              id="ingredient-detail"
              aria-live="polite"
              key={current.id}
              className="mt-6 min-h-[4.8em] text-lg text-foam-muted motion-safe:animate-[fade-up_0.5s_var(--ease-brew)]"
            >
              {current.body}
            </p>

            <p data-hops className="mt-6 text-sm italic text-foam-faint">
              {t.ingredients.hops}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
