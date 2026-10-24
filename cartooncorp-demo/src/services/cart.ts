/**
 * Lógica pura del carrito (sin React), para poder probarla y reutilizarla.
 * Los importes se calculan en céntimos para evitar errores de coma flotante.
 */
import { commerce, type ShippingMethodId } from "../data/store";
import type { Availability, Product } from "../data/types";
import { getProductById } from "./catalog";

export const MAX_QTY_PER_LINE = 10;

export interface CartLine {
  productId: string;
  /** Opciones elegidas: { design: "noche" } */
  options?: Record<string, string>;
  qty: number;
}

export interface ResolvedLine extends CartLine {
  key: string;
  product: Product;
  optionLabels: string[];
  unitPrice: number;
  availability: Availability;
  lineTotal: number;
}

export const lineKey = (productId: string, options?: Record<string, string>) =>
  [productId, ...Object.entries(options ?? {}).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}:${v}`)].join("|");

export const toCents = (euros: number) => Math.round(euros * 100);
export const fromCents = (cents: number) => cents / 100;

/** Precio y disponibilidad efectivos según las variantes elegidas. */
export function resolveVariant(product: Product, options?: Record<string, string>) {
  let price = product.price;
  let availability = product.availability;
  const labels: string[] = [];
  for (const group of product.variants ?? []) {
    const opt = group.options.find((o) => o.id === options?.[group.id]);
    if (!opt) continue;
    labels.push(`${group.label}: ${opt.label}`);
    if (opt.price !== undefined) price = opt.price;
    if (opt.availability) availability = opt.availability;
  }
  return { price, availability, labels };
}

export const canPurchase = (a: Availability) => a === "in_stock" || a === "preorder" || a === "unknown";

export type CartAction =
  | { type: "add"; productId: string; options?: Record<string, string>; qty?: number }
  | { type: "setQty"; key: string; qty: number }
  | { type: "remove"; key: string }
  | { type: "clear" }
  | { type: "replace"; lines: CartLine[] };

export function cartReducer(lines: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case "add": {
      const key = lineKey(action.productId, action.options);
      const qty = Math.max(1, Math.floor(action.qty ?? 1));
      const existing = lines.find((l) => lineKey(l.productId, l.options) === key);
      if (existing) {
        return lines.map((l) => (l === existing ? { ...l, qty: Math.min(MAX_QTY_PER_LINE, l.qty + qty) } : l));
      }
      return [...lines, { productId: action.productId, options: action.options, qty: Math.min(MAX_QTY_PER_LINE, qty) }];
    }
    case "setQty": {
      const qty = Math.floor(action.qty);
      if (qty <= 0) return lines.filter((l) => lineKey(l.productId, l.options) !== action.key);
      return lines.map((l) => (lineKey(l.productId, l.options) === action.key ? { ...l, qty: Math.min(MAX_QTY_PER_LINE, qty) } : l));
    }
    case "remove":
      return lines.filter((l) => lineKey(l.productId, l.options) !== action.key);
    case "clear":
      return [];
    case "replace":
      return action.lines;
  }
}

export function resolveLines(lines: CartLine[], lookup: (id: string) => Product | undefined = getProductById): ResolvedLine[] {
  return lines.flatMap((line) => {
    const product = lookup(line.productId);
    if (!product) return [];
    const { price, availability, labels } = resolveVariant(product, line.options);
    return [
      {
        ...line,
        key: lineKey(line.productId, line.options),
        product,
        optionLabels: labels,
        unitPrice: price,
        availability,
        lineTotal: fromCents(toCents(price) * line.qty),
      },
    ];
  });
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  freeShippingRemaining: number;
  qualifiesForFreeShipping: boolean;
}

export function computeTotals(lines: ResolvedLine[], shippingMethod: ShippingMethodId = "standard"): CartTotals {
  const subtotalCents = lines.reduce((sum, l) => sum + toCents(l.unitPrice) * l.qty, 0);
  const thresholdCents = toCents(commerce.freeShippingThreshold);
  const qualifies = subtotalCents >= thresholdCents;
  const method = commerce.shippingMethods.find((m) => m.id === shippingMethod) ?? commerce.shippingMethods[0];
  const shippingCents = lines.length === 0 || qualifies ? 0 : toCents(method.price);
  return {
    itemCount: lines.reduce((n, l) => n + l.qty, 0),
    subtotal: fromCents(subtotalCents),
    shipping: fromCents(shippingCents),
    total: fromCents(subtotalCents + shippingCents),
    freeShippingRemaining: fromCents(Math.max(0, thresholdCents - subtotalCents)),
    qualifiesForFreeShipping: qualifies,
  };
}

const STORAGE_KEY = "cc-demo-cart-v1";

/** Lee el carrito guardado, descartando entradas corruptas o de productos inexistentes. */
export function parseStoredCart(raw: string | null, exists: (id: string) => boolean = (id) => !!getProductById(id)): CartLine[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data
      .filter((l): l is CartLine => l && typeof l.productId === "string" && Number.isFinite(l.qty) && l.qty > 0 && exists(l.productId))
      .map((l) => ({ productId: l.productId, options: l.options && typeof l.options === "object" ? l.options : undefined, qty: Math.min(MAX_QTY_PER_LINE, Math.floor(l.qty)) }));
  } catch {
    return [];
  }
}

export function loadCart(): CartLine[] {
  try {
    return parseStoredCart(localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

export function saveCart(lines: CartLine[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    /* almacenamiento no disponible (modo privado): el carrito vive en memoria */
  }
}
