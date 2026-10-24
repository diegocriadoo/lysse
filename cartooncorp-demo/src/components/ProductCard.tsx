import { Link } from "react-router";
import { getCategory } from "../data/categories";
import type { Product } from "../data/types";
import { canPurchase } from "../services/cart";
import { isOnSale } from "../services/catalog";
import { useCart } from "../state/CartContext";
import { Icon } from "./Icon";
import { ProductArt } from "./ProductArt";
import { AvailabilityBadge, Price } from "./ui";

export function ProductCard({ product, headingLevel = 3 }: { product: Product; headingLevel?: 2 | 3 }) {
  const { add } = useCart();
  const category = getCategory(product.category);
  const H = `h${headingLevel}` as const;
  const purchasable = canPurchase(product.availability);
  const needsOptions = !!product.variants?.length;
  const url = `/producto/${product.slug}`;

  return (
    <article className={`card ${product.availability === "out_of_stock" ? "card--soldout" : ""}`}>
      <Link to={url} className="card__media" tabIndex={-1} aria-hidden="true">
        <ProductArt product={product} />
        <div className="card__flags">
          {isOnSale(product) && <span className="flag flag--sale">Oferta</span>}
          {product.availability === "preorder" && <span className="flag flag--pre">Pre-pedido</span>}
          {product.source.name === "demo" && <span className="flag flag--demo">Demo</span>}
        </div>
      </Link>
      <div className="card__body">
        <p className="card__meta">{product.brand ?? category?.name}</p>
        <H className="card__title">
          <Link to={url}>{product.name}</Link>
        </H>
        <div className="card__foot">
          <div>
            <Price product={product} />
            <AvailabilityBadge value={product.availability} />
          </div>
          {purchasable &&
            (needsOptions ? (
              <Link to={url} className="card__add" aria-label={`Elegir opciones de ${product.name}`}>
                <Icon name="arrow-right" />
              </Link>
            ) : (
              <button type="button" className="card__add" onClick={() => add(product)} aria-label={`${product.availability === "preorder" ? "Reservar" : "Añadir al carrito"}: ${product.name}`}>
                <Icon name="plus" />
              </button>
            ))}
        </div>
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
