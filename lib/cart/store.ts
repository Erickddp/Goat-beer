"use client";

import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import { findProduct, useCatalog } from "@/lib/catalog/store";
import { clampQty, computeTotals, maxQtyFor, reconcileLines } from "./logic";
import type { CartLine, CartProvider, CartTotals, CheckoutResult } from "./types";

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

export interface CartNotice {
  removed: (string | null)[];
  reduced: string[];
}

interface CartUI {
  isOpen: boolean;
  checkoutOpen: boolean;
  checkoutMessage: string | null;
  /** Error del checkout que se muestra dentro del carrito (p. ej. algo se agotó). */
  checkoutError: string | null;
  /** Se incrementa en cada "Agregar" para animar el botón del carrito. */
  bump: number;
  /** Aviso cuando el carrito guardado cambió para ajustarse al catálogo. */
  notice: CartNotice | null;
  open(): void;
  close(): void;
  closeCheckout(): void;
  dismissNotice(): void;
  /** Ajusta las líneas al catálogo vigente (al rehidratar y cuando llega el catálogo del servidor). */
  reconcile(): void;
}

export type CartStore = CartProvider & CartUI;

const catalog = () => useCatalog.getState().products;

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      checkoutOpen: false,
      checkoutMessage: null,
      checkoutError: null,
      bump: 0,
      notice: null,

      add: (productId, quantity = 1) => {
        const product = findProduct(catalog(), productId);
        if (!product || product.status !== "available") return;
        const max = maxQtyFor(product);
        if (max === 0) return;
        set((s) => {
          const existing = s.lines.find((l) => l.productId === productId);
          const lines = existing
            ? s.lines.map((l) =>
                l.productId === productId ? { ...l, quantity: Math.min(max, clampQty(l.quantity + quantity)) } : l,
              )
            : [...s.lines, { productId, quantity: Math.min(max, clampQty(quantity)) }];
          return { lines, bump: s.bump + 1 };
        });
      },
      setQuantity: (productId, quantity) => {
        const product = findProduct(catalog(), productId);
        const max = product ? maxQtyFor(product) : 0;
        set((s) => ({
          lines: s.lines
            .map((l) => (l.productId === productId ? { ...l, quantity: Math.min(max, clampQty(quantity)) } : l))
            .filter((l) => l.quantity > 0),
        }));
      },
      remove: (productId) => set((s) => ({ lines: s.lines.filter((l) => l.productId !== productId) })),
      clear: () => set({ lines: [] }),

      reconcile: () => {
        const { lines, removed, reduced } = reconcileLines(get().lines, catalog());
        const changed = removed.length > 0 || reduced.length > 0;
        set({ lines, ...(changed && { notice: { removed, reduced } }) });
      },

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
        } else if (result.status === "error") {
          set({ checkoutError: result.message });
        } else {
          set({ isOpen: false, checkoutOpen: true, checkoutMessage: result.message || null, checkoutError: null });
        }
        return result;
      },

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false, checkoutError: null }),
      closeCheckout: () => set({ checkoutOpen: false }),
      dismissNotice: () => set({ notice: null }),
    }),
    {
      name: "goat-cart",
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      partialize: (s) => ({ lines: s.lines }),
      // Se rehidrata en el cliente (CartRoot) para evitar desajustes de hidratación.
      skipHydration: true,
      // Un carrito guardado puede traer productos que ya no existen o cantidades inválidas.
      // Solo si ya llegó el catálogo del servidor; si no, lo hace <CatalogSync/> al recibirlo.
      onRehydrateStorage: () => (state) => {
        if (useCatalog.getState().synced) state?.reconcile();
      },
    },
  ),
);

export const getTotals = (lines: CartLine[]): CartTotals => computeTotals(lines, catalog());

/** Hook: totales que se recalculan cuando cambian las líneas o el catálogo. */
export function useCartTotals(): CartTotals {
  const lines = useCart((s) => s.lines);
  const products = useCatalog((s) => s.products);
  return computeTotals(lines, products);
}
