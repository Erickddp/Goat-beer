"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { useSectionMotion } from "@/lib/useSectionMotion";
import { useSound } from "@/lib/sound";
import { useDeferredMount } from "@/lib/useDeferredMount";
import { beats, chapters, source } from "@/content/hero";
import KeyframeLayer from "./KeyframeLayer";
import FrameCanvas from "./FrameCanvas";
import type { SequenceLayerHandle } from "./types";
import t from "@/content/i18n/es";

/** Recorrido pinned extra: 300% + el propio viewport = 4 alturas de pantalla. */
const PIN_LENGTH = "+=300%";

/**
 * 02 · Hero "destape y servido".
 * Sección fijada con UNA timeline ligada al scroll (scrub): video del destape en
 * <canvas> con cámara virtual, espuma (overflow.mp4) que baja y cubre la pantalla,
 * 3 titulares SplitText, capítulos, y el pop con sonido + destello + sacudida.
 * Fallback sin frames: 4 keyframes con crossfade (content/hero.ts).
 * prefers-reduced-motion: sin pin, imagen fija con el titular.
 */
export default function PourSequence() {
  const root = useRef<HTMLElement>(null);
  const layer = useRef<SequenceLayerHandle>(null);
  const overlay = useRef<SequenceLayerHandle>(null);
  const deferred = useDeferredMount();
  const [posterHidden, setPosterHidden] = useState(false);
  const frames = source.kind === "frames" ? source : null;

  useSectionMotion(
    root,
    (q) => {
      const tl = gsap.timeline({ defaults: { ease: "none" } });
      tl.set({}, {}, 1); // duración normalizada: 1 = todo el recorrido

      layer.current?.addTo(tl);
      overlay.current?.addTo(tl);

      // --- Titulares ---
      const [beat1, beat2, beat3] = q("[data-beat]");

      // 1 · "Destápala." — visible al inicio; al destapar, las letras salen volando
      const s1 = SplitText.create(beat1.querySelector("[data-split]")!, { type: "chars" });
      const span = beats.pop - beats.destapaOut + 0.02;
      tl.to(
        s1.chars,
        {
          yPercent: () => gsap.utils.random(-260, -120),
          xPercent: () => gsap.utils.random(-80, 80),
          rotation: () => gsap.utils.random(-50, 50),
          opacity: 0,
          duration: span,
          stagger: { each: span / 20, from: "center" },
          ease: "power2.in",
        },
        beats.destapaOut - 0.01,
      ).to(beat1.querySelectorAll("[data-beat-extra]"), { opacity: 0, y: -10, duration: 0.02 }, beats.destapaOut - 0.02);

      // 2 · "Mezquite / Stout" — sube letra por letra y se desliza mientras dura
      const s2 = SplitText.create(beat2.querySelectorAll("[data-split]"), { type: "chars", mask: "chars" });
      gsap.set(beat2, { autoAlpha: 1 });
      gsap.set(s2.chars, { yPercent: 115 });
      const life2 = beats.mezquiteOut - beats.mezquiteIn;
      tl.to(s2.chars, { yPercent: 0, duration: 0.06, stagger: 0.004, ease: "power3.out" }, beats.mezquiteIn)
        .fromTo(beat2.querySelector("[data-line='a']"), { xPercent: 0 }, { xPercent: -6, duration: life2 }, beats.mezquiteIn)
        .fromTo(beat2.querySelector("[data-line='b']"), { xPercent: 0 }, { xPercent: 6, duration: life2 }, beats.mezquiteIn)
        .to(s2.chars, { yPercent: -120, duration: 0.05, stagger: 0.003, ease: "power2.in" }, beats.mezquiteOut - 0.05)
        .fromTo(beat2.querySelector("[data-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 0.08, ease: "power2.out" }, beats.mezquiteIn + 0.02)
        .to(beat2.querySelector("[data-rule]"), { scaleX: 0, transformOrigin: "right center", duration: 0.04 }, beats.mezquiteOut - 0.05);

      // 3 · "Hecha en la frontera." + frase
      const s3 = SplitText.create(beat3.querySelector("[data-split]")!, { type: "words,chars", mask: "chars" });
      const extras3 = beat3.querySelectorAll("[data-beat-extra]");
      gsap.set(beat3, { autoAlpha: 1 });
      gsap.set(s3.chars, { yPercent: 115 });
      gsap.set(extras3, { opacity: 0, y: 16 });
      tl.to(s3.chars, { yPercent: 0, duration: 0.05, stagger: 0.003, ease: "power3.out" }, beats.fronteraIn)
        .to(extras3, { opacity: 1, y: 0, duration: 0.04, stagger: 0.01 }, beats.fronteraIn + 0.03)
        .to(s3.chars, { yPercent: -120, duration: 0.04, stagger: 0.002, ease: "power2.in" }, beats.fronteraOut - 0.04)
        .to(extras3, { opacity: 0, duration: 0.03 }, beats.fronteraOut - 0.04);

      // --- Capítulos + barra de progreso ---
      tl.fromTo(q("[data-hud-fill]"), { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0)
        .fromTo(q("[data-hud-fill-x]"), { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
        .to(q("[data-hud]"), { autoAlpha: 0, duration: 0.04 }, 0.9)
        .to(q("[data-hint]"), { opacity: 0, y: 20, duration: 0.03 }, 0.01);
      const chapterEls = q("[data-chapter]");
      const setChapter = (p: number) => {
        let active = 0;
        chapters.forEach((c, i) => {
          if (p >= c.from) active = i;
        });
        chapterEls.forEach((el, i) => {
          const on = i === active ? "1" : "0";
          if (el.dataset.active !== on) el.dataset.active = on;
        });
      };

      // --- Fallback sin frames: espuma con textura + máscara ---
      const cssFoam = q("[data-foam]")[0];
      if (cssFoam) {
        tl.fromTo(cssFoam, { y: 0, yPercent: 100 }, { y: 0, yPercent: 0, duration: 1 - beats.foamStart, ease: "power1.inOut" }, beats.foamStart);
      }
      // Mientras la espuma cubre, el video de abajo se apaga (si no, la copa se transparenta)
      tl.to(q("[data-main]"), { opacity: 0.12, duration: 0.22, ease: "power1.in" }, beats.foamStart + 0.06);
      // Empalme con La historia: el fondo se oscurece hacia abajo al final
      tl.fromTo(q("[data-handoff]"), { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.9);

      // --- Pop: destello + sacudida (no van con scrub: son un golpe) ---
      const stage = q("[data-stage]")[0];
      const flash = q("[data-flash]")[0];
      const popFx = () => {
        gsap.fromTo(flash, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1.4, duration: 0.18, ease: "power2.out" });
        gsap.to(flash, { opacity: 0, scale: 1.9, duration: 0.7, delay: 0.18, ease: "power2.out" });
        gsap.fromTo(
          stage,
          { x: 0, y: 0 },
          {
            keyframes: { x: [0, -7, 6, -4, 3, -1, 0], y: [0, 5, -6, 3, -2, 1, 0] },
            duration: 0.42,
            ease: "none",
          },
        );
      };

      // --- Pin + sonido ---
      const sound = useSound.getState();
      let last = 0;
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: PIN_LENGTH,
        pin: true,
        scrub: 0.8,
        animation: tl,
        onUpdate: (self) => {
          const p = tl.progress();
          if (self.direction === 1) {
            if (last < beats.pop && p >= beats.pop) {
              sound.play("pop");
              popFx();
            }
            if (last < beats.pour && p >= beats.pour) sound.play("pour");
          }
          setChapter(p);
          last = p;
        },
      });
      setChapter(0);
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
      <div data-stage className="absolute inset-0 will-change-transform">
        {frames ? (
          <>
            {/* Póster: primer frame desde el HTML (y la copa servida con movimiento reducido) */}
            <picture>
              <source media="(prefers-reduced-motion: reduce) and (max-width: 767px)" srcSet={frames.reducedPoster.mobile} />
              <source media="(prefers-reduced-motion: reduce)" srcSet={frames.reducedPoster.desktop} />
              <source media="(max-width: 767px)" srcSet={frames.main.mobile(1)} />
              <img
                src={frames.main.desktop(1)}
                alt=""
                fetchPriority="high"
                className={`hero-poster transition-opacity duration-300 ${posterHidden ? "motion-safe:opacity-0" : ""}`}
              />
            </picture>
            <div data-main className="absolute inset-0 motion-reduce:hidden">
              <FrameCanvas ref={layer} seq={frames.main} preload={deferred} onReady={() => setPosterHidden(true)} />
            </div>
          </>
        ) : source.kind === "keyframes" ? (
          <KeyframeLayer ref={layer} source={source} />
        ) : null}

        {/* Destello del pop */}
        <div
          data-flash
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[15%] size-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(255_236_190/0.55),rgb(212_165_55/0.25)_35%,transparent_70%)] opacity-0 mix-blend-screen"
        />
      </div>

      {/* Viñeta para leer los textos */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgb(10_8_6/0.7)_100%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/85 to-transparent" />

      {/* Espuma en video (overflow.mp4): baja desde arriba y cubre la pantalla */}
      {frames?.overlay && (
        <div className="pointer-events-none absolute inset-0 motion-reduce:hidden">
          <FrameCanvas ref={overlay} seq={frames.overlay} preload={deferred} />
        </div>
      )}

      {/* Titulares */}
      <div className="pointer-events-none absolute inset-0">
        {/* 1 · Destápala. */}
        <div
          data-beat
          className="absolute inset-x-0 bottom-[13svh] px-gutter text-center motion-reduce:hidden md:bottom-[14svh] md:left-[7vw] md:right-auto md:text-left"
        >
          <p data-beat-extra className="text-eyebrow uppercase text-gold">
            {t.hero.eyebrow}
          </p>
          <p data-split className="mt-3 font-display text-[clamp(3.75rem,13vw,12rem)] font-light italic leading-[0.9] tracking-[-0.03em] text-foam">
            {t.hero.beats[0]}
          </p>
        </div>

        {/* 2 · Mezquite Stout — h1 de la página */}
        <div
          data-beat
          className="absolute inset-x-0 bottom-[10svh] px-gutter opacity-0 motion-reduce:opacity-100 md:bottom-[9svh] md:left-[5vw] md:right-auto"
        >
          <h1 className="flex flex-col font-display font-light leading-[0.86] tracking-[-0.035em] text-foam max-md:items-center">
            <span data-line="a" className="block text-[clamp(3.5rem,12.5vw,13rem)]">
              <span data-split>Mezquite</span>
            </span>
            <span data-line="b" className="flex items-center gap-[2vw] text-[clamp(3.5rem,12.5vw,13rem)] italic text-gold md:pl-[16vw]">
              <span data-rule aria-hidden className="hidden h-px w-[12vw] origin-left bg-gold/70 md:block" />
              <span data-split>Stout</span>
            </span>
          </h1>
        </div>

        {/* 3 · Hecha en la frontera. (la botella ya salió de cuadro: lado izquierdo libre) */}
        <div
          data-beat
          className="absolute inset-x-0 bottom-[13svh] px-gutter text-center opacity-0 motion-reduce:hidden md:bottom-[16svh] md:left-[7vw] md:right-auto md:max-w-[40vw] md:text-left"
        >
          <p data-beat-extra className="text-eyebrow uppercase tabular-nums text-gold">
            31.69° N · 106.42° O
          </p>
          <p data-split className="mt-3 font-display text-display-lg font-light italic text-foam">
            {t.hero.beats[2]}
          </p>
          <p data-beat-extra className="mt-4 text-foam-muted md:max-w-sm">
            {t.hero.tagline}
          </p>
        </div>
      </div>

      {/* Capítulos: lateral en escritorio, barra superior en móvil */}
      <div data-hud aria-hidden className="pointer-events-none absolute inset-0 motion-reduce:hidden">
        <div className="absolute right-[4vw] top-1/2 hidden -translate-y-1/2 items-stretch gap-5 md:flex">
          <ol className="flex flex-col justify-between gap-10 text-right">
            {chapters.map((c, i) => (
              <li
                key={c.label}
                data-chapter
                data-active={i === 0 ? "1" : "0"}
                className="text-eyebrow uppercase text-foam-faint transition-colors duration-300 data-[active=1]:text-gold"
              >
                <span className="mr-2 font-display tabular-nums">0{i + 1}</span>
                {c.label}
              </li>
            ))}
          </ol>
          <span className="relative w-px bg-foam/15">
            <span data-hud-fill className="absolute inset-0 origin-top bg-gold" />
          </span>
        </div>
        <div className="absolute inset-x-0 top-16 px-gutter md:hidden">
          <span className="relative block h-px bg-foam/15">
            <span data-hud-fill-x className="absolute inset-0 origin-left bg-gold" />
          </span>
          <ol className="mt-2 flex justify-between">
            {chapters.map((c, i) => (
              <li
                key={c.label}
                data-chapter
                data-active={i === 0 ? "1" : "0"}
                className="text-[0.65rem] uppercase tracking-[0.18em] text-foam-faint transition-colors duration-300 data-[active=1]:text-gold"
              >
                {c.label}
              </li>
            ))}
          </ol>
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

      {/* Fallback (sin frames): espuma con textura y borde ondulado */}
      {!frames?.overlay && (
        <div
          data-foam
          aria-hidden
          className="hero-foam pointer-events-none absolute inset-x-0 -bottom-px top-0 motion-reduce:hidden"
          style={{ transform: "translateY(100%)" }}
        >
          {deferred && <Image src="/media/texture-foam.jpg" alt="" fill sizes="100vw" quality={60} className="object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink/40 via-55% to-ink" />
        </div>
      )}

      {/* Empalme con La historia */}
      <div
        data-handoff
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-ink/30 via-50% to-ink opacity-0"
      />
    </section>
  );
}
