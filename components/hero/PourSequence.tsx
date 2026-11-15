"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { useSectionMotion } from "@/lib/useSectionMotion";
import { useSound } from "@/lib/sound";
import { useDeferredMount } from "@/lib/useDeferredMount";
import { beats, source } from "@/content/hero";
import KeyframeLayer from "./KeyframeLayer";
import FrameCanvas from "./FrameCanvas";
import type { SequenceLayerHandle } from "./types";
import t from "@/content/i18n/es";

/** Recorrido pinned extra: 300% + el propio viewport = ~4 alturas de pantalla. */
const PIN_LENGTH = "+=300%";

/**
 * 02 · Hero "destape y servido".
 * Sección fijada (~400vh) con UNA timeline ligada al scroll (scrub):
 * capa visual (keyframes hoy, frames de pour.mp4 mañana) + 3 textos SplitText
 * + "pop" al cruzar el destape + la espuma que sube y cubre la pantalla.
 * prefers-reduced-motion: sin pin, kf-04 fija con el titular "Mezquite Stout" (solo CSS).
 */
export default function PourSequence() {
  const root = useRef<HTMLElement>(null);
  const layer = useRef<SequenceLayerHandle>(null);
  const foamReady = useDeferredMount();

  useSectionMotion(
    root,
    (q) => {
      const tl = gsap.timeline({ defaults: { ease: "none" } });
      // Duración normalizada: 1 = todo el recorrido
      tl.set({}, {}, 1);

      layer.current?.addTo(tl);

      // --- Textos ---
      const [beat1, beat2, beat3] = q("[data-beat]");
      const split = (el: HTMLElement) =>
        SplitText.create(el.querySelector("[data-split]") ?? el, { type: "chars,words", mask: "chars" });

      const s1 = split(beat1);
      const s2 = split(beat2);
      const s3 = split(beat3);
      gsap.set([beat2, beat3], { autoAlpha: 0 });
      gsap.set([...s2.chars, ...s3.chars], { yPercent: 110 });
      const extras3 = beat3.querySelectorAll("[data-beat-extra]");
      gsap.set(extras3, { opacity: 0, y: 16 });

      // Al salir subimos de sobra (-160%) y desvanecemos el bloque: los rasgos que
      // bajan de la línea (la "p" de Destápala) no deben quedar asomando en la máscara.
      const out = (chars: Element[], at: number) => {
        const beat = (chars[0] as HTMLElement | undefined)?.closest("[data-beat]");
        tl.to(chars, { yPercent: -160, duration: 0.05, stagger: 0.003, ease: "power2.in" }, at);
        if (beat) tl.to(beat, { autoAlpha: 0, duration: 0.02 }, at + 0.045);
        return tl;
      };
      const into = (chars: Element[], at: number) => {
        const beat = (chars[0] as HTMLElement | undefined)?.closest("[data-beat]");
        if (beat) tl.fromTo(beat, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.005, immediateRender: false }, at);
        return tl.to(chars, { yPercent: 0, duration: 0.05, stagger: 0.003, ease: "power3.out" }, at);
      };

      out(s1.chars, beats.destapaOut - 0.05);
      tl.to(beat1.querySelectorAll("[data-beat-extra]"), { opacity: 0, duration: 0.03 }, beats.destapaOut - 0.05);
      into(s2.chars, beats.mezquiteIn);
      out(s2.chars, beats.mezquiteOut - 0.05);
      into(s3.chars, beats.fronteraIn);
      tl.to(extras3, { opacity: 1, y: 0, duration: 0.04 }, beats.fronteraIn + 0.03);
      out(s3.chars, beats.fronteraOut - 0.04);
      tl.to(extras3, { opacity: 0, duration: 0.03 }, beats.fronteraOut - 0.04);

      // Indicador de scroll
      tl.to(q("[data-hint]"), { opacity: 0, y: 20, duration: 0.04 }, 0.01);

      // --- Espuma que sube y cubre la pantalla ---
      // y: 0 explícito: GSAP lee el translateY(100%) inicial como píxeles (y) y lo sumaría a yPercent
      tl.fromTo(
        q("[data-foam]"),
        { y: 0, yPercent: 100 },
        { y: 0, yPercent: 0, duration: 1 - beats.foamStart, ease: "power1.inOut" },
        beats.foamStart,
      );

      // --- Pin + sonido ---
      const play = useSound.getState().play;
      let last = 0;
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: PIN_LENGTH,
        pin: true,
        scrub: 0.6,
        animation: tl,
        onUpdate: (self) => {
          const p = self.progress;
          // Solo hacia adelante: no "re-destapar" al regresar
          if (last < beats.pop && p >= beats.pop && self.direction === 1) play("pop");
          last = p;
        },
      });
    },
    { margin: "0px" },
  );

  return (
    <section
      id="inicio"
      ref={root}
      aria-label={`${t.hero.beats[1]}. ${t.hero.tagline}`}
      className="relative h-svh overflow-hidden bg-ink"
    >
      {/* Capa visual (keyframes o frames, según content/hero.ts) */}
      {source.kind === "keyframes" ? (
        <KeyframeLayer ref={layer} source={source} />
      ) : (
        <FrameCanvas ref={layer} source={source} />
      )}

      {/* Viñeta para leer los textos */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(10_8_6/0.75)_100%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/90 to-transparent" />

      {/* Textos */}
      <div className="pointer-events-none absolute inset-0">
        {/* 1 · Destápala. (sobre kf-01, a la izquierda: zona negra libre) */}
        <div
          data-beat
          className="absolute inset-x-0 bottom-[14svh] px-gutter text-center motion-reduce:hidden md:bottom-[16svh] md:left-[6vw] md:right-auto md:max-w-[34vw] md:text-left"
        >
          <p data-beat-extra className="text-eyebrow uppercase text-gold">
            {t.hero.eyebrow}
          </p>
          <p data-split className="mt-3 font-display text-display-xl font-light italic text-foam">
            {t.hero.beats[0]}
          </p>
        </div>

        {/* 2 · Mezquite Stout (sobre kf-03). Es el h1 de la página. */}
        <div
          data-beat
          className="absolute inset-x-0 bottom-[14svh] px-gutter text-center opacity-0 motion-reduce:opacity-100 md:bottom-[12svh] md:left-[6vw] md:right-auto md:text-left"
        >
          <h1 data-split className="font-display text-display-xl font-light text-foam">
            {t.hero.beats[1]}
          </h1>
        </div>

        {/* 3 · Hecha en la frontera. (sobre kf-04, a la derecha) */}
        <div
          data-beat
          className="absolute inset-x-0 bottom-[14svh] px-gutter text-center opacity-0 motion-reduce:hidden md:bottom-[18svh] md:left-auto md:right-[5vw] md:max-w-[38vw] md:text-right"
        >
          <p data-split className="font-display text-display-lg font-light italic text-foam motion-reduce:text-display-md">
            {t.hero.beats[2]}
          </p>
          <p data-beat-extra className="mt-4 text-foam-muted md:ml-auto md:max-w-sm">
            {t.hero.tagline}
          </p>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div
        data-hint
        aria-hidden
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-eyebrow uppercase text-foam-faint motion-reduce:hidden"
      >
        {t.hero.scrollHint}
        <span className="relative h-10 w-px overflow-hidden bg-foam/15">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-gold motion-safe:animate-[scroll-hint_1.8s_var(--ease-brew)_infinite]" />
        </span>
      </div>

      {/* Espuma: sube con borde ondulado y cubre la pantalla (transición a La historia) */}
      <div
        data-foam
        aria-hidden
        className="hero-foam pointer-events-none absolute inset-x-0 -bottom-px top-0 motion-reduce:hidden"
        // transform (no la clase translate-y-full): Tailwind v4 usa la propiedad `translate`, que GSAP no anima
        style={{ transform: "translateY(100%)" }}
      >
        {foamReady && (
          <Image src="/media/texture-foam.jpg" alt="" fill sizes="100vw" quality={60} className="object-cover" />
        )}
        {/* Se oscurece hacia abajo para empalmar con el fondo de La historia */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink/40 via-55% to-ink" />
      </div>
    </section>
  );
}
