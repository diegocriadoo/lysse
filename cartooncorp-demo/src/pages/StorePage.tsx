import { Link } from "react-router";
import { Icon } from "../components/Icon";
import { Breadcrumbs, DemoNote } from "../components/ui";
import { store } from "../data/store";
import { usePageMeta } from "../hooks/usePageMeta";

export default function StorePage() {
  usePageMeta("Tienda en Valencia", `Visítanos en ${store.address.street}, ${store.address.city}. Recogida de pedidos y comunidad de juego.`);
  const mapsUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${store.address.street}, ${store.address.postalCode} ${store.address.city}`)}`;
  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: "Tienda en Valencia" }]} />
      <div className="store-page">
        <div>
          <p className="eyebrow">Tienda física</p>
          <h1 className="page-title">CartoonCorp Valencia</h1>
          <p className="lead">Manga, figuras, cartas y modelismo en el centro de Valencia. Ven a recoger tus pedidos o a jugar con la comunidad.</p>
          <ul className="contact__list">
            <li><Icon name="pin" /><div><strong>Dirección</strong><span>{store.address.street}<br />{store.address.postalCode} {store.address.city}</span><a href={mapsUrl} target="_blank" rel="noopener noreferrer">Abrir en el mapa <Icon name="external" /></a></div></li>
            <li><Icon name="phone" /><div><strong>Teléfono</strong><a href={store.phone.href}>{store.phone.display}</a></div></li>
            <li>
              <Icon name="clock" />
              <div>
                <strong>Horario</strong>
                {store.hours ? store.hours.map((h) => <span key={h.days}>{h.days}: {h.time}</span>) : <span>Pendiente de confirmar con la tienda.</span>}
              </div>
            </li>
          </ul>
          <DemoNote tone="warn">Las fuentes públicas consultadas dan horarios distintos, por eso no se muestran. Este bloque está preparado para cargar el horario oficial.</DemoNote>
        </div>
        <div className="store-page__panels">
          <div className="card-panel">
            <Icon name="store" className="big-icon" />
            <h2 className="section-title section-title--sm">Recogida en tienda</h2>
            <p>Elige «Recogida en tienda» en el checkout y llévate tu pedido sin gastos de envío.</p>
            <Link to="/envios" className="link-arrow">Envíos y recogida <Icon name="arrow-right" /></Link>
          </div>
          <div className="card-panel">
            <Icon name="cards" className="big-icon" />
            <h2 className="section-title section-title--sm">Juega en la tienda</h2>
            <p>La tienda organiza partidas y torneos (por ejemplo, Commander casual). Aquí podría integrarse un calendario de eventos con inscripción.</p>
            <a href={store.social[0].href} target="_blank" rel="noopener noreferrer" className="link-arrow">Novedades en Bluesky <Icon name="external" /></a>
          </div>
        </div>
      </div>
    </div>
  );
}
