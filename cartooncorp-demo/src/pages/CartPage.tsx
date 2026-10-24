import { Link } from "react-router";
import { CartLines, FreeShippingMeter } from "../components/CartDrawer";
import { Icon } from "../components/Icon";
import { ProductRail } from "../components/ProductCard";
import { Breadcrumbs, EmptyState, SectionHead } from "../components/ui";
import { commerce } from "../data/store";
import { usePageMeta } from "../hooks/usePageMeta";
import { formatPrice, plural } from "../lib/format";
import { getFeatured } from "../services/catalog";
import { useCart } from "../state/CartContext";

export function CartPage() {
  usePageMeta("Carrito", "Revisa los productos de tu carrito.");
  const { lines, totals, clear } = useCart();
  const inCart = new Set(lines.map((l) => l.productId));
  const suggestions = getFeatured(12).filter((p) => !inCart.has(p.id)).slice(0, 4);
  const standard = commerce.shippingMethods.find((m) => m.id === "standard")!;

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: "Carrito" }]} />
      <h1 className="page-title">Tu carrito</h1>

      {lines.length === 0 ? (
        <EmptyState icon="cart" title="Tu carrito está vacío" action={<Link to="/novedades" className="btn btn--primary">Ver novedades</Link>}>
          Cuando añadas productos aparecerán aquí. El carrito se guarda en este navegador.
        </EmptyState>
      ) : (
        <div className="cart-layout">
          <section aria-label="Productos en el carrito">
            <FreeShippingMeter remaining={totals.freeShippingRemaining} qualifies={totals.qualifiesForFreeShipping} subtotal={totals.subtotal} />
            <CartLines />
            <div className="cart-actions">
              <Link to="/tienda" className="link-arrow link-arrow--back">
                <Icon name="chevron-left" /> Seguir comprando
              </Link>
              <button type="button" className="btn-text" onClick={clear}>
                Vaciar carrito
              </button>
            </div>
          </section>

          <aside className="summary" aria-labelledby="summary-title">
            <h2 id="summary-title" className="summary__title">Resumen</h2>
            <div className="sum-row">
              <span>Subtotal ({plural(totals.itemCount, "artículo", "artículos")})</span>
              <span>{formatPrice(totals.subtotal)}</span>
            </div>
            <div className="sum-row">
              <span>Envío a domicilio</span>
              <span>{totals.qualifiesForFreeShipping ? "Gratis" : formatPrice(standard.price)}</span>
            </div>
            <div className="sum-row">
              <span>Recogida en tienda</span>
              <span>Gratis</span>
            </div>
            <div className="sum-row sum-row--total">
              <span>Total estimado</span>
              <strong>{formatPrice(totals.total)}</strong>
            </div>
            <p className="muted small">IVA incluido. El método de entrega se elige en el siguiente paso. Tarifa de envío de demostración.</p>
            <Link to="/checkout" className="btn btn--primary btn--block btn--lg">
              <Icon name="lock" /> Tramitar pedido
            </Link>
          </aside>
        </div>
      )}

      {suggestions.length > 0 && (
        <section className="section" aria-labelledby="sugg-title">
          <SectionHead title="Completa tu pedido" id="sugg-title" />
          <ProductRail products={suggestions} label="Sugerencias" />
        </section>
      )}
    </div>
  );
}
