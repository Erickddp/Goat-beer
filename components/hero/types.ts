import type { gsap } from "@/lib/gsap";

/**
 * Contrato de la capa visual del hero. PourSequence crea UNA timeline
 * normalizada (duración 1 = todo el recorrido pinned) y cada capa agrega
 * sus tweens en las posiciones de `beats`. Cambiar de keyframes a frames
 * es cambiar de capa, no de timeline.
 */
export interface SequenceLayerHandle {
  addTo(tl: gsap.core.Timeline): void;
}
