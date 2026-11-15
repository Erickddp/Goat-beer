"use client";

import { useEffect, useState } from "react";
import { useSound } from "@/lib/sound";
import { SoundOffIcon, SoundOnIcon } from "@/components/ui/Icons";
import { AGE_EVENT, AGE_KEY } from "./AgeGate";
import t from "@/content/i18n/es";

/**
 * Botón fijo de sonido (encendido por defecto tras el age gate).
 * En visitas posteriores el audio se desbloquea con el primer toque/clic/tecla:
 * la rueda del mouse no cuenta como gesto para el navegador.
 */
export default function SoundToggle() {
  const muted = useSound((s) => s.muted);
  const toggleMute = useSound((s) => s.toggleMute);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = () => setVisible(true);
    try {
      if (localStorage.getItem(AGE_KEY) === "1") show();
    } catch {
      /* noop */
    }
    window.addEventListener(AGE_EVENT, show);

    const unlock = () => {
      void useSound.getState().unlock();
      ["pointerdown", "keydown", "touchend"].forEach((e) => window.removeEventListener(e, unlock));
    };
    ["pointerdown", "keydown", "touchend"].forEach((e) => window.addEventListener(e, unlock, { passive: true }));

    return () => {
      window.removeEventListener(AGE_EVENT, show);
      ["pointerdown", "keydown", "touchend"].forEach((e) => window.removeEventListener(e, unlock));
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      data-magnetic
      onClick={toggleMute}
      aria-pressed={!muted}
      aria-label={t.sound.toggle}
      title={muted ? t.sound.off : t.sound.on}
      className="fixed bottom-5 right-5 z-40 grid size-12 cursor-pointer place-items-center rounded-full border border-gold/40 bg-ink/70 text-gold backdrop-blur-md transition-colors duration-200 hover:border-gold motion-safe:animate-[fade-up_0.5s_var(--ease-brew)]"
    >
      {muted ? <SoundOffIcon className="size-5" /> : <SoundOnIcon className="size-5" />}
      <span className="sr-only" aria-live="polite">
        {muted ? t.sound.off : t.sound.on}
      </span>
    </button>
  );
}
