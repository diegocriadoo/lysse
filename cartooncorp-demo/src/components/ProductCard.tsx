import { Link } from "react-router";
import { getCategory } from "../data/categories";
import type { Product } from "../data/types";
import { canPurchase } from "../services/cart";
import { discountPercent, isOnSale } from "../services/catalog";
import { useCart } from "../state/CartContext";
import { Icon } from "./Icon";
import { ProductMedia } from "./ProductMedia";
import { AvailabilityBadge, Price } from "./ui";

export function ProductCard({ product, headingLevel = 3 }: { product: Product; headingLevel?: 2 | 3 }) {
  const { add } = useCart();
  const category = getCategory(product.category);
  const H = `h${headingLevel}` as const;
  const purchasable = canPurchase(product.availability);
  const needsOptions = !!product.variants?.length;
  const preorder = product.availability === "preorder";
  const url = `/producto/${product.slug}`;

  return (
    <article className={`card ${product.availability === "out_of_stock" ? "card--soldout" : ""}`}>
      <Link to={url} className="card__media" tabIndex={-1} aria-hidden="true">
        <ProductMedia product={product} mark />
        <div className="card__flags">
          {isOnSale(product) && <span className="flag flag--sale">−{discountPercent(product)}%</span>}
          {preorder && <span className="flag flag--pre">Pre-pedido</span>}
          {product.availability === "out_of_stock" && <span className="flag">Agotado</span>}
          {product.source.name === "demo" && <span className="flag flag--demo">Producto demo</span>}
        </div>
      </Link>
      <div className="card__body">
        <p className="card__meta">{[product.brand, category?.shortName ?? category?.name].filter(Boolean).join(" · ")}</p>
        <H className="card__title">
          <Link to={url}>{product.name}</Link>
        </H>
        <div className="card__price">
          <Price product={product} />
          <AvailabilityBadge value={product.availability} />
        </div>
        {!purchasable ? (
          <span className="card__cta card__cta--off">Sin stock</span>
        ) : needsOptions ? (
          <Link to={url} className="card__cta" aria-label={`Elegir opción de ${product.name}`}>
            Elegir opción <Icon name="arrow-right" />
          </Link>
        ) : (
          <button type="button" className="card__cta" onClick={() => add(product)} aria-label={`${preorder ? "Reservar" : "Añadir al carrito"}: ${product.name}`}>
            <Icon name={preorder ? "calendar" : "cart"} /> {preorder ? "Reservar" : "Añadir"}
          </button>
        )}
      </div>
    </article>
  );
}

export function ProductGrid({ products, headingLevel }: { products: Product[]; headingLevel?: 2 | 3 }) {
  return (
    <ul className="grid-products">
      {products.map((p) => (
        <li key={p.id}>
          <ProductCard product={p} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}

/** Carrusel horizontal con scroll nativo (y snap) en móvil; rejilla en escritorio. */
export function ProductRail({ products, label }: { products: Product[]; label: string }) {
  return (
    <ul className="rail" aria-label={label}>
      {products.map((p) => (
        <li key={p.id}>
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
}

export function CardSkeleton({ count = 8 }: { count?: number }) {
  return (
    <ul className="grid-products" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <div className="card card--skeleton">
            <div className="card__media skeleton" />
            <div className="card__body">
              <div className="skeleton skeleton--line" style={{ width: "40%" }} />
              <div className="skeleton skeleton--line" />
              <div className="skeleton skeleton--line" style={{ width: "70%" }} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
