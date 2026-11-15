"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, MOTION_OK } from "@/lib/gsap";

type Selector = <E extends Element = HTMLElement>(selector: string) => E[];

/**
 * Se resuelve con la primera interacción (scroll, rueda, toque, tecla).
 * Ninguna animación depende de la carga: quien no hace scroll no paga su costo.
 */
let engaged: Promise<void> | null = null;
function whenEngaged() {
  if (engaged) return engaged;
  engaged = new Promise<void>((resolve) => {
    if (window.scrollY > 0) return resolve();
    const events = ["wheel", "touchstart", "keydown", "pointerdown", "scroll"] as const;
    const done = () => {
      events.forEach((e) => window.removeEventListener(e, done));
      resolve();
    };
    events.forEach((e) => window.addEventListener(e, done, { passive: true, once: true }));
  });
  return engaged;
}
type Setup = (q: Selector) => void | (() => void);

/**
 * Arma las animaciones de una sección solo cuando está por entrar a pantalla
 * (rootMargin: un viewport por delante), con las fuentes ya cargadas y después
 * de la primera interacción del usuario.
 *
 * Por qué: crear todos los SplitText/ScrollTrigger al cargar bloqueaba el hilo
 * principal >2 s en móvil (Lighthouse TBT). Así cada sección paga su costo al
 * acercarse, y SplitText divide una sola vez con la tipografía final.
 * Con prefers-reduced-motion no se arma nada: el contenido queda estático.
 */
export function useSectionMotion<T extends HTMLElement>(
  root: RefObject<T | null>,
  setup: Setup,
  { margin = "100% 0px" }: { margin?: string } = {},
) {
  const setupRef = useRef(setup);

  useEffect(() => {
    setupRef.current = setup;
  });

  useEffect(() => {
    const el = root.current;
    if (!el || !window.matchMedia(MOTION_OK).matches) return;

    let ctx: gsap.Context | undefined;
    let cancelled = false;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const fonts = document.fonts?.ready ?? Promise.resolve();
        Promise.all([fonts, whenEngaged()]).then(() => {
          if (cancelled) return;
          ctx = gsap.context(() => setupRef.current(gsap.utils.selector(el) as Selector), el);
        });
      },
      { rootMargin: margin },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      ctx?.revert();
    };
  }, [root, margin]);
}
