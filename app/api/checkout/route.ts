import { NextResponse } from "next/server";
import { getCatalogFresh } from "@/lib/catalog/server";
import { computeTotals, reconcileLines } from "@/lib/cart/logic";
import type { CartLine, CheckoutRequest, CheckoutResult } from "@/lib/cart/types";

/** Tope de líneas distintas por pedido (protección básica contra cuerpos abusivos). */
const MAX_LINES = 20;

/**
 * POST /api/checkout
 *
 * Hoy: valida el carrito contra el catálogo VIGENTE (base de datos si hay DATABASE_URL),
 * recalcula el subtotal en servidor y responde "coming_soon".
 *
 * TODO(pagos, Fase 3): Mercado Pago Checkout Pro (o Stripe Checkout):
 *   1. Recibir datos de entrega; verificar zona, mínimo de compra y mayoría de edad.
 *   2. En una transacción: crear el pedido `pending` con precios del servidor y apartar inventario.
 *   3. Crear la preferencia/sesión con el SDK (credenciales en variables de entorno).
 *   4. Responder { status: "redirect", url } con la URL de pago.
 *   5. Webhook en app/api/checkout/webhook/route.ts para confirmar el pago (firma + idempotencia).
 */
export async function POST(request: Request) {
  let body: CheckoutRequest;
  try {
    body = (await request.json()) as CheckoutRequest;
  } catch {
    return error("Solicitud inválida.", 400);
  }

  const raw: unknown[] = Array.isArray(body?.lines) ? body.lines.slice(0, MAX_LINES) : [];
  const lines: CartLine[] = raw.filter(
    (l): l is CartLine =>
      typeof l === "object" &&
      l !== null &&
      typeof (l as CartLine).productId === "string" &&
      Number.isInteger((l as CartLine).quantity) &&
      (l as CartLine).quantity > 0,
  );

  let catalog;
  try {
    catalog = await getCatalogFresh();
  } catch (err) {
    console.error("[checkout] catálogo no disponible:", err);
    return error("No pudimos revisar el inventario. Intenta de nuevo en un momento.", 503);
  }

  // Lo que el navegador mande es solo una petición: precios y existencias salen del servidor.
  const { lines: valid, removed, reduced } = reconcileLines(lines, catalog);
  if (valid.length === 0) {
    return error("No hay productos disponibles en tu carrito.", 400);
  }
  if (removed.length > 0 || reduced.length > 0) {
    return error("Tu carrito cambió: algunos productos se agotaron o ya no están disponibles. Revísalo de nuevo.", 409);
  }

  // Subtotal recalculado en servidor. `null` = hay productos sin precio confirmado (no se podría cobrar).
  const totals = computeTotals(valid, catalog);
  void totals; // Fase 3: se usa para crear el pedido y la preferencia de pago.

  return NextResponse.json<CheckoutResult>({
    status: "coming_soon",
    message: "Los pagos en línea llegan muy pronto.",
  });
}

function error(message: string, status: number) {
  return NextResponse.json<CheckoutResult>({ status: "error", message }, { status });
}
