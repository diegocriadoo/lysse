import { useState } from "react";
import type { Product } from "../data/types";
import { ProductArt } from "./ProductArt";

/**
 * Imagen de producto. Usa la foto real (`product.images[i].src`) cuando existe
 * y vuelve a la ilustración provisional si no hay foto o si no carga.
 * Con `mark`, la ilustración lleva una etiqueta que la identifica como provisional;
 * con `caption`, una nota más detallada (para la galería), o el crédito de la foto.
 */
export function ProductMedia({
  product,
  index = 0,
  view = 0,
  mark = false,
  caption = false,
  eager = false,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  frame,
  backdrop = true,
}: {
  product: Product;
  index?: number;
  view?: number;
  mark?: boolean;
  caption?: boolean;
  eager?: boolean;
  sizes?: string;
  frame?: "portrait" | "wide";
  backdrop?: boolean;
}) {
  const image = product.images[index] ?? product.images[0];
  // Se guarda qué URL ha fallado para que una foto rota no afecte a las demás.
  const [failedSrc, setFailedSrc] = useState<string>();

  if (image?.src && image.src !== failedSrc) {
    return (
      <>
        <img
          className="product-photo"
          src={image.src}
          alt={image.alt}
          width={1200}
          height={1500}
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailedSrc(image.src)}
        />
        {caption && image.credit && (
          <span className="gallery__note">
            © {image.credit}
            {image.license ? ` · ${image.license}` : ""}
          </span>
        )}
      </>
    );
  }

  return (
    <>
      <ProductArt product={product} view={view} frame={frame} backdrop={backdrop} />
      {mark && (
        <span className="ph-mark" title="Ilustración provisional: foto pendiente">
          <span className="ph-mark__long">Ilustración </span>provisional
        </span>
      )}
      {caption && <span className="gallery__note">Ilustración provisional · foto pendiente</span>}
    </>
  );
}

export const hasPhoto = (product: Product) => !!product.images[0]?.src;
