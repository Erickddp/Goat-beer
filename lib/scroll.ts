"use client";

import type Lenis from "lenis";

/** Referencia global a Lenis para pausar el scroll de fondo (drawer, modales). */
let instance: Lenis | null = null;
/** Contador: varios diálogos pueden encadenarse (drawer → modal) sin soltar el bloqueo. */
let locks = 0;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const lockScroll = (locked: boolean) => {
  locks = Math.max(0, locks + (locked ? 1 : -1));
  const isLocked = locks > 0;
  if (isLocked) instance?.stop();
  else instance?.start();
  document.documentElement.style.overflow = isLocked ? "hidden" : "";
};
