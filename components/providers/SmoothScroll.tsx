"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/scroll";

/**
 * Lenis global sincronizado con el ticker de GSAP, para que ScrollTrigger
 * y el smooth scroll lean el mismo frame. Desactivado con prefers-reduced-motion.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Las fuentes cambian la altura de los textos: recalcular triggers cuando carguen.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    // Con la primera interacción se renderiza todo (ver .cv-auto en globals.css)
    const html = document.documentElement;
    const reveal = () => {
      events.forEach((e) => window.removeEventListener(e, reveal));
      html.classList.add("cv-off");
    };
    const events = ["pointerdown", "wheel", "touchstart", "keydown"] as const;
    events.forEach((e) => window.addEventListener(e, reveal, { passive: true }));

    // Si la altura de la página cambia (secciones que se renderizan, imágenes), recalcular triggers
    let t: number | undefined;
    let lastH = document.body.scrollHeight;
    const ro = new ResizeObserver(() => {
      const h = document.body.scrollHeight;
      if (Math.abs(h - lastH) < 2) return;
      lastH = h;
      window.clearTimeout(t);
      t = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    ro.observe(document.body);
    const cleanupObservers = () => {
      ro.disconnect();
      window.clearTimeout(t);
      events.forEach((e) => window.removeEventListener(e, reveal));
    };

    if (reduce) return cleanupObservers;

    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, anchors: true });
    lenis.on("scroll", ScrollTrigger.update);
    setLenis(lenis);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      setLenis(null);
      lenis.destroy();
      cleanupObservers();
    };
  }, []);

  return <>{children}</>;
}
