/**
 * Configuración del hero "destape y servido" (<PourSequence/>).
 *
 * Para pasar a la secuencia de frames de pour.mp4:
 *   1. bash scripts/extract-frames.sh   (genera public/frames/pour/{desktop,mobile}/0001.webp… y public/sfx/*.mp3)
 *   2. Cambia `source` abajo a `framesSource` y ajusta frameCount / beats.
 * No hay que tocar componentes: textos, espuma, sonido y pin leen los mismos `beats`.
 */

export interface HeroKeyframe {
  src: string;
  alt: string;
  /**
   * object-position en móvil (la foto 16:9 se recorta mucho en vertical).
   * Ojo: alinea proporcionalmente, no centra. Para centrar el punto c (0–1) en 375×812:
   * p ≈ (c·1455 − 187) / 1080.
   */
  mobileFocus: string;
}

export interface KeyframesSource {
  kind: "keyframes";
  width: number;
  height: number;
  keyframes: HeroKeyframe[];
}

export interface FramesSource {
  kind: "frames";
  frameCount: number;
  /** Ruta del frame i (1-based) para cada variante. */
  desktop: (i: number) => string;
  mobile: (i: number) => string;
  width: number;
  height: number;
  alt: string;
}

export type HeroSource = KeyframesSource | FramesSource;

/**
 * Momentos clave como fracción (0–1) del recorrido pinned.
 * Texto, sonido y espuma se sincronizan con estos valores sin importar la fuente.
 */
export const beats = {
  /** "Destápala." visible desde el inicio, sale aquí */
  destapaOut: 0.12,
  /** cruce kf-01 → kf-02 (y el "pop") */
  pop: 0.22,
  /** cruce kf-02 → kf-03 */
  pour: 0.4,
  /** "Mezquite Stout" */
  mezquiteIn: 0.46,
  mezquiteOut: 0.6,
  /** cruce kf-03 → kf-04 */
  overflow: 0.64,
  /** "Hecha en la frontera." */
  fronteraIn: 0.68,
  fronteraOut: 0.8,
  /** la espuma sube y cubre la pantalla */
  foamStart: 0.82,
} as const;

export const keyframesSource: KeyframesSource = {
  kind: "keyframes",
  width: 2752,
  height: 1536,
  keyframes: [
    {
      src: "/media/kf-01-closed.jpg",
      alt: "Botella cerrada de Mezquite Stout junto a una copa vacía con el logo de la cabra",
      mobileFocus: "32% 50%",
    },
    {
      src: "/media/kf-02-pop.jpg",
      alt: "La corcholata salta de la botella de Mezquite Stout",
      mobileFocus: "32% 50%",
    },
    {
      src: "/media/kf-03-pour.jpg",
      alt: "La botella se inclina y sirve la stout en la copa",
      mobileFocus: "92% 50%",
    },
    {
      src: "/media/kf-04-overflow.jpg",
      alt: "La copa llena de Mezquite Stout con la espuma desbordándose",
      mobileFocus: "66% 50%",
    },
  ],
};

/** Listo para cuando exista pour.mp4 (ver scripts/extract-frames.sh). */
export const framesSource: FramesSource = {
  kind: "frames",
  frameCount: 120,
  desktop: (i) => `/frames/pour/desktop/${String(i).padStart(4, "0")}.webp`,
  mobile: (i) => `/frames/pour/mobile/${String(i).padStart(4, "0")}.webp`,
  width: 1600,
  height: 900,
  alt: "Se destapa y se sirve una Mezquite Stout",
};

/** Fuente activa. */
export const source: HeroSource = keyframesSource;

/** Efectos de sonido. Si el archivo no existe se usa un "pop" sintetizado. */
export const sfx = {
  pop: "/sfx/pop.mp3",
} as const;
