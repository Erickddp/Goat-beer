"use client";

import { useSectionMotion } from "@/lib/useSectionMotion";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import SectionHeader from "@/components/ui/SectionHeader";
import { products } from "@/content/products";
import t from "@/content/i18n/es";

const specs = products.find((p) => p.featured)?.specs ?? { abv: 6, ibu: 25, srm: 30, volumeMl: 355 };
const SRM_MAX = 40;
const srmPct = (specs.srm / SRM_MAX) * 100;

/** Escala SRM aproximada (paja → ámbar → café → negro), posiciones en % de 0–40. */
const SRM_GRADIENT =
  "linear-gradient(90deg,#f6eaa6 0%,#f2d36a 6%,#e9b545 12%,#d99234 20%,#c0742c 28%,#9b5424 38%,#743a1c 50%,#4e2416 62%,#35160f 72%,#24100b 82%,#160a07 92%,#0f0806 100%)";

const stats = [
  { key: "abv", label: t.specs.abv, value: specs.abv, suffix: "%", unit: "ABV", note: t.specs.abvNote },
  { key: "ibu", label: t.specs.ibu, value: specs.ibu, suffix: "", unit: "IBU", note: t.specs.ibuNote },
  { key: "srm", label: t.specs.srm, value: specs.srm, suffix: "", unit: "SRM", note: t.specs.srmNote },
];

const scaleLabels = t.specs.srmScaleLabels.map((label, i) => ({
  label,
  // Pilsner ~3, Ámbar ~10, Brown ~20, Stout ~30, Noche ~40
  at: [3, 10, 20, 30, 40][i] / SRM_MAX,
}));

/**
 * 04 · Ficha técnica
 * Entrada: "instrumento de medición" — las líneas se trazan de izquierda a
 * derecha, los números ruedan desde abajo y cuentan hasta su valor, y la barra
 * SRM se llena del tono stout amarrada al scroll, con el marcador viajando.
 */
