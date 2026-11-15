import { NextResponse } from "next/server";
import { getProduct } from "@/content/products";
import type { CheckoutRequest, CheckoutResult } from "@/lib/cart/types";

/**
 * POST /api/checkout — MOCK de la preview.
 *
 * TODO(pagos): integrar Mercado Pago Checkout Pro (o Stripe Checkout):
 *   1. Validar líneas contra el catálogo y recalcular precios EN SERVIDOR (nunca confiar en el cliente).
 *   2. Verificar zona de entrega y mayoría de edad.
 *   3. Crear la preferencia/sesión con el SDK (credenciales en variables de entorno).
 *   4. Responder { status: "redirect", url } con la URL de pago.
 *   5. Webhook en app/api/checkout/webhook/route.ts para confirmar el pago.
 */
export async function POST(request: Request) {
  let body: CheckoutRequest;
  try {
    body = (await request.json()) as CheckoutRequest;
  } catch {
    return NextResponse.json<CheckoutResult>(
      { status: "error", message: "Solicitud inválida." },
      { status: 400 },
    );
  }

  const lines = Array.isArray(body?.lines) ? body.lines : [];
  const valid = lines.filter(
    (l) =>
      typeof l?.productId === "string" &&
      Number.isInteger(l.quantity) &&
      l.quantity > 0 &&
      getProduct(l.productId)?.status === "available",
  );

  if (valid.length === 0) {
    return NextResponse.json<CheckoutResult>(
      { status: "error", message: "No hay productos disponibles en tu carrito." },
      { status: 400 },
    );
  }

  return NextResponse.json<CheckoutResult>({
    status: "coming_soon",
    message: "Los pagos en línea llegan muy pronto.",
  });
}
