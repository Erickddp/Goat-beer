"use client";

import { useEffect } from "react";
import type { Product } from "@/content/products";
import { useCatalog } from "@/lib/catalog/store";
import { useCart } from "@/lib/cart/store";

/** Pasa el catálogo del servidor al navegador y ajusta el carrito guardado (productos retirados, stock). */
export default function CatalogSync({ products }: { products: Product[] }) {
  useEffect(() => {
    useCatalog.getState().setProducts(products);
    // Si el carrito aún no se lee de localStorage, ajustarlo ahora guardaría uno vacío encima.
    // En ese caso lo ajusta onRehydrateStorage en cuanto termine de leerse.
    if (useCart.persist.hasHydrated()) useCart.getState().reconcile();
  }, [products]);
  return null;
}
