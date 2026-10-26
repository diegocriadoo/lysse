import { Link } from "react-router";
import { Icon, type IconName } from "../components/Icon";
import { ProductMedia, hasPhoto } from "../components/ProductMedia";
import { products } from "../data/products";
import { usePageMeta } from "../hooks/usePageMeta";
import { getProductById } from "../services/catalog";

/**
 * Página de presentación de la propuesta para el propietario de CartoonCorp:
 * qué se detectó en la web actual, qué cambia, un recorrido guiado y qué falta.
 * Las cifras se calculan a partir de los datos de la demo.
 */
const FINDINGS: { title: string; text: string }[] = [
  { title: "Dos webs con el mismo catálogo", text: "cartooncorp.net y cartooncorp.es muestran los mismos productos: confunde al cliente y reparte el posicionamiento en Google." },
  { title: "Categorías repetidas", text: "Hay secciones duplicadas con nombres distintos (por ejemplo, dos para Magic y dos para figuras), lo que complica encontrar las cosas." },
  { title: "Fichas incoherentes", text: "Algunos productos dicen una cosa en el título y otra en la dirección (una caja de Magic «English» con URL «castellano»)." },
  { title: "Información que no cuadra", text: "El plazo de devolución aparece como 7 días en una web y 14 en otra; horario y email varían según dónde se mire." },
  { title: "Filtros indexados", text: "Las combinaciones de filtros generan muchas URLs largas que Google indexa como páginas duplicadas." },
];

const CHANGES: { icon: IconName; title: string; text: string; to: string; cta: string }[] = [
  { icon: "search", title: "Buscador que entiende", text: "Sugerencias con foto y precio mientras escribes, sin importar tildes ni mayúsculas.", to: "/buscar?q=dragon", cta: "Buscar «dragon»" },
  { icon: "filter", title: "Catálogo fácil de filtrar", text: "Filtros por licencia, editorial, precio y disponibilidad, con orden y paginación. Cada filtro tiene su propia URL compartible.", to: "/categoria/manga", cta: "Ver Manga" },
  { icon: "box", title: "Fichas que venden", text: "Galería, precio y ahorro claros, características clave a la vista, envío y recogida, y productos relacionados.", to: "/producto/funko-pop-roronoa-zoro-327-one-piece-33562", cta: "Abrir una ficha" },
  { icon: "calendar", title: "Pre-pedidos explicados", text: "Sección propia y botón «Reservar»: el cliente entiende qué compra y cuándo le llega.", to: "/preventas", cta: "Ver pre-pedidos" },
  { icon: "cart", title: "Carrito sin sorpresas", text: "Barra de envío gratis desde 60 €, cambio de cantidades al momento y recogida gratis en Guillem de Castro.", to: "/carrito", cta: "Ver el carrito" },
  { icon: "store", title: "La tienda física, protagonista", text: "Dirección, recogida en tienda y comunidad de juego integrados en toda la web.", to: "/tienda-fisica", cta: "Ver la tienda" },
];

const TOUR: { title: string; text: string; to: string }[] = [
  { title: "Portada", text: "Primera impresión: novedades, secciones y la tienda de Valencia.", to: "/" },
  { title: "Busca «Chainsaw»", text: "Las sugerencias aparecen mientras escribes.", to: "/buscar?q=chainsaw" },
  { title: "Filtra Manga por editorial", text: "Marca «Norma Editorial» y ordena por precio.", to: "/categoria/manga" },
  { title: "Añade un producto", text: "El carrito se abre y calcula el envío gratis.", to: "/producto/chainsaw-man-17-38490" },
  { title: "Termina un pedido de prueba", text: "Checkout en tres pasos, sin cobros ni pedidos reales.", to: "/checkout" },
];

const NEXT: { title: string; text: string }[] = [
  { title: "Validar el diseño", text: "Revisar juntos identidad, secciones y textos, y ajustar lo que haga falta." },
  { title: "Conectar el catálogo real", text: "Exportar productos, precios y stock desde la tienda actual (PrestaShop) o migrar de plataforma." },
  { title: "Fotos y contenidos", text: "Incorporar las fotos de producto y los textos legales, envíos y horarios oficiales." },
  { title: "Pagos y envíos", text: "Configurar la pasarela de pago, las tarifas y la gestión de reservas." },
  { title: "Lanzamiento", text: "Redirecciones desde las URLs actuales para no perder posicionamiento, y salida a producción." },
];

