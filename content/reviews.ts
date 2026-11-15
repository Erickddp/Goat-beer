/**
 * Reseñas. En la preview NO hay reseñas reales: `reviews` va vacío y la UI muestra
 * `reviewPlaceholders`, tarjetas esqueleto marcadas claramente como "Ejemplo".
 * No inventar nombres ni testimonios que parezcan reales.
 */

export type ReviewSource = "web" | "google" | "facebook" | "instagram" | "whatsapp";

export interface Review {
  id: string;
  productId: string;
  /** Nombre como lo autorizó la persona (p. ej. "Ana R."). */
  authorName: string;
  /** 1 a 5 */
  rating: 1 | 2 | 3 | 4 | 5;
  body: string;
  /** ISO 8601 */
  createdAt: string;
  source: ReviewSource;
  verifiedPurchase?: boolean;
  city?: string;
}

/** Reseñas reales. Se llenan desde CMS/DB cuando existan. */
export const reviews: Review[] = [];

export interface ReviewPlaceholder {
  id: string;
  /** Siempre true: la UI debe mostrar la etiqueta "Ejemplo". */
  isExample: true;
  rating: Review["rating"];
  /** Texto genérico que describe el formato, no un testimonio. */
  hint: string;
}

export const reviewPlaceholders: ReviewPlaceholder[] = [
  { id: "ejemplo-1", isExample: true, rating: 5, hint: "Aquí aparecerá la opinión de un cliente real sobre el sabor." },
  { id: "ejemplo-2", isExample: true, rating: 5, hint: "Aquí aparecerá una reseña verificada sobre el maridaje." },
  { id: "ejemplo-3", isExample: true, rating: 4, hint: "Aquí aparecerá una reseña sobre la experiencia de compra." },
];
