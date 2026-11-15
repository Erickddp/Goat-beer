"use client";

import { useSectionMotion } from "@/lib/useSectionMotion";
import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import t from "@/content/i18n/es";

const IMAGES: Record<string, string | null> = {
  chocolate: "/media/pairing-chocolate.png",
  "carne-asada": "/media/pairing-carne-asada.png",
  mole: "/media/pairing-mole.png",
};

/**
 * 07 · Maridaje
 * Entrada: el titular se arma letra por letra amarrado al scroll; luego la
 * sección se fija (pin) y el scroll vertical se convierte en un recorrido
 * horizontal. Cada foto tiene parallax interno y cada tarjeta revela su texto
 * al entrar al cuadro. Sin movimiento: carrusel nativo con scroll-snap.
 */
export default function Pairing() {
  const root = useRef<HTMLElement>(null);

  useSectionMotion(root, (q) => {
        const viewport = q<HTMLElement>("[data-viewport]")[0];
        const track = q<HTMLElement>("[data-track]")[0];
        const pinEl = q<HTMLElement>("[data-pin]")[0];

        SplitText.create(q("[data-title]"), {
          type: "chars,words",
          mask: "chars",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.chars, {
              yPercent: 110,
              ease: "none",
              stagger: 0.04,
              scrollTrigger: { trigger: root.current, start: "top 90%", end: "top 25%", scrub: 0.6 },
            }),
        });

        gsap.from(q("[data-eyebrow], [data-intro]"), {
          opacity: 0,
          y: 24,
          stagger: 0.12,
          scrollTrigger: { trigger: root.current, start: "top 70%" },
        });

        // El carrusel nativo se vuelve un track movido por GSAP
        viewport.scrollLeft = 0;
        gsap.set(viewport, { overflowX: "clip", scrollSnapType: "none" });

        const distance = () => track.scrollWidth - viewport.clientWidth;
        // Recorrido de scroll más largo que el desplazamiento: ritmo pausado
        const pinLength = () => `+=${Math.round(distance() * 1.6)}`;
        const scroll = gsap.to(track, { x: () => -distance(), ease: "none" });

        ScrollTrigger.create({
          trigger: pinEl,
          start: "top top",
          end: pinLength,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          animation: scroll,
        });

        gsap.fromTo(
          q("[data-progress]"),
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: pinEl,
              start: "top top",
              end: pinLength,
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );

        q<HTMLElement>("[data-card]").forEach((card) => {
          const img = card.querySelector("[data-card-img]");
          if (img) {
            gsap.fromTo(
              img,
              { xPercent: -8 },
              {
                xPercent: 8,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: scroll,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              },
            );
          }
          gsap.from(card.querySelectorAll("[data-card-text]"), {
            opacity: 0,
            y: 30,
            stagger: 0.08,
            duration: 0.9,
            scrollTrigger: { trigger: card, containerAnimation: scroll, start: "left 75%" },
          });
        });
  }, { margin: "200% 0px" });

  return (
    <section id="maridaje" ref={root} aria-labelledby="pairing-title" className="relative bg-stout">
      <div data-pin className="flex h-svh flex-col overflow-hidden py-10 md:py-16">
        <div className="mx-auto flex w-full max-w-site flex-col gap-4 px-gutter md:flex-row md:items-end md:justify-between">
          <header>
            <p data-eyebrow className="mb-4 flex items-center gap-3 text-eyebrow uppercase text-gold">
              <span className="font-display tabular-nums">07</span>
              <span aria-hidden className="h-px w-10 bg-gold-deep" />
              {t.pairing.eyebrow}
            </p>
            <h2
              id="pairing-title"
              data-title
              className="font-display text-display-md font-light text-balance text-foam lg:text-display-lg"
            >
              {t.pairing.title}
            </h2>
          </header>
          <p data-intro className="max-w-xs text-sm text-foam-muted md:text-base">
            {t.pairing.intro}
          </p>
        </div>

        <div
          data-viewport
          className="mt-8 flex-1 snap-x snap-mandatory scroll-px-gutter overflow-x-auto overscroll-x-contain md:mt-12"
        >
          <ul data-track className="flex h-full w-max gap-5 px-gutter md:gap-8">
            {t.pairing.items.map((item, i) => {
              const src = IMAGES[item.id];
              return (
                <li
                  key={item.id}
                  data-card
                  className="w-[82vw] shrink-0 snap-start sm:w-[60vw] lg:w-[38vw] xl:w-[34vw]"
                >
                  <article className="flex h-full flex-col overflow-hidden rounded-lg bg-ink shadow-gold-sm">
                    <div className="relative min-h-[8rem] flex-1 overflow-hidden">
                      {src ? (
                        <div data-card-img className="absolute inset-y-0 -inset-x-[10%]">
                          <Image
                            src={src}
                            alt={item.imageAlt}
                            fill
                            sizes="(min-width: 1024px) 40vw, 85vw"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          data-card-img
                          aria-hidden
                          className="absolute inset-y-0 -inset-x-[10%] grid place-items-center bg-[radial-gradient(ellipse_at_30%_30%,var(--color-ruby),var(--color-stout)_55%,var(--color-ink))]"
                        >
                          <span className="font-display text-[clamp(5rem,14vw,10rem)] font-light italic text-gold/25">
                            {item.title}
                          </span>
                        </div>
                      )}
                      {!src && (
                        <span className="absolute bottom-4 left-4 rounded-pill border border-foam/20 px-3 py-1 text-eyebrow uppercase text-foam-muted">
                          {t.pairing.imagePending}
                        </span>
                      )}
                      <span
                        aria-hidden
                        className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-ink/70 font-display text-sm tabular-nums text-gold backdrop-blur-md"
                      >
                        0{i + 1}
                      </span>
                    </div>
                    <div className="p-6 lg:p-8">
                      <h3 data-card-text className="font-display text-3xl font-light text-foam lg:text-4xl">
                        {item.title}
                      </h3>
                      <p data-card-text className="mt-3 max-w-md text-foam-muted">
                        {item.body}
                      </p>
                    </div>
                  </article>
                </li>
              );
            })}

            <li
              data-card
              className="flex w-[82vw] shrink-0 snap-start items-center sm:w-[60vw] lg:w-[34vw] xl:w-[28vw]"
            >
              <div className="flex h-full w-full flex-col justify-center rounded-lg border border-dashed border-gold/40 p-8 lg:p-12">
                <p data-card-text className="font-display text-display-md font-light italic text-foam">
                  {t.pairing.outroTitle}
                </p>
                <p data-card-text className="mt-5 text-foam-muted">
                  {t.pairing.outroBody}
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="mx-auto mt-8 w-full max-w-site px-gutter" aria-hidden>
          <div className="h-px w-full bg-foam/10">
            <div data-progress className="h-px origin-left scale-x-0 bg-gold motion-reduce:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}
