import { useState, type KeyboardEvent, type MouseEvent } from "react";
import { Link } from "react-router";
import { Icon, type IconName } from "../components/Icon";
import { hasPhoto, ProductMedia } from "../components/ProductMedia";
import { ProductGrid } from "../components/ProductCard";
import { Price, SectionHead } from "../components/ui";
import { articles } from "../data/articles";
import { getCategory, topCategories } from "../data/categories";
import { commerce, store } from "../data/store";
import { usePageMeta } from "../hooks/usePageMeta";
import { formatPrice } from "../lib/format";
import { getFeatured, getPreorders, getProductById, queryCatalog } from "../services/catalog";
import type { Product } from "../data/types";

/** Vitrina del hero: sólo productos con foto real verificada (la caja de Zoro, en el centro). */
const HERO_PREFERENCE = ["33562", "40921", "44311"];

const SECTION_ICON: Record<string, IconName> = { manga: "box", figuras: "spark", cartas: "cards", preventas: "calendar" };

const FEATURED_SECTIONS: { slug: string; title?: string; description?: string; hue?: number }[] = [
  { slug: "manga" },
  { slug: "figuras" },
  { slug: "cartas" },
  { slug: "preventas", title: "Pre-pedidos", description: "Reserva lo próximo antes de que llegue a tienda.", hue: 252 },
];

const TABS: { id: string; label: string; category?: string }[] = [
  { id: "todo", label: "Todo" },
  { id: "manga", label: "Manga", category: "manga" },
  { id: "figuras", label: "Figuras", category: "figuras" },
  { id: "cartas", label: "Cartas", category: "cartas" },
  { id: "gunpla", label: "Gunpla", category: "gunpla" },
];

