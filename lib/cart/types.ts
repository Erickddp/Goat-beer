import type { Currency } from "@/content/products";

export interface CartLine {
  productId: string;
  quantity: number;
}

export interface CheckoutRequest {
  lines: CartLine[];
  locale: "es" | "en";
}

export type CheckoutResult =
  /** Preview: los pagos en línea aún no están activos. */
  | { status: "coming_soon"; message: string }
  /** Futuro: Mercado Pago (Checkout Pro) o Stripe devuelven una URL de pago. */
  | { status: "redirect"; url: string }
  | { status: "error"; message: string };

export interface CartTotals {
  itemCount: number;
  /** null si algún producto aún no tiene precio confirmado. */
  subtotalCents: number | null;
  currency: Currency;
}

/**
 * Contrato del carrito. La implementación actual es local (Zustand + localStorage);
 * puede sustituirse por un carrito en servidor sin tocar componentes.
 */
export interface CartProvider {
  lines: CartLine[];
  add(productId: string, quantity?: number): void;
  setQuantity(productId: string, quantity: number): void;
  remove(productId: string): void;
  clear(): void;
  checkout(): Promise<CheckoutResult>;
}
