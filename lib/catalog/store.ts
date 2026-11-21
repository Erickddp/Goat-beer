"use client";

import { create } from "zustand";
import { products as contentProducts, type Product } from "@/content/products";

/**
 * Catálogo en el navegador. Arranca con `content/products.ts` y `<CatalogSync/>` lo reemplaza
 * con lo que el servidor leyó de la base de datos. El carrito lo consulta para precios y stock.
 */
interface CatalogState {
  products: Product[];
  /** true cuando ya llegó el catálogo del servidor. */
  synced: boolean;
  setProducts(products: Product[]): void;
}

export const useCatalog = create<CatalogState>()((set) => ({
  products: contentProducts,
  synced: false,
  setProducts: (products) => set({ products, synced: true }),
}));

export const findProduct = (products: readonly Product[], id: string) => products.find((p) => p.id === id);

/** Hook: un producto por id con el catálogo vigente. */
export const useProduct = (id: string) => useCatalog((s) => findProduct(s.products, id));
