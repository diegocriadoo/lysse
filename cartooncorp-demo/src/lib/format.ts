const eur = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

export const formatPrice = (value: number) => eur.format(value);

export const availabilityLabel = {
  in_stock: "Disponible",
  preorder: "Pre-pedido",
  out_of_stock: "Agotado",
  unknown: "Consultar",
} as const;

export function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}