export default function Specs() {
  const root = useRef<HTMLElement>(null);

  useSectionMotion(root, (q) => {

        gsap.from(q("[data-eyebrow], [data-title], [data-intro]"), {
          opacity: 0,
          y: 40,
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });

        q("[data-stat]").forEach((stat, i) => {
          const tl = gsap.timeline({
            delay: i * 0.12,
            scrollTrigger: { trigger: stat, start: "top 85%" },
          });
          tl.from(stat.querySelector("[data-line]"), {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1.2,
            ease: "expo.inOut",
          })
            .from(stat.querySelector("[data-digits]"), { yPercent: 100, duration: 1.2 }, 0.3)
            .from(
              stat.querySelector("[data-count]"),
              { textContent: 0, snap: { textContent: 1 }, duration: 1.8, ease: "power3.out" },
              0.3,
            )
            .from(stat.querySelectorAll("[data-fade]"), { opacity: 0, y: 12, stagger: 0.08, duration: 0.8 }, 0.7);
        });

        // Barra SRM: relleno + marcador ligados al scroll
        const bar = q("[data-srm-bar]")[0];
        const value = q("[data-srm-value]")[0];
        const counter = { v: 0 };
        gsap
          .timeline({
            scrollTrigger: { trigger: bar, start: "top 85%", end: "top 40%", scrub: 0.6 },
            defaults: { ease: "none" },
          })
          .fromTo(
            q("[data-srm-fill]"),
            { clipPath: "inset(0% 100% 0% 0%)" },
            { clipPath: `inset(0% ${100 - srmPct}% 0% 0%)` },
          )
          .fromTo(q("[data-srm-marker]"), { left: "0%" }, { left: `${srmPct}%` }, 0)
          .to(
            counter,
            {
              v: specs.srm,
              onUpdate: () => {
                if (value) value.textContent = String(Math.round(counter.v));
              },
            },
            0,
          );

        gsap.from(q("[data-srm-label], [data-srm-caption], [data-detail]"), {
          opacity: 0,
          y: 10,
          stagger: 0.05,
          duration: 0.8,
          scrollTrigger: { trigger: bar, start: "top 75%" },
        });
  });

  return (
    <section
      id="ficha"
      ref={root}
      aria-labelledby="specs-title"
      className="cv-auto relative border-y border-gold/10 bg-stout py-section"
    >
      <div className="mx-auto max-w-site px-gutter">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader index="04" eyebrow={t.specs.eyebrow} title={t.specs.title} id="specs-title" />
          <p data-intro className="max-w-sm text-lg text-foam-muted">
            {t.specs.intro}
          </p>
        </div>

        {/* Números */}
        <dl className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8 lg:mt-24">
          {stats.map((s) => (
            <div key={s.key} data-stat className="flex flex-col">
              <span data-line aria-hidden className="mb-6 block h-px w-full bg-gold-deep" />
              <dt data-fade className="text-eyebrow uppercase text-foam-faint">
                {s.label}
              </dt>
              <dd className="mt-3">
                <span className="block overflow-hidden pb-2">
                  <span
                    data-digits
                    className="flex items-baseline font-display text-[clamp(5rem,13vw,11rem)] font-light leading-[0.9] tabular-nums text-foam"
                  >
                    <span data-count>{s.value}</span>
                    {s.suffix && <span className="text-[0.45em] text-gold">{s.suffix}</span>}
                    <span className="ml-3 text-eyebrow uppercase not-italic text-gold">{s.unit}</span>
                  </span>
                </span>
                <span data-fade className="mt-4 block max-w-xs text-foam-muted">
                  {s.note}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        {/* Barra SRM */}
        <figure className="mt-20 lg:mt-28" aria-labelledby="srm-caption">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <span data-srm-label className="text-eyebrow uppercase text-foam-faint">
              {t.specs.srmScaleTitle}
            </span>
            <span data-srm-label className="font-display text-sm tabular-nums text-foam-faint">
              0 — {SRM_MAX}
            </span>
          </div>

          <div data-srm-bar className="relative">
            <div className="relative h-14 overflow-hidden rounded-pill bg-ink shadow-gold-sm md:h-20">
              <div
                data-srm-fill
                aria-hidden
                className="absolute inset-0"
                style={{ background: SRM_GRADIENT, clipPath: `inset(0% ${100 - srmPct}% 0% 0%)` }}
              />
              {/* Brillo de líquido */}
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-foam/15 to-transparent"
              />
              {/* Marcas cada 10 SRM */}
              {[10, 20, 30].map((m) => (
                <span
                  key={m}
                  aria-hidden
                  className="absolute inset-y-3 w-px bg-foam/15"
                  style={{ left: `${(m / SRM_MAX) * 100}%` }}
                />
              ))}
            </div>

            {/* Marcador que viaja con el relleno */}
            <div
              data-srm-marker
              aria-hidden
              className="pointer-events-none absolute -top-3 -bottom-3 w-0"
              style={{ left: `${srmPct}%` }}
            >
              <span className="absolute inset-y-0 left-0 w-0.5 -translate-x-1/2 rounded-full bg-gold shadow-gold-glow" />
              <span className="absolute -top-9 left-0 -translate-x-1/2 whitespace-nowrap rounded-pill bg-gold px-3 py-1 font-display text-sm font-semibold tabular-nums text-ink">
                SRM <span data-srm-value>{specs.srm}</span>
              </span>
            </div>
          </div>

          <ul className="relative mt-4 h-5 text-[0.7rem] uppercase tracking-[0.18em] text-foam-faint sm:text-eyebrow">
            {scaleLabels.map(({ label, at }, i) => (
              <li
                key={label}
                data-srm-label
                className={`absolute top-0 whitespace-nowrap ${
                  i === 0 ? "" : i === scaleLabels.length - 1 ? "-translate-x-full" : "-translate-x-1/2"
                } ${i === 3 ? "text-gold" : ""} ${i === 2 || i === 4 ? "max-sm:hidden" : ""}`}
                style={{ left: i === 0 ? 0 : `${at * 100}%` }}
              >
                {label}
              </li>
            ))}
          </ul>

          <figcaption id="srm-caption" data-srm-caption className="mt-8 max-w-xl text-foam-muted">
            {t.specs.srmCaption}
          </figcaption>
        </figure>

        <dl className="mt-16 grid gap-6 border-t border-gold/10 pt-10 sm:grid-cols-3">
          {t.specs.details.map((d) => (
            <div key={d.label} data-detail>
              <dt className="text-eyebrow uppercase text-foam-faint">{d.label}</dt>
              <dd className="mt-2 font-display text-xl text-foam">{d.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
