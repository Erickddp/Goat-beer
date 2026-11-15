/**
 * Configuración del hero "destape y servido" (<PourSequence/>).
 *
 * Fuente activa: secuencia de frames de pour.mp4 + overflow.mp4 en <canvas>.
 * Para regenerar los frames y el audio: bash scripts/extract-frames.sh
 * (si cambias la cantidad de frames, ajusta frameCount abajo).
 * Fallback sin video: `source = keyframesSource` (4 fotos con crossfade).
 */

/* ------------------------------------------------------------------ tipos */

export interface HeroKeyframe {
  src: string;
  alt: string;
  /**
   * Encuadre en móvil: la foto es 16:9 y el celular es vertical, así que en vez de
   * recortarla con "cover" se muestra completa en una caja centrada.
   * w = ancho de la caja en vw (>100 recorta el negro sobrante de los lados);
   * cx = punto horizontal (0–1) de la foto que queda en el centro de la pantalla.
   */
  mobile: { w: number; cx: number };
}

export interface KeyframesSource {
  kind: "keyframes";
  width: number;
  height: number;
  keyframes: HeroKeyframe[];
}

/**
 * Cámara virtual sobre el video: en cada punto `p` (progreso 0–1 del recorrido
 * pinned) la imagen se escala `z` veces y el punto (cx, cy) del cuadro (0–1)
 * queda en el ancla de la pantalla. Entre puntos se interpola con suavizado.
 * Escritorio parte de "cover"; móvil parte de "ancho completo" (se ve el cuadro
 * entero y z > 1 recorta el negro de los lados).
 */
export interface CameraKey {
  p: number;
  z: number;
  cx: number;
  cy: number;
}

export interface FrameSequence {
  frameCount: number;
  /** Ruta del frame i (1-based) para cada variante. */
  desktop: (i: number) => string;
  mobile: (i: number) => string;
  width: number;
  height: number;
  alt: string;
  /** Tramo del recorrido (0–1) en el que corre la secuencia. */
  range: [number, number];
  /** "camera": encuadre animado (abajo). "cover": llena la pantalla. */
  fit: "camera" | "cover";
  camera?: { desktop: CameraKey[]; mobile: CameraKey[]; mobileAnchorY: number };
  /** Mezcla con lo de abajo (la espuma usa "screen": su negro se vuelve transparente). */
  blend?: "screen";
}

export interface FramesSource {
  kind: "frames";
  main: FrameSequence;
  /** Segunda secuencia encima (la espuma que cubre la pantalla). */
  overlay?: FrameSequence;
  /** Imagen fija para prefers-reduced-motion (la copa servida). */
  reducedPoster: { desktop: string; mobile: string };
}

export type HeroSource = KeyframesSource | FramesSource;

/* ---------------------------------------------------------------- tiempos */

/** El video del chorro ocupa este tramo del recorrido; el resto es la espuma. */
const POUR_END = 0.78;
/** Segundo del video → progreso del recorrido. */
const at = (seconds: number) => +((seconds / 10) * POUR_END).toFixed(3);

/**
 * Momentos clave (progreso 0–1). Textos, sonido, cámara y capítulos leen de aquí.
 * Tiempos medidos en pour.mp4: corcholata 1.1 s, se inclina 2.0 s, chorro 3.0 s,
 * la botella sale 6.5 s, desborde 7.5 s.
 */
export const beats = {
  /** "Destápala." visible desde el inicio; explota justo antes del pop */
  destapaOut: at(0.9),
  pop: at(1.1),
  /** el chorro empieza (sonido) */
  pour: at(3.0),
  mezquiteIn: at(3.3),
  mezquiteOut: at(6.2),
  overflow: at(7.5),
  fronteraIn: at(7.6),
  fronteraOut: 0.84,
  /** la espuma empieza a bajar */
  foamStart: 0.7,
} as const;

/** Capítulos del indicador lateral. */
export const chapters = [
  { label: "Destápala", from: 0 },
  { label: "Sírvela", from: at(2.0) },
  { label: "Disfrútala", from: at(7.5) },
] as const;

/* ---------------------------------------------------------------- fuentes */

const pad = (i: number) => String(i).padStart(4, "0");

export const framesSource: FramesSource = {
  kind: "frames",
  main: {
    frameCount: 159,
    desktop: (i) => `/frames/pour/desktop/${pad(i)}.webp`,
    mobile: (i) => `/frames/pour/mobile/${pad(i)}.webp`,
    width: 1280,
    height: 720,
    alt: "Se destapa una botella de Mezquite Stout y se sirve en copa hasta que la espuma se desborda",
    range: [0, POUR_END],
    fit: "camera",
    camera: {
      desktop: [
        { p: 0, z: 1, cx: 0.5, cy: 0.5 },
        { p: at(0.9), z: 1.16, cx: 0.33, cy: 0.36 }, // acercamiento al cuello antes del pop
        { p: at(1.8), z: 1.12, cx: 0.34, cy: 0.38 }, // humo
        { p: at(3.2), z: 1, cx: 0.5, cy: 0.5 }, // se abre para el chorro
        { p: at(6.0), z: 1.06, cx: 0.56, cy: 0.56 },
        { p: at(7.6), z: 1.18, cx: 0.6, cy: 0.56 }, // la copa desbordándose
        { p: POUR_END, z: 1.24, cx: 0.6, cy: 0.55 },
      ],
      mobile: [
        { p: 0, z: 1.9, cx: 0.465, cy: 0.5 },
        { p: at(0.9), z: 2.5, cx: 0.33, cy: 0.42 },
        { p: at(1.8), z: 2.3, cx: 0.34, cy: 0.45 },
        { p: at(3.2), z: 1.3, cx: 0.45, cy: 0.5 }, // botella horizontal: se ve el cuadro casi completo
        { p: at(6.0), z: 1.5, cx: 0.52, cy: 0.55 },
        { p: at(7.6), z: 2.2, cx: 0.58, cy: 0.56 },
        { p: POUR_END, z: 2.4, cx: 0.58, cy: 0.55 },
      ],
      mobileAnchorY: 0.42,
    },
  },
  overlay: {
    frameCount: 64,
    desktop: (i) => `/frames/overflow/desktop/${pad(i)}.webp`,
    mobile: (i) => `/frames/overflow/mobile/${pad(i)}.webp`,
    width: 1280,
    height: 720,
    alt: "",
    range: [beats.foamStart, 1],
    fit: "cover",
    blend: "screen",
  },
  reducedPoster: {
    desktop: "/frames/pour/desktop/0140.webp",
    mobile: "/frames/pour/mobile/0140.webp",
  },
};

/** Fallback con 4 fotos (sin video). */
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

/** Fuente activa. */
export const source: HeroSource = framesSource;

/** Efectos de sonido (extraídos de pour.mp4). Si falta un archivo, el pop se sintetiza. */
export const sfx = {
  pop: "/sfx/pop.mp3",
  pour: "/sfx/pour.mp3",
} as const;
