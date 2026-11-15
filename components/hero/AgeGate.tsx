"use client";

import { useEffect, useRef, useState } from "react";
import { useSound } from "@/lib/sound";
import { lockScroll } from "@/lib/scroll";
import { site } from "@/content/site";
import t from "@/content/i18n/es";

export const AGE_KEY = "goat-age-ok";
export const AGE_EVENT = "goat:age-ok";

/**
 * Age gate a pantalla completa. Se pinta desde el HTML del servidor (sin
 * parpadeo del sitio detrás); un script en <head> lo oculta antes del primer
 * pintado si ya se confirmó la edad (clase .age-ok, ver layout.tsx).
 * El clic en "Sí" es el gesto que desbloquea el audio (Web Audio API).
 */
export default function AgeGate() {
  const [state, setState] = useState<"checking" | "ask" | "denied" | "leaving" | "ok">("checking");
  const yesRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let ok = false;
    try {
      ok = localStorage.getItem(AGE_KEY) === "1";
    } catch {
      /* sin storage: preguntar */
    }
    // localStorage solo existe tras hidratar; el HTML del servidor siempre muestra el gate
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(ok ? "ok" : "ask");
    if (ok) return;
    lockScroll(true);
  }, []);

  useEffect(() => {
    if (state === "ask") yesRef.current?.focus({ preventScroll: true });
  }, [state]);

  const accept = () => {
    try {
      localStorage.setItem(AGE_KEY, "1");
    } catch {
      /* noop */
    }
    void useSound.getState().unlock();
    window.dispatchEvent(new Event(AGE_EVENT));
    setState("leaving");
    window.setTimeout(() => {
      lockScroll(false);
      setState("ok");
    }, 700);
  };

  if (state === "ok") return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-title"
      aria-describedby="age-body"
      className={`age-gate fixed inset-0 z-[80] grid place-items-center overflow-hidden bg-ink px-gutter transition-[opacity,clip-path] duration-700 ease-brew ${
        state === "leaving" ? "pointer-events-none [clip-path:inset(0_0_100%_0)]" : "[clip-path:inset(0_0_0_0)]"
      }`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-[80vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ruby/50 blur-[120px]"
      />
      <div className="relative flex max-w-lg flex-col items-center text-center">
        {/* eslint-disable-next-line @next/next/no-img-element -- pinta junto con el HTML, sin esperar al optimizador */}
        <img src="/media/_derived/goat-mark-176.png" alt="" width={72} height={72} className="size-18 object-contain" />
        <p className="mt-6 text-eyebrow uppercase text-gold">{site.brand}</p>

        {state === "denied" ? (
          <>
            <h2 id="age-title" className="mt-4 font-display text-display-md font-light">
              {t.ageGate.deniedTitle}
            </h2>
            <p id="age-body" className="mt-4 text-foam-muted">
              {t.ageGate.deniedBody}
            </p>
          </>
        ) : (
          <>
            <h2 id="age-title" className="mt-4 font-display text-display-lg font-light text-balance">
              {t.ageGate.title}
            </h2>
            <p id="age-body" className="mt-4 text-lg text-foam-muted">
              {t.ageGate.body}
            </p>
            <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <button
                ref={yesRef}
                type="button"
                data-magnetic
                onClick={accept}
                className="min-h-13 cursor-pointer rounded-md bg-gold px-8 font-semibold text-ink transition-[background-color,box-shadow] duration-200 hover:bg-gold-soft hover:shadow-gold-glow"
              >
                {t.ageGate.yes}
              </button>
              <button
                type="button"
                onClick={() => setState("denied")}
                className="min-h-13 cursor-pointer rounded-md border border-foam/20 px-8 text-foam transition-colors duration-200 hover:border-gold/60"
              >
                {t.ageGate.no}
              </button>
            </div>
            <p className="mt-6 text-sm text-foam-faint">{t.ageGate.soundNote}</p>
          </>
        )}
        <p className="mt-10 text-xs uppercase tracking-[0.16em] text-foam-faint">{t.ageGate.legal}</p>
      </div>
    </div>
  );
}
