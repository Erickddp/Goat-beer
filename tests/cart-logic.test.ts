import { test } from "node:test";
import assert from "node:assert/strict";
import { computeTotals, maxQtyFor, MAX_QTY, reconcileLines } from "../lib/cart/logic.ts";
import type { Product } from "../content/products.ts";

const base = {
  slug: "x",
  style: "Stout",
  shortDescription: "",
  unitsPerPack: 1,
  currency: "MXN" as const,
};
const p = (id: string, over: Partial<Product> = {}): Product => ({
  ...base,
  id,
  name: id.toUpperCase(),
  priceCents: 5000,
  status: "available",
  ...over,
});

const catalog: Product[] = [
  p("uno"),
  p("seis", { priceCents: 27000, unitsPerPack: 6 }),
  p("pocas", { stock: 3 }),
  p("agotada", { stock: 0 }),
  p("pronto", { status: "coming-soon" }),
  p("sin-precio", { priceCents: null }),
];

test("maxQtyFor: sin inventario usa el tope general; con inventario, el stock", () => {
  assert.equal(maxQtyFor(p("a")), MAX_QTY);
  assert.equal(maxQtyFor(p("a", { stock: null })), MAX_QTY);
  assert.equal(maxQtyFor(p("a", { stock: 3 })), 3);
  assert.equal(maxQtyFor(p("a", { stock: 500 })), MAX_QTY);
  assert.equal(maxQtyFor(p("a", { stock: -2 })), 0);
});

test("reconcile: conserva líneas válidas", () => {
  const r = reconcileLines([{ productId: "uno", quantity: 2 }], catalog);
  assert.deepEqual(r, { lines: [{ productId: "uno", quantity: 2 }], removed: [], reduced: [] });
});

test("reconcile: quita productos inexistentes, no disponibles o agotados", () => {
  const r = reconcileLines(
    [
      { productId: "fantasma", quantity: 1 },
      { productId: "pronto", quantity: 1 },
      { productId: "agotada", quantity: 1 },
      { productId: "uno", quantity: 1 },
    ],
    catalog,
  );
  assert.deepEqual(r.lines, [{ productId: "uno", quantity: 1 }]);
  assert.deepEqual(r.removed, [null, "PRONTO", "AGOTADA"]);
});

test("reconcile: baja la cantidad al stock disponible", () => {
  const r = reconcileLines([{ productId: "pocas", quantity: 10 }], catalog);
  assert.deepEqual(r.lines, [{ productId: "pocas", quantity: 3 }]);
  assert.deepEqual(r.reduced, ["POCAS"]);
});

test("reconcile: descarta cantidades inválidas, decimales y duplicados", () => {
  const r = reconcileLines(
    [
      { productId: "uno", quantity: 0 },
      { productId: "seis", quantity: 2.9 },
      { productId: "seis", quantity: 5 },
      { productId: "sin-precio", quantity: Number.NaN },
      { productId: "uno", quantity: 1e9 },
    ],
    catalog,
  );
  // "uno" con 0 se descarta, pero cuenta como visto: el duplicado con 1e9 se ignora.
  assert.deepEqual(r.lines, [{ productId: "seis", quantity: 2 }]);
});

test("computeTotals: suma en centavos enteros", () => {
  const t = computeTotals(
    [
      { productId: "uno", quantity: 3 },
      { productId: "seis", quantity: 2 },
    ],
    catalog,
  );
  assert.deepEqual(t, { itemCount: 5, subtotalCents: 3 * 5000 + 2 * 27000, currency: "MXN" });
});

test("computeTotals: subtotal null si algún producto no tiene precio", () => {
  const t = computeTotals(
    [
      { productId: "uno", quantity: 1 },
      { productId: "sin-precio", quantity: 1 },
    ],
    catalog,
  );
  assert.equal(t.subtotalCents, null);
  assert.equal(t.itemCount, 2);
});
