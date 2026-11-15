"use client";

import { useSectionMotion } from "@/lib/useSectionMotion";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import SectionHeader from "@/components/ui/SectionHeader";
import { StarIcon } from "@/components/ui/Icons";
import { reviews, reviewPlaceholders, type Review } from "@/content/reviews";
import t from "@/content/i18n/es";

function Stars({ rating }: { rating: number }) {
  return (
    <div role="img" aria-label={t.reviews.ratingLabel(rating)} className="flex gap-1 text-gold">
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} filled={n <= rating} className="size-4" />
      ))}
    </div>
  );
}

/** Reseña real (se usa cuando content/reviews.ts tenga datos). */
function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex h-full flex-col rounded-lg bg-stout p-7 shadow-gold-sm">
      <Stars rating={review.rating} />
      <blockquote className="mt-5 flex-1 font-display text-xl font-light text-foam">“{review.body}”</blockquote>
      <figcaption className="mt-6 text-sm text-foam-muted">
        {review.authorName}
        {review.city && <span className="text-foam-faint"> · {review.city}</span>}
        {review.verifiedPurchase && <span className="ml-2 text-gold">{t.reviews.verified}</span>}
      </figcaption>
    </figure>
  );
}

const shimmer =
  "bg-[linear-gradient(90deg,rgb(233_214_176/0.06)_0%,rgb(233_214_176/0.14)_50%,rgb(233_214_176/0.06)_100%)] bg-[length:200%_100%] motion-safe:animate-[skeleton-shimmer_2.2s_linear_infinite]";

/** Tarjeta esqueleto, marcada claramente como "Ejemplo". No es un testimonio. */
function ExampleCard({ rating, hint }: { rating: number; hint: string }) {
  return (
    <article
      aria-label={`${t.reviews.exampleBadge}: ${hint}`}
      className="relative flex h-full flex-col rounded-lg border border-dashed border-gold/30 bg-stout/60 p-7"
    >
      <span className="absolute right-5 top-5 rounded-pill border border-gold/50 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-gold">
        {t.reviews.exampleBadge}
      </span>
      <div className="opacity-50">
        <Stars rating={rating} />
      </div>
      <div aria-hidden className="mt-6 space-y-3">
        <div className={`h-3 w-full rounded-pill ${shimmer}`} />
        <div className={`h-3 w-11/12 rounded-pill ${shimmer}`} />
        <div className={`h-3 w-3/4 rounded-pill ${shimmer}`} />
      </div>
      <p className="mt-6 flex-1 text-sm italic text-foam-faint">{hint}</p>
      <div aria-hidden className="mt-6 flex items-center gap-3">
        <div className={`size-10 rounded-full ${shimmer}`} />
        <div className="space-y-2">
          <div className={`h-2.5 w-24 rounded-pill ${shimmer}`} />
          <div className={`h-2.5 w-16 rounded-pill ${shimmer}`} />
        </div>
      </div>
    </article>
  );
}

/**
 * 09 · Reseñas
 * Entrada: "abanico" — las tarjetas se despliegan desde el centro, rotando
 * desde un mismo eje, como cartas abiertas en la mano.
 */
export default function Reviews() {
  const root = useRef<HTMLElement>(null);
  const hasReal = reviews.length > 0;

  useSectionMotion(root, (q) => {
        gsap.from(q("[data-eyebrow], [data-title], [data-note]"), {
          opacity: 0,
          y: 30,
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });
        const cards = q("[data-review]");
        gsap.from(cards, {
          opacity: 0,
          y: 60,
          rotation: (i: number) => (i - (cards.length - 1) / 2) * 6,
          xPercent: (i: number) => -(i - (cards.length - 1) / 2) * 40,
          transformOrigin: "50% 150%",
          duration: 1.4,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: q("[data-review-list]")[0], start: "top 85%" },
        });
  });

  return (
    <section ref={root} id="resenas" aria-labelledby="reviews-title" className="cv-auto relative overflow-hidden bg-stout/40 py-section">
      <div className="mx-auto max-w-site px-gutter">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader index="09" eyebrow={t.reviews.eyebrow} title={t.reviews.title} id="reviews-title" />
          {!hasReal && (
            <p data-note className="max-w-sm text-foam-muted">
              {t.reviews.exampleNote}
            </p>
          )}
        </div>

        <ul data-review-list className="mt-14 grid gap-5 md:grid-cols-3 lg:mt-20">
          {hasReal
            ? reviews.map((r) => (
                <li key={r.id} data-review>
                  <ReviewCard review={r} />
                </li>
              ))
            : reviewPlaceholders.map((p) => (
                <li key={p.id} data-review>
                  <ExampleCard rating={p.rating} hint={p.hint} />
                </li>
              ))}
        </ul>
      </div>
    </section>
  );
}
