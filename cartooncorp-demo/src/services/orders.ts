/**
 * Pedidos de DEMOSTRACIÓN. No se envía nada a ningún servidor ni se procesa
 * ningún pago: el "pedido" se guarda sólo en el navegador para poder mostrar
 * la confirmación y el historial de la cuenta demo.
 */
import type { ShippingMethodId } from "../data/store";
import type { CartTotals, ResolvedLine } from "./cart";

export interface DemoOrder {
  id: string;
  createdAt: string;
  email: string;
  name: string;
  shippingMethod: ShippingMethodId;
  address?: string;
  paymentMethod: string;
  lines: { name: string; qty: number; unitPrice: number; options: string[] }[];
  totals: Pick<CartTotals, "subtotal" | "shipping" | "total" | "itemCount">;
}

const KEY = "cc-demo-orders-v1";

export function listOrders(): DemoOrder[] {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function getOrder(id: string) {
  return listOrders().find((o) => o.id === id);
}

export function placeDemoOrder(input: Omit<DemoOrder, "id" | "createdAt" | "lines" | "totals"> & { lines: ResolvedLine[]; totals: CartTotals }): Promise<DemoOrder> {
  const order: DemoOrder = {
    ...input,
    id: `DEMO-${Date.now().toString(36).toUpperCase().slice(-6)}`,
    createdAt: new Date().toISOString(),
    lines: input.lines.map((l) => ({ name: l.product.name, qty: l.qty, unitPrice: l.unitPrice, options: l.optionLabels })),
    totals: { subtotal: input.totals.subtotal, shipping: input.totals.shipping, total: input.totals.total, itemCount: input.totals.itemCount },
  };
  return new Promise((resolve) =>
    setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify([order, ...listOrders()].slice(0, 20)));
      } catch {
        /* sin almacenamiento: la confirmación se muestra igualmente desde memoria */
      }
      resolve(order);
    }, 900),
  );
}
