"use client";

import { useSectionMotion } from "@/lib/useSectionMotion";
import { useRef, type ReactNode } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import SectionHeader from "@/components/ui/SectionHeader";
import t from "@/content/i18n/es";

/** Iconos lineales propios (trazo 1.5). pathLength=1 permite "dibujarlos" con GSAP. */
const ICONS: Record<string, ReactNode> = {
  madera: (
    <>
      <path pathLength={1} d="M24 6c10 0 18 8 18 18s-8 18-18 18S6 34 6 24 14 6 24 6Z" />
      <path pathLength={1} d="M24 13c6 0 11 5 11 11s-5 11-11 11-11-5-11-11 5-11 11-11Z" />
      <path pathLength={1} d="M24 19.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z" />
      <path pathLength={1} d="M30 9l-3 9" />
    </>
  ),
  humo: (
    <>
      <path pathLength={1} d="M14 42c-5-6 5-9 0-15s5-9 0-15" />
      <path pathLength={1} d="M24 42c-5-6 5-9 0-15s5-9 0-15s5-6 0-9" />
      <path pathLength={1} d="M34 42c-5-6 5-9 0-15s5-9 0-15" />
    </>
  ),
  mezquite: (
    <>
      <path pathLength={1} d="M7 41c4-12 13-25 33-34-2 14-14 27-33 34Z" />
      <path pathLength={1} d="M11 37c7-7 15-16 25-26" />
      <path pathLength={1} d="M17 33.5a1.5 1.5 0 1 0 0-.1M23 27.5a1.5 1.5 0 1 0 0-.1M29 21a1.5 1.5 0 1 0 0-.1" />
    </>
  ),
  cuerpo: (
    <>
      <path pathLength={1} d="M5 16c6-5 13 5 19 0s13-5 19 0" />
      <path pathLength={1} d="M5 24c6-5 13 5 19 0s13-5 19 0" />
      <path pathLength={1} d="M5 32c6-5 13 5 19 0s13-5 19 0" />
    </>
  ),
};

/**
 * 05 · Notas de cata
 * Entrada: "reparto de cartas" — cada tarjeta cae girada desde abajo, se
 * endereza y su icono se dibuja trazo por trazo. El titular entra por palabras
 * con un leve giro 3D.
 */
export default function Tasting() {
  const root = useRef<HTMLElement>(null);

  useSectionMotion(root, (q) => {

        SplitText.create(q("[data-title]"), {
          type: "words",
          mask: "words",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.words, {
              yPercent: 120,
              rotationX: -70,
              transformOrigin: "50% 100%",
              stagger: 0.08,
              duration: 1.2,
              scrollTrigger: { trigger: self.elements[0], start: "top 85%" },
            }),
        });

        gsap.from(q("[data-eyebrow], [data-warmth]"), {
          opacity: 0,
          y: 20,
          stagger: 0.15,
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });

        // Fondo de espuma: deriva lenta
        gsap.fromTo(
          q("[data-foam]"),
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );

        const cards = q<HTMLElement>("[data-card]");
        cards.forEach((card, i) => {
          gsap.set(card, {
            y: 160,
            rotation: i % 2 ? 7 : -7,
            opacity: 0,
            transformOrigin: "50% 100%",
          });
          gsap.set(card.querySelectorAll("path"), { strokeDasharray: 1, strokeDashoffset: 1 });
        });

        ScrollTrigger.batch(cards, {
          start: "top 88%",
          once: true,
          onEnter: (batch) => {
            const tl = gsap.timeline();
            tl.to(batch, {
              y: 0,
              rotation: 0,
              opacity: 1,
              duration: 1.3,
              ease: "expo.out",
              stagger: 0.12,
            });
            batch.forEach((card, i) => {
              tl.to(
                (card as HTMLElement).querySelectorAll("path"),
                { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut", stagger: 0.12 },
                0.35 + i * 0.12,
              );
            });
          },
        });
  });

  return (
    <section
      id="cata"
      ref={root}
      aria-labelledby="tasting-title"
      className="cv-auto relative overflow-hidden py-section"
    >
      {/* Textura de espuma muy tenue */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[70%] overflow-hidden">
        <div data-foam className="relative size-full opacity-[0.12] will-change-transform">
          <Image src="/media/texture-foam.jpg" alt="" fill sizes="100vw" quality={60} className="object-cover" />
        </div>
        {/* Desvanecido con degradado en vez de mask-image (más barato al hacer scroll) */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink/60 to-ink" />
      </div>

      <div className="relative mx-auto max-w-site px-gutter">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeader
            index="05"
            eyebrow={t.tasting.eyebrow}
            title={t.tasting.title}
            id="tasting-title"
            className="lg:col-span-7 [perspective:800px]"
          />
          <p data-warmth className="max-w-md text-lg text-foam-muted lg:col-span-5 lg:justify-self-end">
            {t.tasting.warmth}
          </p>
        </div>

        <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {t.tasting.notes.map((note, i) => (
            <li key={note.id} data-card>
              <article className="group relative flex h-full min-h-[22rem] flex-col rounded-lg bg-stout p-7 shadow-gold-sm inset-shadow-stout transition-shadow duration-300 ease-brew hover:shadow-gold-md lg:p-8">
                <span
                  aria-hidden
                  className="absolute right-7 top-7 font-display text-sm tabular-nums text-foam-faint"
                >
                  0{i + 1}
                </span>
                <svg
                  aria-hidden
                  viewBox="0 0 48 48"
                  className="size-14 fill-none stroke-gold transition-transform duration-500 ease-brew group-hover:-rotate-6"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {ICONS[note.id]}
                </svg>
                <h3 className="mt-auto pt-12 font-display text-3xl font-light text-foam">{note.title}</h3>
                <p className="mt-3 text-foam-muted">{note.body}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
