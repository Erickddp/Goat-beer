"use client";

import { useSectionMotion } from "@/lib/useSectionMotion";
import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText } from "@/lib/gsap";
import SectionHeader from "@/components/ui/SectionHeader";
import t from "@/content/i18n/es";

/**
 * 03 · La historia
 * Entrada: "cortina" — la foto se descubre de abajo hacia arriba con clip-path
 * mientras el titular sube línea por línea desde una máscara. Cierre con
 * una frase que se "enciende" palabra por palabra al ritmo del scroll.
 */
export default function Story() {
  const root = useRef<HTMLElement>(null);

  useSectionMotion(root, (q) => {

        // Titular: líneas enmascaradas
        SplitText.create(q("[data-title]"), {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.3,
              stagger: 0.12,
              scrollTrigger: { trigger: self.elements[0], start: "top 85%" },
            }),
        });

        gsap.from(q("[data-eyebrow], [data-coords]"), {
          opacity: 0,
          x: -24,
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });

        // Párrafos: líneas con máscara, más suaves
        q("[data-paragraph]").forEach((p) => {
          SplitText.create(p, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.06,
                scrollTrigger: { trigger: p, start: "top 88%" },
              }),
          });
        });

        // Cortina sobre la foto + zoom-out del contenido
        const figure = q("[data-figure]")[0];
        gsap
          .timeline({ scrollTrigger: { trigger: figure, start: "top 80%" } })
          .fromTo(
            figure,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" },
          )
          .from(q("[data-figure-img]"), { scale: 1.35, duration: 2.2, ease: "expo.out" }, 0.2)
          .from(q("[data-figure-caption]"), { opacity: 0, y: 16, duration: 0.8 }, 1.2);

        // Parallax continuo de la foto
        gsap.fromTo(
          q("[data-parallax]"),
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: figure, start: "top bottom", end: "bottom top", scrub: true },
          },
        );

        // Frase de cierre: palabras que se encienden con el scroll
        const closing = q("[data-closing]")[0];
        SplitText.create(closing, {
          type: "words",
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(
              self.words,
              { opacity: 0.12 },
              {
                opacity: 1,
                ease: "none",
                stagger: 0.3,
                scrollTrigger: { trigger: closing, start: "top 85%", end: "top 45%", scrub: true },
              },
            ),
        });
  });

  return (
    <section
      id="historia"
      ref={root}
      aria-labelledby="story-title"
      className="relative overflow-hidden py-section"
    >
      {/* Brasa rubí de fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-1/4 top-1/4 size-[70vw] rounded-full bg-ruby/40 blur-[120px]"
      />

      <div className="relative mx-auto grid max-w-site gap-14 px-gutter lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5 lg:pt-16">
          <SectionHeader index="03" eyebrow={t.story.eyebrow} title={t.story.title} id="story-title" />
          <p data-coords className="mt-6 font-display text-sm tabular-nums tracking-widest text-foam-faint">
            {t.story.coords}
          </p>
          <div className="mt-10 max-w-[38rem] space-y-6 text-lg text-foam-muted">
            {t.story.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} data-paragraph>
                {p}
              </p>
            ))}
          </div>
        </div>

        <figure
          data-figure
          className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-gold-sm sm:aspect-[16/10] lg:col-span-7 lg:aspect-[4/5]"
        >
          <div data-parallax className="absolute inset-x-0 -inset-y-[10%]">
            <div data-figure-img className="relative size-full">
              <Image
                src="/media/desert-border.png"
                alt={t.story.imageAlt}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover object-[35%_center]"
              />
            </div>
          </div>
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/90 to-transparent"
          />
          <figcaption
            data-figure-caption
            className="absolute bottom-5 left-5 right-5 flex items-center gap-3 text-eyebrow uppercase text-foam"
          >
            <span aria-hidden className="size-1.5 rounded-full bg-gold" />
            {t.story.place}
          </figcaption>
        </figure>
      </div>

      <p
        data-closing
        className="relative mx-auto mt-section max-w-site px-gutter text-center font-display text-display-lg font-light italic text-foam"
      >
        {t.story.closing}
      </p>
    </section>
  );
}
