import "server-only";
import postgres from "postgres";

/**
 * Conexión a Postgres. Funciona igual con Supabase o Railway: solo cambia DATABASE_URL.
 * - Supabase: usa la cadena del pooler (puerto 6543) con `?sslmode=require`.
 * - Railway: usa la DATABASE_URL que da el servicio de Postgres.
 * Sin DATABASE_URL el sitio funciona con los datos de `content/` (modo preview).
 */

type Sql = ReturnType<typeof postgres>;

const globalForDb = globalThis as unknown as { goatSql?: Sql };

export const hasDatabase = () => Boolean(process.env.DATABASE_URL);

export function db(): Sql {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL no está definida");
  // Una sola instancia por proceso (en desarrollo, el hot reload re-ejecuta el módulo).
  globalForDb.goatSql ??= postgres(url, {
    // Los poolers en modo transacción (Supabase :6543, PgBouncer) no admiten prepared statements.
    prepare: false,
    max: Number(process.env.DATABASE_POOL_MAX ?? 5),
    idle_timeout: 20,
    connect_timeout: 10,
  });
  return globalForDb.goatSql;
}
