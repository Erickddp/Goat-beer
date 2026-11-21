# Base de datos: guía de uso

El sitio usa **Postgres estándar**. El mismo código funciona con **Supabase** o con **Railway** (o cualquier Postgres ≥ 13):
solo cambia la variable `DATABASE_URL`.

- **Sin `DATABASE_URL`**: el sitio usa `content/products.ts` (modo preview, precios "por confirmar").
- **Con `DATABASE_URL`**: el catálogo, los precios y el inventario salen de la base de datos.

## Piezas

| Archivo | Qué hace |
|---|---|
| `db/migrations/*.sql` | Esquema. Se aplican en orden, una sola vez cada una |
| `scripts/db-migrate.ts` | `npm run db:migrate` |
| `scripts/db-seed.ts` | `npm run db:seed`: carga productos de `content/products.ts` y la zona Ciudad Juárez |
| `lib/db/index.ts` | Conexión (driver `postgres`, sin prepared statements para funcionar detrás de poolers) |
| `lib/catalog/server.ts` | `getCatalog()` (para mostrar, en caché ~1 min) y `getCatalogFresh()` (para cobrar, sin caché) |
| `lib/catalog/store.ts` + `components/providers/CatalogSync.tsx` | Pasan el catálogo al navegador y ajustan el carrito guardado |
| `lib/cart/logic.ts` | Reglas del carrito (stock, cantidades, totales), compartidas por navegador y servidor. Pruebas: `npm test` |

## Tablas

- `products`: catálogo. `price_cents` en centavos enteros (`null` = por confirmar). `status`: `available`, `coming-soon` o `hidden` (no se muestra).
- `inventory`: `stock` y `reserved` por producto. **Sin fila = sin control de stock** (se vende sin límite, tope 48 por pedido).
- `delivery_zones`: zonas con costo de envío y mínimo de compra.
- `orders`, `order_items`: pedidos. Se empiezan a usar en la Fase 3 (checkout).

Todas tienen RLS activado sin políticas: la API pública de Supabase no puede leerlas ni escribirlas. El sitio entra con `DATABASE_URL` desde el servidor.

## Puesta en marcha

### Opción A: Supabase + Vercel
1. Crear proyecto en Supabase (región más cercana: `us-west` o `us-east`).
2. Copiar la cadena de conexión del **pooler en modo transacción** (puerto 6543) y agregar `?sslmode=require`.
3. En local: `DATABASE_URL="postgres://…:6543/postgres?sslmode=require" npm run db:migrate && npm run db:seed`.
4. En Vercel: variable `DATABASE_URL` (Production y Preview) y volver a desplegar.

### Opción B: Railway (todo en uno)
1. Proyecto en Railway con dos servicios: **Postgres** y el **repo** (Railway detecta Next.js).
2. En el servicio del sitio: variable `DATABASE_URL = ${{Postgres.DATABASE_URL}}` (referencia interna).
3. Migrar desde tu máquina con la URL **pública** del Postgres (`DATABASE_PUBLIC_URL`): `DATABASE_URL="…" npm run db:migrate && npm run db:seed`.
4. Comando de inicio: `npm run start` (Railway asigna `PORT`; `next start` lo respeta).

## Operación diaria (mientras no hay panel)

Desde el editor SQL de Supabase, la pestaña Data de Railway o `psql`:

```sql
-- Precios (centavos): $65.00 = 6500
update products set price_cents = 6500  where id = 'mezquite-stout-1';
update products set price_cents = 35000 where id = 'mezquite-stout-6';

-- Activar control de stock de un producto
insert into inventory (product_id, stock) values ('mezquite-stout-6', 40)
on conflict (product_id) do update set stock = excluded.stock;

-- Quitar el control de stock (vender sin límite)
delete from inventory where product_id = 'mezquite-stout-6';

-- Ocultar un producto sin borrarlo
update products set status = 'hidden' where id = 'proximamente';

-- Costo de envío y mínimo en Ciudad Juárez
update delivery_zones set shipping_cents = 5000, min_order_cents = 30000 where id = 'cd-juarez';
```

Los cambios se ven en el sitio en **~1 minuto** (caché de `getCatalog`). El checkout siempre lee el valor al momento.

## Reglas importantes

- **El build necesita `DATABASE_URL`**: las páginas se prerenderizan con el catálogo. Si se construye sin ella, salen precios "por confirmar" hasta la siguiente revalidación (~1 min) o el siguiente despliegue con la variable.
- Si la base no responde, la tienda **no se cae**: muestra el catálogo de `content/` y registra el error. El checkout, en cambio, **se niega a cobrar** (503).
- `npm run db:seed` no pisa precios, estado ni orden que ya se hayan editado en la base. Para forzarlo: `npm run db:seed -- --force`.
- Migraciones nuevas: crear `db/migrations/0002_lo-que-sea.sql`; nunca editar una ya aplicada.
- Dinero siempre en centavos enteros.
