import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { Icon } from "../components/Icon";
import { ProductMedia } from "../components/ProductMedia";
import { ProductRail } from "../components/ProductCard";
import { AvailabilityBadge, Breadcrumbs, DemoNote, Price, QuantityStepper, SectionHead } from "../components/ui";
import { getCategory } from "../data/categories";
import { commerce, store } from "../data/store";
import type { Product } from "../data/types";
import { usePageMeta } from "../hooks/usePageMeta";
import { formatPrice } from "../lib/format";
import { canPurchase, resolveVariant } from "../services/cart";
import { getProductBySlug, getRelated, isOnSale } from "../services/catalog";
import { useCart } from "../state/CartContext";
import { NotFoundPage } from "./NotFoundPage";

export function ProductPage() {
  const { slug = "" } = useParams();
  const product = getProductBySlug(slug);
  usePageMeta(
    product?.name ?? "Producto no encontrado",
    product ? `${product.shortDescription} ${formatPrice(product.price)}.` : undefined,
    product && {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
      description: product.shortDescription,
      sku: product.id,
      offers: {
        "@type": "Offer",
        priceCurrency: "EUR",
        price: product.price.toFixed(2),
        availability: `https://schema.org/${product.availability === "in_stock" ? "InStock" : product.availability === "preorder" ? "PreOrder" : "OutOfStock"}`,
      },
    },
  );
  if (!product) return <NotFoundPage what="producto" />;
  // `key` reinicia la galería, variantes y cantidad al cambiar de producto.
  return <ProductView key={product.id} product={product} />;
}

