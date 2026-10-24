import { useState } from "react";
import type { Product } from "../data/types";
import { ProductArt } from "./ProductArt";

/**
 * Imagen de producto. Usa la foto real (`product.images[i].src`) cuando existe
 * y vuelve a la ilustración provisional si no hay foto o si no carga.
 * Con `mark`, la ilustración lleva una etiqueta que la identifica como provisional.
 */
export function ProductMedia({
  product,
  index = 0,
  view = 0,
  mark = false,
  eager = false,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  frame,
}: {
  product: Product;
  index?: number;
  view?: number;
  mark?: boolean;
  eager?: boolean;
  sizes?: string;
  frame?: "portrait" | "wide";
}) {
  const image = product.images[index] ?? product.images[0];
  const [failed, setFailed] = useState(false);

  if (image?.src && !failed) {
    return (
      <img
        className="product-photo"
        src={image.src}
        alt={image.alt}
        width={1200}
        height={1500}
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <>
      <ProductArt product={product} view={view} frame={frame} />
      {mark && <span className="ph-mark">Ilustración provisional</span>}
    </>
  );
}

export const hasPhoto = (product: Product) => !!product.images[0]?.src;
