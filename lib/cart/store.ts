"use client";

import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import { getProduct } from "@/content/products";
import type { CartLine, CartProvider, CartTotals, CheckoutResult } from "./types";

const MAX_QTY = 48;

/** localStorage envuelto en try/catch: modo privado, cuota llena o almacenamiento bloqueado. */
const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      return window.localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      window.localStorage.setItem(name, value);
    } catch {
      /* sin persistencia, el carrito sigue funcionando en memoria */
    }
  },
  removeItem: (name) => {
    try {
      window.localStorage.removeItem(name);
    } catch {
      /* noop */
    }
  },
};

interface CartUI {
  isOpen: boolean;
  checkoutOpen: boolean;
  checkoutMessage: string | null;
  /** Se incrementa en cada "Agregar" para animar el botón del carrito. */
  bump: number;
  open(): void;
  close(): void;
  closeCheckout(): void;
}

export type CartStore = CartProvider & CartUI;

const clamp = (n: number) => Math.max(0, Math.min(MAX_QTY, Math.floor(n)));

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      checkoutOpen: false,
      checkoutMessage: null,
      bump: 0,

      add: (productId, quantity = 1) => {
        const product = getProduct(productId);
        if (!product || product.status !== "available") return;
        set((s) => {
          const existing = s.lines.find((l) => l.productId === productId);
          const lines = existing
            ? s.lines.map((l) =>
                l.productId === productId ? { ...l, quantity: clamp(l.quantity + quantity) } : l,
              )
            : [...s.lines, { productId, quantity: clamp(quantity) }];
          return { lines, bump: s.bump + 1 };
        });
      },
      setQuantity: (productId, quantity) =>
        set((s) => ({
          lines: s.lines
            .map((l) => (l.productId === productId ? { ...l, quantity: clamp(quantity) } : l))
            .filter((l) => l.quantity > 0),
        })),
      remove: (productId) => set((s) => ({ lines: s.lines.filter((l) => l.productId !== productId) })),
      clear: () => set({ lines: [] }),

      checkout: async () => {
        let result: CheckoutResult;
        try {
          const res = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lines: get().lines, locale: "es" }),
          });
          result = (await res.json()) as CheckoutResult;
        } catch {
          result = { status: "coming_soon", message: "" };
        }
        if (result.status === "redirect") {
          window.location.assign(result.url);
        } else {
          set({ isOpen: false, checkoutOpen: true, checkoutMessage: result.message || null });
        }
        return result;
      },

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      closeCheckout: () => set({ checkoutOpen: false }),
    }),
    {
      name: "goat-cart",
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      partialize: (s) => ({ lines: s.lines }),
      // Se rehidrata en el cliente (CartRoot) para evitar desajustes de hidratación.
      skipHydration: true,
    },
  ),
);

export function getTotals(lines: CartLine[]): CartTotals {
  let itemCount = 0;
  let subtotal: number | null = 0;
  for (const line of lines) {
    const product = getProduct(line.productId);
    if (!product) continue;
    itemCount += line.quantity;
    if (product.priceCents === null || subtotal === null) subtotal = null;
    else subtotal += product.priceCents * line.quantity;
  }
  return { itemCount, subtotalCents: subtotal, currency: "MXN" };
}
