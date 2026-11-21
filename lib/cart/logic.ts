/**
 * Lógica pura del carrito (sin React ni almacenamiento), compartida por el navegador y el servidor.
 * Importa solo tipos para poder probarse con `node --test` sin compilar.
 */
import type { Product } from "../../content/products.ts";
import type { CartLine, CartTotals } from "./types.ts";

export const MAX_QTY = 48;

export const clampQty = (n: number) => Math.max(0, Math.min(MAX_QTY, Math.floor(n)));

/** Máximo que se puede pedir de un producto: el tope general o el stock disponible si lleva inventario. */
export const maxQtyFor = (product: Product) =>
  product.stock === undefined || product.stock === null ? MAX_QTY : Math.max(0, Math.min(MAX_QTY, product.stock));

export interface ReconcileResult {
  lines: CartLine[];
  /** Nombres de los productos que se quitaron (no disponibles o agotados). `null` = ya no existe en el catálogo. */
  removed: (string | null)[];
  /** Productos a los que se les bajó la cantidad por falta de stock. */
  reduced: string[];
}

/**
 * Ajusta un carrito guardado al catálogo actual: quita productos retirados o agotados,
 * baja cantidades al stock disponible y descarta líneas inválidas o repetidas.
 */
export function reconcileLines(lines: readonly CartLine[], catalog: readonly Product[]): ReconcileResult {
  const byId = new Map(catalog.map((p) => [p.id, p]));
  const out: CartLine[] = [];
  const removed: (string | null)[] = [];
  const reduced: string[] = [];
  const seen = new Set<string>();

  for (const line of lines) {
    if (!line || typeof line.productId !== "string" || seen.has(line.productId)) continue;
    seen.add(line.productId);
    const qty = Number.isFinite(line.quantity) ? clampQty(line.quantity) : 0;
    if (qty <= 0) continue;

    const product = byId.get(line.productId);
    if (!product || product.status !== "available") {
      removed.push(product?.name ?? null);
      continue;
    }
    const max = maxQtyFor(product);
    if (max === 0) {
      removed.push(product.name);
      continue;
    }
    if (qty > max) reduced.push(product.name);
    out.push({ productId: line.productId, quantity: Math.min(qty, max) });
  }
  return { lines: out, removed, reduced };
}

export function computeTotals(lines: readonly CartLine[], catalog: readonly Product[]): CartTotals {
  const byId = new Map(catalog.map((p) => [p.id, p]));
  let itemCount = 0;
  let subtotal: number | null = 0;
  for (const line of lines) {
    const product = byId.get(line.productId);
    if (!product) continue;
    itemCount += line.quantity;
    if (product.priceCents === null || subtotal === null) subtotal = null;
    else subtotal += product.priceCents * line.quantity;
  }
  return { itemCount, subtotalCents: subtotal, currency: "MXN" };
}
