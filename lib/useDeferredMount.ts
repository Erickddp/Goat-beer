"use client";

import { useEffect, useState } from "react";

/**
 * true cuando conviene montar recursos no críticos: tras `load` + un momento
 * ocioso del navegador, o antes si el usuario interactúa. Mantiene fuera de la
 * ruta crítica (LCP) imágenes que solo se ven después de hacer scroll.
 */
export function useDeferredMount(timeout = 1500) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let done = false;
    let idleId: number | undefined;
    const go = () => {
      if (done) return;
      done = true;
      setReady(true);
    };
    const events = ["pointerdown", "wheel", "touchstart", "keydown"] as const;
    events.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }));

    const schedule = () => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
      idleId = ric(go, { timeout }) as number;
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      done = true;
      events.forEach((e) => window.removeEventListener(e, go));
      window.removeEventListener("load", schedule);
      if (idleId !== undefined) (window.cancelIdleCallback ?? window.clearTimeout)(idleId);
    };
  }, [timeout]);

  return ready;
}
