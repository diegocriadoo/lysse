/**
 * Información de la tienda y condiciones comerciales.
 *
 * `verified: true` significa que el dato aparece en fuentes públicas (web de
 * CartoonCorp o directorios), no que el cliente lo haya confirmado. Todo lo
 * marcado como `demo` es un valor de relleno y debe sustituirse.
 */
export const store = {
  name: "CartoonCorp",
  legalName: "Cartoon Corp SLU (por confirmar)",
  tagline: "Tu tienda friki en Valencia desde el mostrador hasta tu casa",
  address: {
    street: "C/ Guillem de Castro, 53",
    postalCode: "46007",
    city: "Valencia",
    verified: true,
  },
  phone: { display: "963 28 83 85", href: "tel:+34963288385", verified: true },
  /** Hay dos direcciones distintas en fuentes públicas; confirmar cuál es la vigente. */
  email: { display: "cartooncorp@gmail.com", href: "mailto:cartooncorp@gmail.com", verified: false },
  /** Las fuentes públicas no coinciden; se muestra como pendiente. */
  hours: null as null | { days: string; time: string }[],
  blogUrl: "https://noticias.cartooncorp.net/",
  social: [{ label: "Bluesky", href: "https://bsky.app/profile/cartooncorp.bsky.social" }],
};

export const commerce = {
  currency: "EUR",
  /** Verificado en fichas de producto: "Envío gratuito por pedidos superiores a 60€". */
  freeShippingThreshold: 60,
  shippingMethods: [
    {
      id: "pickup",
      label: "Recogida en tienda",
      description: "Recoge tu pedido en C/ Guillem de Castro, 53 (Valencia).",
      price: 0,
      /** Las condiciones de uso mencionan la recogida sin gastos de envío. */
      verified: true,
    },
    {
      id: "standard",
      label: "Envío a domicilio (Correos o agencia)",
      description: "Tarifa y plazo de demostración. Gratis a partir de 60 €.",
      price: 4.95,
      verified: false,
    },
  ],
  /** cartooncorp.net habla de 14 días naturales; cartooncorp.es de 7 días. */
  withdrawalDays: 14,
  /** IVA incluido en los precios (las fichas indican "impuestos incluidos"). */
  taxIncluded: true,
};

export type ShippingMethodId = (typeof commerce.shippingMethods)[number]["id"];