function ProductView({ product }: { product: Product }) {
  const { add } = useCart();
  const category = getCategory(product.category);
  const parent = category?.parent ? getCategory(category.parent) : undefined;
  const [qty, setQty] = useState(1);
  const [options, setOptions] = useState<Record<string, string>>(() =>
    Object.fromEntries((product.variants ?? []).map((g) => [g.id, (g.options.find((o) => canPurchase(o.availability ?? product.availability)) ?? g.options[0]).id])),
  );
  const { price, availability } = resolveVariant(product, options);
  const purchasable = canPurchase(availability);
  const related = getRelated(product);
  const buyBox = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  // Barra fija de compra en móvil cuando el botón principal queda por encima
  // de la pantalla. Se calcula en cada scroll (y no con IntersectionObserver)
  // para que funcione también con saltos bruscos de scroll.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = buyBox.current;
      if (el) setShowSticky(el.getBoundingClientRect().bottom < 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const onAdd = () => {
    if (add(product, qty, product.variants ? options : undefined)) setQty(1);
  };
  const cta = availability === "preorder" ? "Reservar ahora" : purchasable ? "Añadir al carrito" : "Agotado";

  const crumbs = [
    ...(parent ? [{ label: parent.name, to: `/categoria/${parent.slug}` }] : []),
    ...(category ? [{ label: category.name, to: `/categoria/${category.slug}` }] : []),
    { label: product.name },
  ];

  return (
    <div className="container page pdp" style={{ ["--hue" as string]: product.art.hue }}>
      <Breadcrumbs items={crumbs} />
      <div className="pdp__grid">
        <Gallery product={product} />

        <div className="pdp__info">
          <div className="pdp__kicker">
            {product.franchise && <p className="eyebrow">{product.franchise}</p>}
            <SourceChip product={product} />
          </div>
          <h1 className="pdp__title">{product.name}</h1>
          {product.brand && <p className="pdp__brand">{product.brand}</p>}

          <div className="pdp__pricebox">
            <div className="pdp__price-row">
              <Price product={product} price={price} size="lg" />
              <AvailabilityBadge value={availability} />
            </div>
            <p className="muted small">
              {isOnSale(product) && price === product.price && (
                <strong className="pdp__save">Ahorras {formatPrice(product.compareAtPrice! - product.price)} · </strong>
              )}
              IVA incluido · Ref. {product.id}
            </p>
          </div>

          <p className="pdp__lead">{product.shortDescription}</p>
          {product.specs.length > 0 && (
            <ul className="pdp__keyspecs" aria-label="Características principales">
              {product.specs.slice(0, 3).map((sp) => (
                <li key={sp.label}>
                  <span>{sp.label}</span>
                  <strong>{sp.value}</strong>
                </li>
              ))}
            </ul>
          )}

          {product.variants?.map((group) => (
            <fieldset key={group.id} className="variants">
              <legend>
                {group.label}: <strong>{group.options.find((o) => o.id === options[group.id])?.label}</strong>
              </legend>
              <div className="variants__list">
                {group.options.map((o) => {
                  const soldOut = !canPurchase(o.availability ?? product.availability);
                  return (
                    <label key={o.id} className={`variant ${soldOut ? "variant--soldout" : ""}`}>
                      <input type="radio" name={group.id} value={o.id} checked={options[group.id] === o.id} onChange={() => setOptions((s) => ({ ...s, [group.id]: o.id }))} />
                      <span>
                        {o.label}
                        {o.price !== undefined && <small> · {formatPrice(o.price)}</small>}
                        {soldOut && <small> · agotado</small>}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}

          <div className="buybox" ref={buyBox}>
            {purchasable && <QuantityStepper value={qty} onChange={setQty} />}
            <button type="button" className="btn btn--primary btn--lg buybox__cta" onClick={onAdd} disabled={!purchasable}>
              <Icon name={purchasable ? "cart" : "alert"} /> {cta}
            </button>
          </div>
          {availability === "preorder" && (
            <DemoNote>Producto en pre-pedido. Se envía o se puede recoger cuando llegue a tienda. Las condiciones reales de reserva deben definirse con CartoonCorp.</DemoNote>
          )}
          {!purchasable && <DemoNote tone="warn">Sin unidades ahora mismo. En producción aquí iría un aviso de reposición por email.</DemoNote>}
          {product.collectorNote && <p className="muted small">{product.collectorNote}</p>}

          <ul className="pdp__perks">
            <li>
              <Icon name="truck" />
              <span>
                {price >= commerce.freeShippingThreshold ? <strong>Envío gratis</strong> : <>Envío gratis desde <strong>{formatPrice(commerce.freeShippingThreshold)}</strong></>}
              </span>
            </li>
            <li>
              <Icon name="store" />
              <span>Recogida gratis en {store.address.street}</span>
            </li>
            {price < commerce.freeShippingThreshold && (
              <li>
                <Icon name="box" />
                <span>
                  Envío a domicilio: {formatPrice(commerce.shippingMethods.find((m) => m.id === "standard")!.price)} <small className="muted">(tarifa orientativa de la demo)</small>
                </span>
              </li>
            )}
            <li>
              <Icon name="return" />
              <span>
                Desistimiento en {commerce.withdrawalDays} días · <Link to="/devoluciones">condiciones</Link>
              </span>
            </li>
          </ul>

          <div className="accordion">
            <details open>
              <summary>Descripción</summary>
              {product.description.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </details>
            {product.specs.length > 0 && (
              <details>
                <summary>Características</summary>
                <dl className="specs">
                  {product.specs.map((s) => (
                    <div key={s.label}>
                      <dt>{s.label}</dt>
                      <dd>{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            )}
            <details>
              <summary>Envío y devoluciones</summary>
              <p>Envío gratuito en pedidos superiores a {formatPrice(commerce.freeShippingThreshold)}. Recogida en tienda sin gastos. Puedes desistir de la compra en {commerce.withdrawalDays} días naturales desde la recepción.</p>
              <p>
                <Link to="/envios">Más información sobre envíos</Link>
              </p>
            </details>
            <details>
              <summary>Origen de los datos de esta ficha</summary>
              <DataSourceInfo product={product} />
            </details>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section" aria-labelledby="related-title">
          <SectionHead title="También te puede gustar" id="related-title" to={category ? `/categoria/${category.slug}` : undefined} linkLabel={category ? `Más en ${category.shortName ?? category.name}` : undefined} />
          <ProductRail products={related} label="Productos relacionados" />
        </section>
      )}

      <div className={`sticky-buy ${showSticky ? "is-visible" : ""}`} aria-hidden={!showSticky}>
        <div>
          <span className="sticky-buy__name">{product.name}</span>
          <strong>{formatPrice(price)}</strong>
        </div>
        <button type="button" className="btn btn--primary" onClick={onAdd} disabled={!purchasable} tabIndex={showSticky ? 0 : -1}>
          {cta}
        </button>
      </div>
    </div>
  );
}

function Gallery({ product }: { product: Product }) {
  const [current, setCurrent] = useState(0);
  const photos = product.images.filter((i) => i.src);
  return (
    <div className={`gallery ${photos.length > 1 ? "" : "gallery--single"}`}>
      <div className="gallery__main">
        <ProductMedia product={product} index={current} eager caption sizes="(min-width: 768px) 50vw, 100vw" />
      </div>
      {photos.length > 1 && (
        <div className="gallery__thumbs" role="group" aria-label="Imágenes del producto">
          {photos.map((p, i) => (
            <button key={p.src} type="button" className={`gallery__thumb ${i === current ? "is-active" : ""}`} aria-pressed={i === current} aria-label={p.alt} onClick={() => setCurrent(i)}>
              <ProductMedia product={product} index={i} sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SourceChip({ product }: { product: Product }) {
  if (product.source.name === "demo") return <span className="source-chip source-chip--demo">Producto de demostración</span>;
  return (
    <span className="source-chip" title={product.source.price === "observed" ? "Nombre y precio vistos en la web actual (oct. 2026)" : "Nombre visto en la web actual; precio de demostración"}>
      {product.source.price === "observed" ? "Precio observado en la web actual" : "Precio de demostración"}
    </span>
  );
}

function DataSourceInfo({ product }: { product: Product }) {
  const s = product.source;
  const label = { observed: "observado en la web pública de CartoonCorp", demo: "dato de demostración" };
  return (
    <div className="source">
      <ul>
        <li>Nombre: {label[s.name]}</li>
        <li>Precio: {label[s.price]}</li>
        <li>Disponibilidad: {label[s.availability]}</li>
        <li>Imagen: {product.images[0]?.src ? `fotografía oficial${product.images[0].credit ? ` (© ${product.images[0].credit})` : ""}` : "pendiente (sin foto verificada)"}</li>
      </ul>
      {product.releaseNote && <p>{product.releaseNote}</p>}
      {s.url && (
        <p>
          <a href={s.url} target="_blank" rel="noopener noreferrer">
            Ver la ficha en la web actual <Icon name="external" />
          </a>
        </p>
      )}
    </div>
  );
}
