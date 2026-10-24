import { Link } from "react-router";
import { commerce } from "../data/store";
import { formatPrice, plural } from "../lib/format";
import { useCart } from "../state/CartContext";
import { Drawer } from "./Drawer";
import { Icon } from "./Icon";
import { ProductMedia } from "./ProductMedia";
import { EmptyState, QuantityStepper } from "./ui";

export function FreeShippingMeter({ remaining, qualifies, subtotal }: { remaining: number; qualifies: boolean; subtotal: number }) {
  const pct = Math.min(100, (subtotal / commerce.freeShippingThreshold) * 100);
  return (
    <div className="ship-meter">
      <p>
        {qualifies ? (
          <>
            <Icon name="check" /> <strong>¡Tienes el envío gratis!</strong>
          </>
        ) : (
          <>
            Te faltan <strong>{formatPrice(remaining)}</strong> para el envío gratis
          </>
        )}
      </p>
      <div
        className="ship-meter__bar"
        role="progressbar"
        aria-label="Progreso hacia el envío gratis"
        aria-valuemin={0}
        aria-valuemax={commerce.freeShippingThreshold}
        aria-valuenow={Math.min(subtotal, commerce.freeShippingThreshold)}
      >
        <span style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function CartLines({ compact = false }: { compact?: boolean }) {
  const { lines, setQty, remove, closeDrawer } = useCart();
  return (
    <ul className={`lines ${compact ? "lines--compact" : ""}`}>
      {lines.map((l) => (
        <li key={l.key} className="line">
          <Link to={`/producto/${l.product.slug}`} className="line__media" onClick={closeDrawer} tabIndex={-1} aria-hidden="true">
            <ProductMedia product={l.product} sizes="90px" />
          </Link>
          <div className="line__info">
            <Link to={`/producto/${l.product.slug}`} className="line__name" onClick={closeDrawer}>
              {l.product.name}
            </Link>
            {l.product.source.name === "demo" && <span className="flag flag--demo flag--inline">Producto demo</span>}
            {l.optionLabels.length > 0 && <p className="line__opts">{l.optionLabels.join(" · ")}</p>}
            {l.availability === "preorder" && <p className="line__pre">Reserva · se envía cuando llegue a tienda</p>}
            <p className="line__unit">{formatPrice(l.unitPrice)} / ud.</p>
            <div className="line__controls">
              <QuantityStepper value={l.qty} onChange={(v) => setQty(l.key, v)} label={`Cantidad de ${l.product.name}`} />
              <button type="button" className="btn-text" onClick={() => remove(l.key)}>
                <Icon name="trash" /> Eliminar
              </button>
            </div>
          </div>
          <p className="line__total">{formatPrice(l.lineTotal)}</p>
        </li>
      ))}
    </ul>
  );
}

export function CartDrawer() {
  const { lines, totals, drawerOpen, closeDrawer } = useCart();
  return (
    <Drawer
      open={drawerOpen}
      onClose={closeDrawer}
      labelledBy="cart-title"
      title={
        <>
          Tu carrito <span className="muted">({plural(totals.itemCount, "artículo", "artículos")})</span>
        </>
      }
      footer={
        lines.length > 0 && (
          <>
            <div className="sum-row sum-row--total">
              <span>Subtotal</span>
              <strong>{formatPrice(totals.subtotal)}</strong>
            </div>
            <p className="muted small">IVA incluido. Gastos de envío calculados en el checkout.</p>
            <Link to="/checkout" className="btn btn--primary btn--block" onClick={closeDrawer}>
              <Icon name="lock" /> Tramitar pedido
            </Link>
            <Link to="/carrito" className="btn btn--ghost btn--block" onClick={closeDrawer}>
              Ver carrito completo
            </Link>
          </>
        )
      }
    >
      {lines.length === 0 ? (
        <EmptyState icon="cart" title="Tu carrito está vacío" action={<Link to="/novedades" className="btn btn--primary" onClick={closeDrawer}>Descubrir novedades</Link>}>
          Explora el catálogo y añade lo que más te guste.
        </EmptyState>
      ) : (
        <>
          <FreeShippingMeter remaining={totals.freeShippingRemaining} qualifies={totals.qualifiesForFreeShipping} subtotal={totals.subtotal} />
          <CartLines compact />
        </>
      )}
    </Drawer>
  );
}
