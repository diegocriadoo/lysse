/**
 * Modelo de datos del catálogo.
 *
 * Está pensado para poder sustituir los ficheros de `src/data` por una API,
 * un CMS o una plataforma de e-commerce (PrestaShop, Shopify, etc.) sin tocar
 * la interfaz: los componentes sólo consumen `src/services/catalog.ts`.
 */

/** De dónde sale cada dato, para ser transparentes en la demo. */
export type DataSource =
  /** Nombre/precio vistos en la web pública de CartoonCorp (oct. 2026). */
  | "observed"
  /** Dato inventado para que la demo funcione. Debe sustituirse. */
  | "demo";

export type Availability = "in_stock" | "preorder" | "out_of_stock" | "unknown";

/** Estilo de la ilustración generada que sustituye a la foto real. */
export type ArtKind =
  | "manga"
  | "funko"
  | "tcg-box"
  | "tcg-pack"
  | "figure"
  | "model-kit"
  | "sleeves"
  | "board-game"
  | "puzzle"
  | "paint";

export interface ProductImage {
  /** URL de la foto real. Si falta, se usa la ilustración generada. */
  src?: string;
  alt: string;
}

export interface ProductVariantOption {
  id: string;
  label: string;
  /** Precio propio de la variante (si difiere del producto). */
  price?: number;
  availability?: Availability;
}

export interface ProductVariantGroup {
  id: string;
  label: string;
  options: ProductVariantOption[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** Slug de la subcategoría (o categoría) a la que pertenece. */
  category: string;
  brand?: string;
  /** Franquicia/licencia: One Piece, Dragon Ball, Magic... */
  franchise?: string;
  price: number;
  /** Sólo se rellena cuando el precio tachado se ha observado en la web real. */
  compareAtPrice?: number;
  availability: Availability;
  /** Fecha ISO de alta en el catálogo; ordena las "novedades". */
  addedAt: string;
  /** Texto libre de fecha de salida, sólo si se ha observado. */
  releaseNote?: string;
  shortDescription: string;
  description: string[];
  specs: { label: string; value: string }[];
  tags: string[];
  images: ProductImage[];
  art: { kind: ArtKind; hue: number; accent?: number; label?: string; number?: string };
  variants?: ProductVariantGroup[];
  featured?: boolean;
  /** Procedencia de nombre/precio y de la disponibilidad. */
  source: { name: DataSource; price: DataSource; availability: DataSource; url?: string };
  /** Aviso de público adulto/coleccionista, cuando la web real lo indica. */
  collectorNote?: string;
}

export interface Category {
  slug: string;
  name: string;
  /** Nombre corto para menús compactos. */
  shortName?: string;
  description: string;
  parent?: string;
  /** Matiz de color (0-360) para la identidad visual de la sección. */
  hue: number;
  /** Página real equivalente en la web pública, si se ha verificado. */
  sourceUrl?: string;
}
