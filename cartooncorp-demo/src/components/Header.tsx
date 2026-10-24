import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { getChildren, topCategories } from "../data/categories";
import { commerce } from "../data/store";
import { formatPrice } from "../lib/format";
import { useAccount } from "../state/AccountContext";
import { useCart } from "../state/CartContext";
import { Drawer } from "./Drawer";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { SearchBox } from "./SearchBox";

const QUICK_LINKS = [
  { to: "/novedades", label: "Novedades" },
  { to: "/preventas", label: "Pre-pedidos" },
  { to: "/ofertas", label: "Ofertas" },
];

export function Header() {
  const { totals, openDrawer } = useCart();
  const { user } = useAccount();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  return (
    <header className="header">
      <div className="announce">
        <div className="container announce__inner">
          <span>
            <Icon name="truck" /> Envío gratis en pedidos desde {formatPrice(commerce.freeShippingThreshold)}
          </span>
          <span className="announce__hide-sm">
            <Icon name="store" /> Recogida gratis en tienda · Valencia
          </span>
          <Link to="/sobre-la-demo" className="announce__demo">
            Demo<span className="announce__long"> de rediseño · sin pedidos reales</span>
          </Link>
        </div>
      </div>

      <div className="container header__main">
        <button type="button" className="icon-btn header__burger" aria-label="Abrir menú" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
          <Icon name="menu" />
        </button>
        <Link to="/" className="header__logo" aria-label="CartoonCorp, ir al inicio">
          <Logo />
        </Link>
        <div className="header__search">
          <SearchBox />
        </div>
        <div className="header__actions">
          <button type="button" className="icon-btn header__search-btn" aria-label="Buscar" onClick={() => setSearchOpen(true)}>
            <Icon name="search" />
          </button>
          <Link to="/cuenta" className="icon-btn header__account" aria-label={user ? `Mi cuenta (${user.name})` : "Mi cuenta"}>
            <Icon name="user" />
            <span className="header__action-label">{user ? user.name.split(" ")[0] : "Cuenta"}</span>
          </Link>
          <button type="button" className="icon-btn header__cart" onClick={openDrawer} aria-label={`Carrito, ${totals.itemCount} ${totals.itemCount === 1 ? "artículo" : "artículos"}`}>
            <Icon name="cart" />
            <span className="header__action-label">{formatPrice(totals.subtotal)}</span>
            {totals.itemCount > 0 && (
              <span className="badge-count" aria-hidden="true">
                {totals.itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <CategoryBar />

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} side="left" title="Menú" labelledBy="mobile-menu-title">
        <MobileMenu />
      </Drawer>
      <Drawer open={searchOpen} onClose={() => setSearchOpen(false)} side="center" title="Buscar en la tienda" labelledBy="search-title">
        <SearchBox autoFocus onNavigate={() => setSearchOpen(false)} />
      </Drawer>
    </header>
  );
}

/** Barra de categorías de escritorio con menú desplegable accesible (clic, hover y teclado). */
function CategoryBar() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const nav = useRef<HTMLElement>(null);
  const hoverTimer = useRef<number>(undefined);
  const location = useLocation();

  useEffect(() => setOpenSlug(null), [location.pathname]);

  useEffect(() => {
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !nav.current?.contains(e.target as Node)) setOpenSlug(null);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, []);

  return (
    <nav ref={nav} className="catbar" aria-label="Categorías">
      <div className="container">
        <ul className="catbar__list">
          {topCategories.map((cat) => {
            const children = getChildren(cat.slug);
            const open = openSlug === cat.slug;
            return (
              <li
                key={cat.slug}
                className="catbar__item"
                onMouseEnter={() => {
                  window.clearTimeout(hoverTimer.current);
                  hoverTimer.current = window.setTimeout(() => setOpenSlug(cat.slug), 90);
                }}
                onMouseLeave={() => {
                  window.clearTimeout(hoverTimer.current);
                  hoverTimer.current = window.setTimeout(() => setOpenSlug((s) => (s === cat.slug ? null : s)), 160);
                }}
              >
                <NavLink to={`/categoria/${cat.slug}`} className="catbar__link">
                  {cat.shortName ?? cat.name}
                </NavLink>
                <button
                  type="button"
                  className="catbar__toggle"
                  aria-expanded={open}
                  aria-controls={`mega-${cat.slug}`}
                  aria-label={`Subcategorías de ${cat.name}`}
                  onClick={() => setOpenSlug(open ? null : cat.slug)}
                >
                  <Icon name="chevron-down" />
                </button>
                <div id={`mega-${cat.slug}`} className="mega" hidden={!open} style={{ ["--hue" as string]: cat.hue }}>
                  <div className="mega__intro">
                    <p className="eyebrow">{cat.name}</p>
                    <p>{cat.description}</p>
                    <Link to={`/categoria/${cat.slug}`} className="link-arrow">
                      Ver todo <Icon name="arrow-right" />
                    </Link>
                  </div>
                  <ul className="mega__links">
                    {children.map((c) => (
                      <li key={c.slug}>
                        <Link to={`/categoria/${c.slug}`}>
                          <strong>{c.name}</strong>
                          <span>{c.description}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
          {QUICK_LINKS.map((l) => (
            <li key={l.to} className="catbar__item catbar__item--quick">
              <NavLink to={l.to} className="catbar__link">
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function MobileMenu() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <nav aria-label="Menú principal" className="mmenu">
      <ul className="mmenu__quick">
        {QUICK_LINKS.map((l) => (
          <li key={l.to}>
            <Link to={l.to}>{l.label}</Link>
          </li>
        ))}
      </ul>
      <ul className="mmenu__list">
        {topCategories.map((cat) => {
          const open = expanded === cat.slug;
          return (
            <li key={cat.slug} style={{ ["--hue" as string]: cat.hue }}>
              <div className="mmenu__row">
                <Link to={`/categoria/${cat.slug}`} className="mmenu__cat">
                  <span className="mmenu__swatch" aria-hidden="true" />
                  {cat.name}
                </Link>
                <button type="button" className="icon-btn" aria-expanded={open} aria-controls={`mm-${cat.slug}`} aria-label={`Subcategorías de ${cat.name}`} onClick={() => setExpanded(open ? null : cat.slug)}>
                  <Icon name="chevron-down" className={open ? "rot180" : ""} />
                </button>
              </div>
              <ul id={`mm-${cat.slug}`} className="mmenu__sub" hidden={!open}>
                {getChildren(cat.slug).map((c) => (
                  <li key={c.slug}>
                    <Link to={`/categoria/${c.slug}`}>{c.name}</Link>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
      <ul className="mmenu__secondary">
        <li><Link to="/cuenta"><Icon name="user" /> Mi cuenta</Link></li>
        <li><Link to="/tienda-fisica"><Icon name="store" /> Tienda en Valencia</Link></li>
        <li><Link to="/envios"><Icon name="truck" /> Envíos</Link></li>
        <li><Link to="/ayuda"><Icon name="info" /> Ayuda</Link></li>
        <li><Link to="/contacto"><Icon name="mail" /> Contacto</Link></li>
      </ul>
    </nav>
  );
}
