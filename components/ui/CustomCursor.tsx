"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const INTERACTIVE = "a, button, [role=button], [data-cursor], label, summary";
const STRENGTH = 0.35;

/**
 * Cursor dorado (punto + anillo con retardo) y botones magnéticos para
 * cualquier elemento con [data-magnetic]. Solo en desktop con puntero fino.
 * Dentro de diálogos (top layer) vuelve el cursor nativo, ver globals.css.
 */
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    if (!mq.matches || !dot.current || !ring.current) return;

    const html = document.documentElement;
    html.classList.add("has-custom-cursor");

    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08, ease: "power3.out" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08, ease: "power3.out" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3.out" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3.out" });

    let magnet: HTMLElement | null = null;
    let visible = false;

    const releaseMagnet = () => {
      if (!magnet) return;
      gsap.to(magnet, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
      magnet = null;
    };

    const move = (e: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.2 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);

      const target = e.target instanceof Element ? e.target : null;
      const hovering = !!target?.closest(INTERACTIVE);
      ring.current!.dataset.hover = hovering ? "1" : "0";

      const m = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (m !== magnet) releaseMagnet();
      if (m) {
        magnet = m;
        const r = m.getBoundingClientRect();
        gsap.to(m, {
          x: (e.clientX - (r.left + r.width / 2)) * STRENGTH,
          y: (e.clientY - (r.top + r.height / 2)) * STRENGTH,
          duration: 0.4,
          ease: "power3.out",
        });
      }
    };
    const leave = () => {
      visible = false;
      releaseMagnet();
      gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.2 });
    };
    const down = () => gsap.to(ring.current, { scale: 0.8, duration: 0.15 });
    const up = () => gsap.to(ring.current, { scale: 1, duration: 0.3, ease: "back.out(3)" });

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      html.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        aria-hidden
        data-hover="0"
        className="custom-cursor custom-cursor-ring pointer-events-none fixed left-0 top-0 z-[95] -ml-5 -mt-5 size-10 rounded-full border border-gold/60 opacity-0"
      />
      <div
        ref={dot}
        aria-hidden
        className="custom-cursor pointer-events-none fixed left-0 top-0 z-[96] -ml-1 -mt-1 size-2 rounded-full bg-gold opacity-0"
      />
    </>
  );
}