export function HomePage() {
  usePageMeta("", undefined, {
    "@context": "https://schema.org",
    "@type": "Store",
    name: store.name,
    address: { "@type": "PostalAddress", streetAddress: store.address.street, postalCode: store.address.postalCode, addressLocality: store.address.city, addressCountry: "ES" },
    telephone: "+34963288385",
  });
  const withPhoto = HERO_PREFERENCE.map((id) => getProductById(id)).filter((p): p is Product => !!p && hasPhoto(p));
  const [main, back, front] = withPhoto.length === 3 ? [withPhoto[0], withPhoto[1], withPhoto[2]] : [undefined, undefined, undefined];
  const featured = getFeatured(20).filter((p) => p.source.name !== "demo").sort((a, b) => Number(hasPhoto(b)) - Number(hasPhoto(a))).slice(0, 4);
  const preorders = getPreorders(2);
  const preorderTotal = queryCatalog({ availability: ["preorder"] }).total;

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__inner">
          <div className="hero__copy">
            <p className="hero__eyebrow">
              <span className="hanko">53</span> Guillem de Castro · Valencia
            </p>
            <h1 id="hero-title" className="hero__title">
              Colecciona <em>lo que</em> te mueve.
            </h1>
            <p className="hero__lead">
              Manga, figuras, Funko Pop!, Magic: The Gathering y Gunpla. Elige online y recíbelo en casa, o recógelo gratis en nuestra tienda de Valencia.
            </p>
            <div className="hero__ctas">
              <Link to="/novedades" className="btn btn--primary btn--lg">
                Explorar novedades <Icon name="arrow-right" />
              </Link>
              <a href="#categorias" className="btn btn--outline-light btn--lg" onClick={scrollToCategories}>
                Descubrir categorías
              </a>
            </div>
          </div>

          {main && back && front && (
            <div className="stage" aria-label="Productos destacados">
              <span className="stage__glow" aria-hidden="true" />
              <StageItem product={back} className="stage__item--back" />
              <StageItem product={main} className="stage__item--main" />
              <StageItem product={front} className="stage__item--front" />
              <span className="stage__floor" aria-hidden="true" />
            </div>
          )}
        </div>
      </section>

      <TrustStrip />

      <section className="container section" id="categorias" aria-labelledby="cats-title" tabIndex={-1}>
        <SectionHead eyebrow="Explora" title="¿Qué coleccionas?" id="cats-title" to="/tienda" linkLabel="Todo el catálogo" />
        <ul className="cat-tiles">
          {FEATURED_SECTIONS.map((sec) => {
            const { items, total } = sec.slug === "preventas" ? queryCatalog({ availability: ["preorder"], pageSize: 50 }) : queryCatalog({ category: sec.slug, sort: "newest", pageSize: 50 });
            const cover = items.find(hasPhoto);
            const cat = getCategory(sec.slug);
            const to = sec.slug === "preventas" ? "/preventas" : `/categoria/${sec.slug}`;
            return (
              <li key={sec.slug}>
                <Link to={to} className="cat-tile" style={{ ["--hue" as string]: sec.hue ?? cat?.hue }}>
                  <span className={`cat-tile__art ${cover ? "" : "cat-tile__art--icon"}`} aria-hidden="true">
                    {cover ? <ProductMedia product={cover} sizes="(min-width: 768px) 25vw, 50vw" /> : <Icon name={SECTION_ICON[sec.slug] ?? "grid"} />}
                  </span>
                  <span className="cat-tile__text">
                    <span className="cat-tile__name">{sec.title ?? cat?.name}</span>
                    <span className="cat-tile__desc">{sec.description ?? cat?.description}</span>
                    <span className="cat-tile__count">
                      {total} {total === 1 ? "producto" : "productos"} <Icon name="arrow-right" />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <nav className="more-cats" aria-label="Más secciones">
          <span className="more-cats__label">También:</span>
          {topCategories
            .filter((c) => !FEATURED_SECTIONS.some((f) => f.slug === c.slug))
            .map((c) => (
              <Link key={c.slug} to={`/categoria/${c.slug}`} className="chip">
                {c.name} <span className="chip__count">{queryCatalog({ category: c.slug }).total}</span>
              </Link>
            ))}
          <Link to="/ofertas" className="chip chip--sale">
            Ofertas <span className="chip__count">{queryCatalog({ onSale: true }).total}</span>
          </Link>
        </nav>
      </section>

      {featured.length > 0 && (
        <section className="container section section--flush-top" aria-labelledby="feat-title">
          <SectionHead eyebrow="Selección de la tienda" title="Destacados" id="feat-title" to="/tienda" linkLabel="Ver catálogo" />
          <ProductGrid products={featured} />
        </section>
      )}

      <NewArrivals />

      <section className="container section" aria-labelledby="pre-title">
        <div className="preorder">
          <div className="preorder__copy">
            <p className="eyebrow">Pre-pedidos</p>
            <h2 id="pre-title" className="section-title">Resérvalo antes de que salga</h2>
            <ol className="steps">
              <li><strong>Reserva online</strong><span>Añade el producto en pre-pedido a tu carrito.</span></li>
              <li><strong>Te avisamos</strong><span>Cuando llega a tienda, preparamos tu pedido.</span></li>
              <li><strong>Envío o recogida</strong><span>En casa o en Guillem de Castro, 53.</span></li>
            </ol>
            <p className="muted small">Flujo de reserva propuesto: las condiciones (pago, señal, plazos) las define CartoonCorp. Hay {preorderTotal} productos en pre-pedido en la demo.</p>
            <Link to="/preventas" className="link-arrow">Ver pre-pedidos <Icon name="arrow-right" /></Link>
          </div>
          <ProductGrid products={preorders} />
        </div>
      </section>

      <section className="section section--ink" aria-labelledby="store-title">
        <div className="container store-band">
          <div className="store-band__map" aria-hidden="true">
            <svg viewBox="0 0 400 260">
              <rect width="400" height="260" fill="#221c19" />
              <path d="M-10 190 C 80 160, 140 210, 230 150 S 360 110, 420 130" stroke="#3a312c" strokeWidth="26" fill="none" />
              <path d="M150 -10 L 210 270" stroke="#3a312c" strokeWidth="18" />
              <path d="M40 -10 L 330 270" stroke="#2e2622" strokeWidth="10" />
              <path d="M-10 70 L 410 40" stroke="#2e2622" strokeWidth="8" />
              <circle cx="182" cy="128" r="34" fill="var(--brand)" opacity=".2" />
              <circle cx="182" cy="128" r="12" fill="var(--brand)" />
              <circle cx="182" cy="128" r="4.5" fill="#fff" />
            </svg>
          </div>
          <div className="store-band__copy">
            <p className="eyebrow eyebrow--light">La tienda</p>
            <h2 id="store-title" className="section-title section-title--light">Ven a vernos a Valencia</h2>
            <p>
              {store.address.street}, {store.address.postalCode} {store.address.city}. Recoge tus pedidos sin gastos de envío y únete a las partidas de la comunidad (Commander casual y más).
            </p>
            <div className="store-band__ctas">
              <Link to="/tienda-fisica" className="btn btn--light">Cómo llegar y horarios</Link>
              <a href={store.phone.href} className="btn btn--outline-light"><Icon name="phone" /> {store.phone.display}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="container section" aria-labelledby="blog-title">
        <SectionHead eyebrow="Guías y noticias" title="Desde el mostrador" id="blog-title" to="/noticias" />
        <ul className="articles">
          {articles.map((a) => (
            <li key={a.slug}>
              <Link to={`/noticias/${a.slug}`} className="article-card" style={{ ["--hue" as string]: a.hue }}>
                <span className="article-card__cat">{a.category}</span>
                <span className="article-card__title">{a.title}</span>
                <span className="article-card__excerpt">{a.excerpt}</span>
                <span className="link-arrow">Leer <Icon name="arrow-right" /></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function scrollToCategories(e: MouseEvent<HTMLAnchorElement>) {
  // Ancla interna: desplaza y mueve el foco sin cambiar de ruta.
  e.preventDefault();
  const el = document.getElementById("categorias");
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  el.focus({ preventScroll: true });
}

/** Producto de la vitrina del hero: objeto sin fondo y etiqueta con nombre y precio. */
function StageItem({ product, className }: { product: Product; className: string }) {
  return (
    <Link to={`/producto/${product.slug}`} className={`stage__item ${className}`}>
      <span className="stage__art">
        <ProductMedia product={product} eager sizes="(min-width: 1024px) 28vw, 50vw" />
      </span>
      <span className="stage__tag">
        <span className="stage__name">{product.name}</span>
        <Price product={product} size="sm" />
      </span>
    </Link>
  );
}

/** Novedades con filtro por sección (pestañas accesibles con flechas). */
function NewArrivals() {
  const [tab, setTab] = useState(TABS[0].id);
  const current = TABS.find((d) => d.id === tab)!;
  const items = queryCatalog({ category: current.category, sort: "newest", pageSize: 8, availability: ["in_stock", "preorder"] }).items;

  const onKey = (e: KeyboardEvent, index: number) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = TABS[(index + dir + TABS.length) % TABS.length];
    setTab(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  };

  return (
    <section className="section section--tint" aria-labelledby="new-title">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Recién llegado</p>
            <h2 className="section-title" id="new-title">Novedades</h2>
          </div>
          <div role="tablist" aria-label="Filtrar novedades" className="tabs">
            {TABS.map((d, i) => (
              <button
                key={d.id}
                id={`tab-${d.id}`}
                role="tab"
                type="button"
                aria-selected={tab === d.id}
                aria-controls="new-panel"
                tabIndex={tab === d.id ? 0 : -1}
                className="tab"
                onClick={() => setTab(d.id)}
                onKeyDown={(e) => onKey(e, i)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
        <div id="new-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="new-grid">
          <ProductGrid products={items} />
        </div>
        <p className="center">
          <Link to={current.category ? `/categoria/${current.category}` : "/novedades"} className="btn btn--ghost">
            {current.category ? `Ver todo en ${current.label}` : "Ver todas las novedades"} <Icon name="arrow-right" />
          </Link>
        </p>
      </div>
    </section>
  );
}

export function TrustStrip() {
  const items: { icon: IconName; title: string; text: string }[] = [
    { icon: "truck", title: `Envío gratis desde ${formatPrice(commerce.freeShippingThreshold)}`, text: "En pedidos a domicilio." },
    { icon: "store", title: "Recogida gratis en tienda", text: "Guillem de Castro, 53 · Valencia." },
    { icon: "shield", title: "Producto oficial", text: "Editoriales y fabricantes licenciados." },
    { icon: "phone", title: "Te atendemos de verdad", text: `En tienda o al ${store.phone.display}.` },
  ];
  return (
    <section className="container trust" aria-label="Ventajas de comprar en CartoonCorp">
      <ul>
        {items.map((i) => (
          <li key={i.title}>
            <Icon name={i.icon} />
            <div>
              <strong>{i.title}</strong>
              <span>{i.text}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
