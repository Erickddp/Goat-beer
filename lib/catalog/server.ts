import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { products as contentProducts, type Product, type ProductStatus } from "@/content/products";
import { db, hasDatabase } from "@/lib/db";

/**
 * Catálogo del lado del servidor.
 * - `getCatalog()`: para mostrar (tienda, home). En caché unos minutos; se invalida con `revalidateTag("catalog")`.
 * - `getCatalogFresh()`: sin caché, para cobrar (checkout). Precios y stock siempre al momento.
 * Sin DATABASE_URL, ambos devuelven `content/products.ts` (modo preview).
 */

export const CATALOG_TAG = "catalog";

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  style: string;
  short_description: string;
  units_per_pack: number;
  price_cents: number | null;
  currency: "MXN";
  status: ProductStatus | "hidden";
  featured: boolean;
  specs: Product["specs"] | null;
  image: Product["image"] | null;
  sku: string | null;
  available: number | null;
}

const toProduct = (r: ProductRow): Product => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  style: r.style,
  shortDescription: r.short_description,
  unitsPerPack: r.units_per_pack,
  priceCents: r.price_cents,
  currency: r.currency,
  status: r.status as ProductStatus,
  ...(r.featured && { featured: true }),
  ...(r.specs && { specs: r.specs }),
  ...(r.image && { image: r.image }),
  ...(r.sku && { sku: r.sku }),
  stock: r.available,
});

async function queryCatalog(): Promise<Product[]> {
  const rows = await db()<ProductRow[]>`
    select p.id, p.slug, p.name, p.style, p.short_description, p.units_per_pack,
           p.price_cents, p.currency, p.status, p.featured, p.specs, p.image, p.sku,
           (i.stock - i.reserved) as available
    from products p
    left join inventory i on i.product_id = p.id
    where p.status <> 'hidden'
    order by p.sort_order, p.name`;
  return rows.map(toProduct);
}

/** Para mostrar. Si la base falla, cae a `content/` (precios "por confirmar") en vez de romper la página. */
export async function getCatalog(): Promise<Product[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CATALOG_TAG);
  if (!hasDatabase()) return contentProducts;
  try {
    return await queryCatalog();
  } catch (err) {
    console.error("[catalog] No se pudo leer la base de datos; se usa content/products.ts:", err);
    return contentProducts;
  }
}

/** Para cobrar. Sin caché y sin respaldo: si la base falla, lanza (el checkout no debe cobrar a ciegas). */
export async function getCatalogFresh(): Promise<Product[]> {
  if (!hasDatabase()) return contentProducts;
  return queryCatalog();
}
