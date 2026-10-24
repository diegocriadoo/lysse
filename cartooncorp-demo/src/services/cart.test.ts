import { describe, expect, it } from "vitest";
import { cartReducer, computeTotals, lineKey, MAX_QTY_PER_LINE, parseStoredCart, resolveLines, resolveVariant, type CartLine } from "./cart";
import { getProductById } from "./catalog";

const chainsaw = "38490"; // 9,00 €
const innr = "40349"; // 219,95 €
const playmat = "d-ac-01"; // 19,95 € con variante XL a 29,95 € agotada

describe("cartReducer", () => {
  it("añade y agrupa la misma línea", () => {
    let s: CartLine[] = [];
    s = cartReducer(s, { type: "add", productId: chainsaw });
    s = cartReducer(s, { type: "add", productId: chainsaw, qty: 2 });
    expect(s).toEqual([{ productId: chainsaw, options: undefined, qty: 3 }]);
  });

  it("separa líneas por variante", () => {
    let s: CartLine[] = [];
    s = cartReducer(s, { type: "add", productId: playmat, options: { design: "noche" } });
    s = cartReducer(s, { type: "add", productId: playmat, options: { design: "bosque" } });
    expect(s).toHaveLength(2);
  });

  it("limita la cantidad por línea", () => {
    const s = cartReducer([], { type: "add", productId: chainsaw, qty: 50 });
    expect(s[0].qty).toBe(MAX_QTY_PER_LINE);
  });

  it("elimina la línea al poner cantidad 0", () => {
    const s = cartReducer([{ productId: chainsaw, qty: 2 }], { type: "setQty", key: lineKey(chainsaw), qty: 0 });
    expect(s).toEqual([]);
  });

  it("modifica la cantidad", () => {
    const s = cartReducer([{ productId: chainsaw, qty: 2 }], { type: "setQty", key: lineKey(chainsaw), qty: 5 });
    expect(s[0].qty).toBe(5);
  });
});

describe("totales", () => {
  it("suma sin errores de coma flotante y cobra envío por debajo de 60 €", () => {
    const lines = resolveLines([
      { productId: chainsaw, qty: 3 }, // 27,00
      { productId: "14049", qty: 1 }, // 8,50
    ]);
    const t = computeTotals(lines, "standard");
    expect(t.subtotal).toBe(35.5);
    expect(t.shipping).toBe(4.95);
    expect(t.total).toBe(40.45);
    expect(t.freeShippingRemaining).toBe(24.5);
    expect(t.itemCount).toBe(4);
  });

  it("envío gratis a partir de 60 €", () => {
    const t = computeTotals(resolveLines([{ productId: innr, qty: 1 }]), "standard");
    expect(t.shipping).toBe(0);
    expect(t.total).toBe(219.95);
    expect(t.qualifiesForFreeShipping).toBe(true);
  });

  it("recogida en tienda siempre gratis", () => {
    const t = computeTotals(resolveLines([{ productId: chainsaw, qty: 1 }]), "pickup");
    expect(t.shipping).toBe(0);
    expect(t.total).toBe(9);
  });

  it("carrito vacío sin gastos", () => {
    expect(computeTotals([], "standard").total).toBe(0);
  });

  it("usa el precio de la variante", () => {
    const [line] = resolveLines([{ productId: playmat, qty: 2, options: { design: "xl" } }]);
    expect(line.unitPrice).toBe(29.95);
    expect(line.lineTotal).toBe(59.9);
  });
});

describe("variantes", () => {
  it("hereda disponibilidad de la opción", () => {
    const p = getProductById(playmat)!;
    expect(resolveVariant(p, { design: "xl" }).availability).toBe("out_of_stock");
    expect(resolveVariant(p, { design: "noche" }).availability).toBe("in_stock");
  });
});

describe("persistencia", () => {
  it("descarta datos corruptos o productos inexistentes", () => {
    expect(parseStoredCart("no json")).toEqual([]);
    expect(parseStoredCart('{"a":1}')).toEqual([]);
    expect(parseStoredCart(JSON.stringify([{ productId: "nope", qty: 1 }, { productId: chainsaw, qty: 2.7 }, { productId: chainsaw, qty: -1 }]))).toEqual([
      { productId: chainsaw, options: undefined, qty: 2 },
    ]);
  });
});
