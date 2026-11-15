"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { lockScroll } from "@/lib/scroll";

const MIN_MS = 900;
const MAX_MS = 2200;

/**
 * Carga inicial: el óvalo dorado se dibuja, la cabra sube desde la máscara y
 * el telón se levanta. Se renderiza en el HTML del servidor para cubrir desde
 * el primer pintado; si el JS fallara, una animación CSS lo retira a los 4 s.
 * Solo una vez por sesión.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    let seen = false;
    try {
      seen = sessionStorage.getItem("goat-preloaded") === "1";
      sessionStorage.setItem("goat-preloaded", "1");
    } catch {
      /* sin storage: se muestra siempre */
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen) {
      setDone(true);
      return;
    }

    lockScroll(true);
    const q = gsap.utils.selector(el);
    const counter = { v: 0 };
    const label = q("[data-pct]")[0] as HTMLElement | undefined;

    const intro = gsap.timeline();
    if (!reduce) {
      intro
        .fromTo(q("[data-oval]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" })
        .fromTo(q("[data-goat]"), { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: "expo.out" }, 0.35)
        .fromTo(q("[data-brand]"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, 0.6);
    }
    intro.to(
      counter,
      {
        v: 100,
        duration: MIN_MS / 1000,
        ease: "power1.inOut",
        onUpdate: () => {
          if (label) label.textContent = String(Math.round(counter.v)).padStart(2, "0");
        },
      },
      0,
    );

    // Solo esperamos tipografías (el hero ya está en el HTML); tope de MAX_MS.
    const fonts = document.fonts?.ready ?? Promise.resolve();
    const timeout = new Promise<void>((r) => setTimeout(r, MAX_MS));
    const minimum = new Promise<void>((r) => setTimeout(r, MIN_MS));

    let cancelled = false;
    Promise.all([Promise.race([fonts, timeout]), minimum]).then(() => {
      if (cancelled) return;
      gsap
        .timeline({
          onComplete: () => {
            lockScroll(false);
            setDone(true);
          },
        })
        .to(q("[data-goat-wrap]"), { scale: reduce ? 1 : 1.08, duration: 0.4, ease: "power2.in" })
        .to(el, reduce ? { opacity: 0, duration: 0.3 } : { yPercent: -100, duration: 0.75, ease: "expo.inOut" }, 0.15);
    });

    return () => {
      cancelled = true;
      intro.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={root}
      aria-hidden
      className="preloader fixed inset-0 z-[90] grid place-items-center bg-ink"
    >
      <div data-goat-wrap className="relative flex flex-col items-center">
        <div className="relative h-40 w-32">
          <svg viewBox="0 0 128 160" className="absolute inset-0 size-full overflow-visible">
            <ellipse
              data-oval
              cx="64"
              cy="80"
              rx="62"
              ry="78"
              pathLength={1}
              strokeDasharray="1"
              className="fill-none stroke-gold"
              strokeWidth="1.5"
            />
          </svg>
          <div className="absolute inset-x-5 bottom-8 top-8 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element -- debe pintarse sin esperar al optimizador */}
            <img
              data-goat
              src="/media/_derived/goat-mark-176.png"
              alt=""
              width={88}
              height={88}
              className="absolute inset-0 m-auto size-full object-contain"
            />
          </div>
        </div>
        <p data-brand className="mt-6 text-eyebrow uppercase text-gold">
          Drunk G.O.A.T. Brewery
        </p>
        <p className="mt-2 font-display text-sm tabular-nums text-foam-faint">
          <span data-pct>00</span>
        </p>
      </div>
    </div>
  );
}
