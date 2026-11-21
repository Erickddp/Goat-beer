/**
 * Carga el catálogo de content/products.ts y las zonas de content/site.ts en la base de datos.
 *   DATABASE_URL=postgres://… npm run db:seed
 *
 * Por defecto NO pisa lo comercial que ya se haya editado en la base (precio, estado, orden):
 * solo inserta lo que falta y actualiza textos, imagen y specs.
 * Con `-- --force` sobrescribe también precio y estado con lo que diga content/products.ts.
 * No crea inventario: un producto sin fila en `inventory` se vende sin límite de stock.
 */
import postgres from "postgres";
import { products } from "../content/products.ts";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Falta DATABASE_URL");
  process.exit(1);
}
const force = process.argv.includes("--force");
const sql = postgres(url, { prepare: false, max: 1 });

try {
  await sql.begin(async (tx) => {
    for (const [i, p] of products.entries()) {
      const row = {
        id: p.id,
        slug: p.slug,
        name: p.name,
        style: p.style,
        short_description: p.shortDescription,
        units_per_pack: p.unitsPerPack,
        price_cents: p.priceCents,
        currency: p.currency,
        status: p.status,
        featured: p.featured ?? false,
        specs: p.specs ? tx.json(p.specs as unknown as postgres.JSONValue) : null,
        image: p.image ? tx.json(p.image as unknown as postgres.JSONValue) : null,
        sku: p.sku ?? null,
        sort_order: i,
      };
      const always = ["slug", "name", "style", "short_description", "units_per_pack", "specs", "image", "sku"] as const;
      const commercial = ["price_cents", "status", "featured", "sort_order"] as const;
      const update = force ? [...always, ...commercial] : always;
      await tx`
        insert into products ${tx(row)}
        on conflict (id) do update set ${tx(row, ...update)}`;
    }

    await tx`
      insert into delivery_zones (id, name, sort_order)
      values ('cd-juarez', 'Ciudad Juárez', 0)
      on conflict (id) do nothing`;
  });
  console.log(`✓ ${products.length} productos y zonas de entrega cargados${force ? " (forzado)" : ""}.`);
} catch (err) {
  console.error("Error al sembrar:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
