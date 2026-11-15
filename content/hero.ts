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
   * Encuadre en móvil: la foto es 16:9 y el celular es vertical, así que en vez de
   * recortarla con "cover" se muestra completa en una caja centrada.
   * w = ancho de la caja en vw (>100 recorta el negro sobrante de los lados);
   * cx = punto horizontal (0–1) de la foto que queda en el centro de la pantalla
   * (donde está el centro de lo que se ve: botella + copa).
   */
  mobile: { w: number; cx: number };
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
  destapaOut: 0.14,
  /** cruce kf-01 → kf-02 (y el "pop") */
  pop: 0.22,
  /** cruce kf-02 → kf-03 (la botella se inclina) */
  pour: 0.42,
  /** "Mezquite Stout" */
  mezquiteIn: 0.5,
  mezquiteOut: 0.63,
  /** cruce kf-03 → kf-04 */
  overflow: 0.7,
  /** "Hecha en la frontera." */
  fronteraIn: 0.74,
  fronteraOut: 0.86,
  /** la espuma sube y cubre la pantalla */
  foamStart: 0.88,
} as const;

export const keyframesSource: KeyframesSource = {
  kind: "keyframes",
  width: 2752,
  height: 1536,
  keyframes: [
    {
      src: "/media/kf-01-closed.jpg",
      alt: "Botella cerrada de Mezquite Stout junto a una copa vacía con el logo de la cabra",
      mobile: { w: 190, cx: 0.54 },
    },
    {
      src: "/media/kf-02-pop.jpg",
      alt: "La corcholata salta de la botella de Mezquite Stout",
      mobile: { w: 190, cx: 0.54 },
    },
    {
      src: "/media/kf-03-pour.jpg",
      alt: "La botella se inclina y sirve la stout en la copa",
      mobile: { w: 125, cx: 0.465 },
    },
    {
      src: "/media/kf-04-overflow.jpg",
      alt: "La copa llena de Mezquite Stout con la espuma desbordándose",
      mobile: { w: 190, cx: 0.54 },
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
