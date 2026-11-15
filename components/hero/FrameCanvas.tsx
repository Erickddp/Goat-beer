"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import type { FramesSource } from "@/content/hero";
import type { SequenceLayerHandle } from "./types";

/**
 * Secuencia de frames en <canvas> (técnica de páginas de producto de Apple).
 * Se activa cuando exista pour.mp4: cambia `source` en content/hero.ts.
 * Precarga progresiva: primero cada 4º frame, luego el resto.
 */
const FrameCanvas = forwardRef<SequenceLayerHandle, { source: FramesSource }>(function FrameCanvas({ source }, ref) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const images = useRef<(HTMLImageElement | undefined)[]>([]);
  const current = useRef(0);

  const draw = (index: number) => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    // Si el frame no ha cargado, usar el más cercano ya disponible
    let img: HTMLImageElement | undefined;
    for (let d = 0; d < source.frameCount && !img; d++) {
      const a = images.current[index - d];
      const b = images.current[index + d];
      img = a?.complete && a.naturalWidth ? a : b?.complete && b.naturalWidth ? b : undefined;
    }
    if (!img) return;
    const scale = Math.max(c.width / img.naturalWidth, c.height / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h);
  };

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const src = mobile ? source.mobile : source.desktop;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.round(c.clientWidth * dpr);
      c.height = Math.round(c.clientHeight * dpr);
      draw(current.current);
    };
    resize();
    window.addEventListener("resize", resize);

    const order = [
      ...Array.from({ length: source.frameCount }, (_, i) => i).filter((i) => i % 4 === 0),
      ...Array.from({ length: source.frameCount }, (_, i) => i).filter((i) => i % 4 !== 0),
    ];
    let cancelled = false;
    (async () => {
      for (const i of order) {
        if (cancelled) return;
        const img = new Image();
        img.decoding = "async";
        img.src = src(i + 1);
        images.current[i] = img;
        await img.decode().catch(() => undefined);
        if (i === 0 || i === current.current) draw(current.current);
      }
    })();

    return () => {
      cancelled = true;
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- la fuente es estática
  }, []);

  useImperativeHandle(ref, () => ({
    addTo(tl) {
      const state = { frame: 0 };
      tl.to(
        state,
        {
          frame: source.frameCount - 1,
          ease: "none",
          duration: 1,
          onUpdate: () => {
            const f = Math.round(state.frame);
            if (f !== current.current) {
              current.current = f;
              draw(f);
            }
          },
        },
        0,
      );
    },
  }));

  return <canvas ref={canvas} role="img" aria-label={source.alt} className="absolute inset-0 size-full" />;
});

export default FrameCanvas;
