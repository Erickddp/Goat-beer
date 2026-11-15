"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { useDeferredMount } from "@/lib/useDeferredMount";
import { beats, type KeyframesSource } from "@/content/hero";
import type { SequenceLayerHandle } from "./types";

/**
 * Fallback mientras no existe pour.mp4: 4 fotos apiladas con crossfade.
 * Las composiciones cambian entre fotos (en kf-03 la botella va horizontal),
 * así que cada cruce combina opacidad + escala + desenfoque, y el cruce al
 * servido agrega un leve giro que "vende" la inclinación de la botella.
 */
const TRANSITIONS = [
  // El pop: misma composición → crossfade limpio, sin desenfoque (se ve saltar la corcholata)
  { at: beats.pop - 0.02, d: 0.04, blur: 0, out: 1, in: 1, rot: 0 },
  // El servido: la botella cambia de pose → cruce largo, desenfoque suave y leve giro
  { at: beats.pour - 0.06, d: 0.12, blur: 6, out: 1.05, in: 1.04, rot: 3 },
  { at: beats.overflow - 0.04, d: 0.08, blur: 4, out: 1.03, in: 1.02, rot: 0 },
];

const KeyframeLayer = forwardRef<SequenceLayerHandle, { source: KeyframesSource }>(function KeyframeLayer(
  { source },
  ref,
) {
  const root = useRef<HTMLDivElement>(null);
  // Solo kf-01 es crítica; las demás se montan después de cargar (o al interactuar)
  const rest = useDeferredMount();

  useImperativeHandle(ref, () => ({
    addTo(tl) {
      const layers = gsap.utils.toArray<HTMLElement>("[data-kf]", root.current);
      if (layers.length < 4) return;
      gsap.set(layers, { opacity: 0, filter: "blur(0px)", scale: 1, rotation: 0, force3D: true });
      gsap.set(layers[0], { opacity: 1 });

      // Empuje lento sobre cada foto mientras está en pantalla
      const holds = [0, ...TRANSITIONS.map((t) => t.at + t.d), 1];
      layers.forEach((layer, i) => {
        const start = holds[i];
        const end = i < TRANSITIONS.length ? TRANSITIONS[i].at : 1;
        tl.fromTo(layer, { scale: 1 }, { scale: 1.03, duration: Math.max(0.01, end - start) }, start);
      });

      TRANSITIONS.forEach((t, i) => {
        const from = layers[i];
        const to = layers[i + 1];
        const half = t.d / 2;
        // Sale: se desenfoca, crece y se desvanece
        tl.to(from, { filter: `blur(${t.blur}px)`, scale: t.out, rotation: -t.rot, duration: half, ease: "power1.in" }, t.at)
          .to(from, { opacity: 0, duration: t.d * 0.7, ease: "power1.inOut" }, t.at + t.d * 0.15)
          // Entra: llega desenfocada y escalada, y se asienta
          .fromTo(
            to,
            { opacity: 0, filter: `blur(${t.blur}px)`, scale: t.in, rotation: t.rot },
            { opacity: 1, duration: t.d * 0.7, ease: "power1.inOut", immediateRender: false },
            t.at + t.d * 0.15,
          )
          .to(to, { filter: "blur(0px)", scale: 1, rotation: 0, duration: half, ease: "power1.out" }, t.at + half);
      });
    },
  }));

  return (
    <div ref={root} className="absolute inset-0">
      {source.keyframes.map((kf, i) => {
        const last = i === source.keyframes.length - 1;
        return (
          <div
            key={kf.src}
            data-kf
            className={`absolute inset-0 will-change-[transform,opacity,filter] ${
              i === 0 ? "opacity-100 motion-reduce:opacity-0" : last ? "opacity-0 motion-reduce:opacity-100" : "opacity-0"
            }`}
          >
            {/* Móvil: caja 16:9 centrada con la foto completa. Desktop: cubre toda la sección. */}
            <div
              className="absolute aspect-video max-md:top-[42%] max-md:-translate-y-1/2 max-md:[left:var(--left)] max-md:[width:var(--w)] max-md:[mask-image:radial-gradient(ellipse_72%_75%_at_50%_50%,#000_55%,transparent_100%)] md:inset-0 md:aspect-auto"
              style={
                {
                  "--w": `${kf.mobile.w}vw`,
                  "--left": `calc(50% - ${(kf.mobile.cx * kf.mobile.w).toFixed(2)}vw)`,
                } as React.CSSProperties
              }
            >
              {(i === 0 || rest) && (
                <Image
                  src={kf.src}
                  alt={kf.alt}
                  fill
                  sizes="(max-width: 767px) 190vw, 100vw"
                  quality={80}
                  loading="eager"
                  fetchPriority={i === 0 ? "high" : "low"}
                  className="object-cover"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default KeyframeLayer;
