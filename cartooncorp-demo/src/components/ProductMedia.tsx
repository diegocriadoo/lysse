import { useState } from "react";
import type { Product } from "../data/types";
import { Icon } from "./Icon";

/**
 * Imagen de producto. Muestra la fotografía real (`product.images[i].src`) y,
 * si no hay foto verificada o no carga, un marcador neutro «Foto pendiente».
 * Nunca se dibuja una imagen que imite el producto.
 * Con `caption`, añade el crédito de la foto (galería de la ficha).
 */
export function ProductMedia({
  product,
  index = 0,
  eager = false,
  caption = false,
  compact = false,
  sizes = "(min-width: 1024px) 25vw, 50vw",
}: {
  product: Product;
  index?: number;
  eager?: boolean;
  caption?: boolean;
  /** Marcador sin texto, para miniaturas (carrito, buscador, resumen). */
  compact?: boolean;
  sizes?: string;
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
          width={900}
          height={900}
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

  const demo = product.source.name === "demo";
  return (
    <span className={`photo-pending ${compact ? "photo-pending--compact" : ""}`} role="img" aria-label={`${product.name}: foto pendiente`}>
      <Icon name="camera" className="photo-pending__icon" />
      {!compact && (
        <>
          <span className="photo-pending__title">{demo ? "Producto de ejemplo" : "Foto pendiente"}</span>
          {!demo && <span className="photo-pending__text">Imagen oficial por incorporar</span>}
        </>
      )}
    </span>
  );
}

export const hasPhoto = (product: Product) => !!product.images[0]?.src;
