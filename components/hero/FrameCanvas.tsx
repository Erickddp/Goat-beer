"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { gsap } from "@/lib/gsap";
import type { CameraKey, FrameSequence } from "@/content/hero";
import type { SequenceLayerHandle } from "./types";

const MOBILE_QUERY = "(max-width: 767px)";

/** Interpola la cámara en el progreso p (suavizado entre puntos). */
function cameraAt(keys: CameraKey[], p: number): CameraKey {
  if (p <= keys[0].p) return keys[0];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (p <= b.p) {
      const t = (p - a.p) / Math.max(1e-6, b.p - a.p);
      const e = t * t * (3 - 2 * t); // smoothstep
      return { p, z: a.z + (b.z - a.z) * e, cx: a.cx + (b.cx - a.cx) * e, cy: a.cy + (b.cy - a.cy) * e };
    }
  }
  return keys[keys.length - 1];
}

interface FrameCanvasProps {
  seq: FrameSequence;
  /** Empezar a descargar todos los frames (el primero siempre va de inmediato). */
  preload: boolean;
  /** Se llama cuando el primer frame ya está dibujado. */
  onReady?: () => void;
  className?: string;
}

/**
 * Secuencia de frames en <canvas> controlada por scroll (técnica Apple).
 * - Precarga progresiva: primero cada 4º frame, luego el resto.
 * - Si el frame pedido aún no llegó, dibuja el más cercano disponible.
 * - Cámara virtual (zoom/encuadre) definida en content/hero.ts.
 */
const FrameCanvas = forwardRef<SequenceLayerHandle, FrameCanvasProps>(function FrameCanvas(
  { seq, preload, onReady, className = "" },
  ref,
) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const images = useRef<(HTMLImageElement | undefined)[]>([]);
  const state = useRef({ frame: 0, p: seq.range[0] });
  const mobile = useRef(false);
  const readySent = useRef(false);

  const draw = () => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx || !c.width) return;
    const index = Math.round(state.current.frame);
    let img: HTMLImageElement | undefined;
    for (let d = 0; d < seq.frameCount && !img; d++) {
      const a = images.current[index - d];
      const b = images.current[index + d];
      img = a?.complete && a.naturalWidth ? a : b?.complete && b.naturalWidth ? b : undefined;
    }
    if (!img) return;

    const cw = c.width;
    const ch = c.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    ctx.clearRect(0, 0, cw, ch);

    if (seq.fit === "cover" || !seq.camera) {
      const s = Math.max(cw / iw, ch / ih);
      ctx.drawImage(img, (cw - iw * s) / 2, (ch - ih * s) / 2, iw * s, ih * s);
    } else {
      const keys = mobile.current ? seq.camera.mobile : seq.camera.desktop;
      const cam = cameraAt(keys, state.current.p);
      const base = mobile.current ? cw / iw : Math.max(cw / iw, ch / ih);
      const s = base * cam.z;
      const w = iw * s;
      const h = ih * s;
      const ay = mobile.current ? seq.camera.mobileAnchorY : 0.5;
      ctx.drawImage(img, cw * 0.5 - cam.cx * w, ch * ay - cam.cy * h, w, h);
    }

    if (!readySent.current) {
      readySent.current = true;
      onReady?.();
    }
  };

  // Tamaño del canvas y primer frame
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const mq = window.matchMedia(MOBILE_QUERY);
    mobile.current = mq.matches;

    const resize = () => {
      mobile.current = mq.matches;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.round(c.clientWidth * dpr);
      c.height = Math.round(c.clientHeight * dpr);
      draw();
    };
    resize();
    window.addEventListener("resize", resize);

    const src = mobile.current ? seq.mobile : seq.desktop;
    const first = new Image();
    first.decoding = "async";
    first.src = src(1);
    images.current[0] = first;
    first.decode().then(draw, () => undefined);

    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- la secuencia es estática
  }, []);

  // Precarga del resto (fuera de la ruta crítica)
  useEffect(() => {
    if (!preload || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const src = mobile.current ? seq.mobile : seq.desktop;
    const all = Array.from({ length: seq.frameCount }, (_, i) => i).filter((i) => i > 0);
    const order = [...all.filter((i) => i % 4 === 0), ...all.filter((i) => i % 4 !== 0)];
    let cancelled = false;
    let inFlight = 0;
    let cursor = 0;
    const MAX_PARALLEL = 6;

    const next = () => {
      while (!cancelled && inFlight < MAX_PARALLEL && cursor < order.length) {
        const i = order[cursor++];
        const img = new Image();
        img.decoding = "async";
        img.src = src(i + 1);
        images.current[i] = img;
        inFlight++;
        img
          .decode()
          .catch(() => undefined)
          .finally(() => {
            inFlight--;
            if (Math.abs(i - Math.round(state.current.frame)) < 3) draw();
            next();
          });
      }
    };
    next();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- la secuencia es estática
  }, [preload]);

  useImperativeHandle(ref, () => ({
    addTo(tl) {
      const [p0, p1] = seq.range;
      tl.fromTo(
        state.current,
        { frame: 0, p: p0 },
        {
          frame: seq.frameCount - 1,
          p: p1,
          ease: "none",
          duration: p1 - p0,
          onUpdate: draw,
          immediateRender: false,
        },
        p0,
      );
      gsap.set(state.current, { frame: 0, p: p0 });
      // Una secuencia que no empieza en 0 (la espuma) queda oculta hasta su tramo
      if (p0 > 0 && canvas.current) {
        tl.fromTo(canvas.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.002, immediateRender: false }, p0);
      }
    },
  }));

  return (
    <canvas
      ref={canvas}
      aria-hidden={seq.alt ? undefined : true}
      role={seq.alt ? "img" : undefined}
      aria-label={seq.alt || undefined}
      className={`absolute inset-0 size-full ${seq.blend === "screen" ? "mix-blend-screen" : ""} ${
        seq.range[0] > 0 ? "invisible opacity-0" : ""
      } ${className}`}
    />
  );
});

export default FrameCanvas;
