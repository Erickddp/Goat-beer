/**
 * Aplica las migraciones de db/migrations/*.sql en orden, una sola vez cada una.
 *   DATABASE_URL=postgres://… npm run db:migrate
 * Cada archivo corre en una transacción; si falla, no se aplica nada de ese archivo.
 */
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Falta DATABASE_URL");
  process.exit(1);
}

const dir = join(import.meta.dirname, "..", "db", "migrations");
const sql = postgres(url, { prepare: false, max: 1, onnotice: () => {} });

try {
  await sql`
    create table if not exists schema_migrations (
      name       text primary key,
      applied_at timestamptz not null default now()
    )`;
  const applied = new Set((await sql<{ name: string }[]>`select name from schema_migrations`).map((r) => r.name));
  const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();

  let count = 0;
  for (const file of files) {
    if (applied.has(file)) continue;
    const text = await readFile(join(dir, file), "utf8");
    await sql.begin(async (tx) => {
      await tx.unsafe(text);
      await tx`insert into schema_migrations (name) values (${file})`;
    });
    console.log(`✓ ${file}`);
    count++;
  }
  console.log(count ? `${count} migración(es) aplicada(s).` : "Sin migraciones pendientes.");
} catch (err) {
  console.error("Error al migrar:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