export default function ProposalPage() {
  usePageMeta("Propuesta de rediseño", "Qué cambia con el rediseño de la tienda online de CartoonCorp y cómo recorrer la demo.");
  const real = products.filter((p) => p.source.name !== "demo");
  const withPhoto = real.filter(hasPhoto).length;
  const showcase = ["38490", "33562", "20513", "35900"].map(getProductById).filter((p) => p && hasPhoto(p));

  return (
    <div className="proposal">
      <section className="proposal__hero">
        <div className="container proposal__hero-inner">
          <div>
            <p className="hero__eyebrow">
              <span className="hanko">53</span> Propuesta para CartoonCorp
            </p>
            <h1 className="proposal__title">
              Una tienda online a la altura de <em>lo que vendéis</em>.
            </h1>
            <p className="hero__lead">
              Rediseño completo de la tienda: más fácil de recorrer, más clara al comprar y con la tienda de Valencia en el centro. Esta demo funciona de verdad: puedes buscar, filtrar, llenar el carrito y completar un pedido de prueba.
            </p>
            <div className="hero__ctas">
              <Link to="/" className="btn btn--primary btn--lg">
                Empezar el recorrido <Icon name="arrow-right" />
              </Link>
              <a href="#recorrido" className="btn btn--outline-light btn--lg">
                Guía de 2 minutos
              </a>
            </div>
          </div>
          <ul className="proposal__covers" aria-label="Productos de la demo">
            {showcase.map((p) => (
              <li key={p!.id}>
                <Link to={`/producto/${p!.slug}`}>
                  <ProductMedia product={p!} eager sizes="200px" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container section" aria-labelledby="prop-findings">
        <p className="eyebrow">Punto de partida</p>
        <h2 className="section-title" id="prop-findings">Lo que vimos en la web actual</h2>
        <ol className="proposal__findings">
          {FINDINGS.map((f) => (
            <li key={f.title}>
              <strong>{f.title}</strong>
              <span>{f.text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="section section--tint" aria-labelledby="prop-changes">
        <div className="container">
          <p className="eyebrow">La propuesta</p>
          <h2 className="section-title" id="prop-changes">Qué cambia</h2>
          <ul className="proposal__changes">
            {CHANGES.map((c) => (
              <li key={c.title}>
                <Icon name={c.icon} className="proposal__icon" />
                <h3>{c.title}</h3>
                <p>{c.text}</p>
                <Link to={c.to} className="link-arrow">
                  {c.cta} <Icon name="arrow-right" />
                </Link>
              </li>
            ))}
          </ul>
          <p className="muted small proposal__also">Además: diseño pensado primero para móvil, navegación completa con teclado, textos alternativos en las imágenes y páginas preparadas para buscadores.</p>
        </div>
      </section>

      <section className="container section" id="recorrido" aria-labelledby="prop-tour" tabIndex={-1}>
        <p className="eyebrow">Guía</p>
        <h2 className="section-title" id="prop-tour">Recórrela en 2 minutos</h2>
        <ol className="proposal__tour">
          {TOUR.map((t) => (
            <li key={t.title}>
              <Link to={t.to}>
                <strong>{t.title}</strong>
                <span>{t.text}</span>
                <Icon name="arrow-right" />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="section section--ink" aria-labelledby="prop-status">
        <div className="container proposal__status">
          <div>
            <p className="eyebrow eyebrow--light">Transparencia</p>
            <h2 className="section-title section-title--light" id="prop-status">Qué es real y qué falta</h2>
            <p>Es una demostración independiente: no está conectada a la tienda actual, no cobra y no genera pedidos.</p>
            <Link to="/sobre-la-demo" className="btn btn--light">Detalle de los datos</Link>
          </div>
          <dl className="proposal__facts">
            <div><dt>{real.length}</dt><dd>productos reales del catálogo de CartoonCorp</dd></div>
            <div><dt>{withPhoto}</dt><dd>con foto oficial de editorial o fabricante; el resto, pendiente</dd></div>
            <div><dt>{products.length - real.length}</dt><dd>productos de ejemplo, marcados como tales</dd></div>
            <div><dt>0 €</dt><dd>cobrados: el checkout es una simulación</dd></div>
          </dl>
        </div>
      </section>

      <section className="container section" aria-labelledby="prop-next">
        <p className="eyebrow">Siguientes pasos</p>
        <h2 className="section-title" id="prop-next">De la demo a la tienda</h2>
        <ol className="steps proposal__next">
          {NEXT.map((n) => (
            <li key={n.title}>
              <strong>{n.title}</strong>
              <span>{n.text}</span>
            </li>
          ))}
        </ol>
        <p className="center">
          <Link to="/" className="btn btn--primary btn--lg">
            Ver la tienda <Icon name="arrow-right" />
          </Link>
        </p>
      </section>
    </div>
  );
}
