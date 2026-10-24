import { Link, useLocation, useParams } from "react-router";
import { Icon } from "../components/Icon";
import { EmptyState } from "../components/ui";
import { usePageMeta } from "../hooks/usePageMeta";
import { formatPrice } from "../lib/format";
import { getOrder, type DemoOrder } from "../services/orders";

export default function OrderPage() {
  usePageMeta("Pedido de demostración", undefined, undefined, { noindex: true });
  const { id = "" } = useParams();
  const location = useLocation();
  const order = (location.state as { order?: DemoOrder } | null)?.order?.id === id ? (location.state as { order: DemoOrder }).order : getOrder(id);

  if (!order) {
    return (
      <div className="container page">
        <EmptyState as="h1" icon="alert" title="No encontramos este pedido de prueba" action={<Link to="/cuenta" className="btn btn--primary">Ir a mi cuenta</Link>}>
          Los pedidos de la demo sólo se guardan en el navegador donde se hicieron.
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container page order">
      <div className="order__hero">
        <span className="order__check"><Icon name="check" /></span>
        <p className="eyebrow">Simulación completada</p>
        <h1 className="page-title">¡Gracias, {order.name.split(" ")[0]}!</h1>
        <p>
          Este es un <strong>pedido de demostración</strong> ({order.id}). No se ha realizado ningún cargo, no se ha enviado ningún email y CartoonCorp no ha recibido ningún pedido.
        </p>
      </div>

      <div className="order__grid">
        <section className="summary" aria-labelledby="order-lines">
          <h2 id="order-lines" className="summary__title">Resumen</h2>
          <ul className="order__lines">
            {order.lines.map((l, i) => (
              <li key={i}>
                <span>
                  {l.qty} × {l.name}
                  {l.options.length > 0 && <small> ({l.options.join(", ")})</small>}
                </span>
                <span>{formatPrice(l.unitPrice * l.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="sum-row"><span>Subtotal</span><span>{formatPrice(order.totals.subtotal)}</span></div>
          <div className="sum-row"><span>Envío</span><span>{order.totals.shipping === 0 ? "Gratis" : formatPrice(order.totals.shipping)}</span></div>
          <div className="sum-row sum-row--total"><span>Total</span><strong>{formatPrice(order.totals.total)}</strong></div>
        </section>
        <section className="summary" aria-labelledby="order-next">
          <h2 id="order-next" className="summary__title">En la tienda real…</h2>
          <ol className="steps steps--compact">
            <li><strong>Confirmación por email</strong><span>a {order.email}</span></li>
            <li><strong>Preparación del pedido</strong><span>{order.shippingMethod === "pickup" ? "Aviso cuando esté listo para recoger" : "Envío con número de seguimiento"}</span></li>
            <li><strong>Entrega</strong><span>{order.address}</span></li>
          </ol>
          <p className="muted small">Pago elegido: {order.paymentMethod}</p>
          <div className="order__ctas">
            <Link to="/" className="btn btn--primary">Seguir explorando</Link>
            <Link to="/cuenta" className="btn btn--ghost">Ver mis pedidos de prueba</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
