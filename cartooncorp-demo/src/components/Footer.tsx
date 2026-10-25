import { useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router";
import { topCategories } from "../data/categories";
import { store } from "../data/store";
import { email as emailRule } from "../services/validation";
import { useToast } from "../state/ToastContext";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

export function Footer() {
  // En el checkout y la confirmación no se distrae con la suscripción.
  const { pathname } = useLocation();
  const inCheckout = pathname.startsWith("/checkout") || pathname.startsWith("/pedido/");
  return (
    <footer className="footer">
      {!inCheckout && <Newsletter />}
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo inverted />
          <p>Manga, figuras, Funko, cartas y modelismo. Tienda física en Valencia y envíos a toda España.</p>
          <address>
            <p><Icon name="pin" /> {store.address.street}, {store.address.postalCode} {store.address.city}</p>
            <p><Icon name="phone" /> <a href={store.phone.href}>{store.phone.display}</a></p>
          </address>
        </div>
        <nav aria-label="Tienda" className="footer__col">
          <h2>Tienda</h2>
          <ul>
            {topCategories.map((c) => (
              <li key={c.slug}><Link to={`/categoria/${c.slug}`}>{c.name}</Link></li>
            ))}
            <li><Link to="/novedades">Novedades</Link></li>
            <li><Link to="/preventas">Pre-pedidos</Link></li>
            <li><Link to="/ofertas">Ofertas</Link></li>
          </ul>
        </nav>
        <nav aria-label="Ayuda" className="footer__col">
          <h2>Ayuda</h2>
          <ul>
            <li><Link to="/ayuda">Preguntas frecuentes</Link></li>
            <li><Link to="/envios">Envíos y recogida</Link></li>
            <li><Link to="/devoluciones">Devoluciones</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
            <li><Link to="/cuenta">Mi cuenta</Link></li>
          </ul>
        </nav>
        <nav aria-label="CartoonCorp" className="footer__col">
          <h2>CartoonCorp</h2>
          <ul>
            <li><Link to="/tienda-fisica">Tienda en Valencia</Link></li>
            <li><Link to="/noticias">Noticias</Link></li>
            <li><a href={store.blogUrl} target="_blank" rel="noopener noreferrer">Blog actual <Icon name="external" /></a></li>
            {store.social.map((s) => (
              <li key={s.href}><a href={s.href} target="_blank" rel="noopener noreferrer">{s.label} <Icon name="external" /></a></li>
            ))}
            <li><Link to="/sobre-la-demo">Sobre esta demo</Link></li>
          </ul>
        </nav>
      </div>
      <div className="container footer__legal">
        <p>
          © {new Date().getFullYear()} Propuesta de rediseño para CartoonCorp. Demostración sin pedidos ni pagos reales. Logotipo e imágenes provisionales.
        </p>
        <ul>
          <li><Link to="/legal/aviso-legal">Aviso legal</Link></li>
          <li><Link to="/legal/privacidad">Privacidad</Link></li>
          <li><Link to="/legal/cookies">Cookies</Link></li>
          <li><Link to="/legal/condiciones">Condiciones de venta</Link></li>
        </ul>
      </div>
    </footer>
  );
}

function Newsletter() {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string>();
  const toast = useToast();
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err = emailRule(value);
    setError(err);
    if (err) return;
    setValue("");
    toast.show({ tone: "success", title: "Suscripción simulada", message: "En la demo no se guarda ni se envía tu email." });
  };
  return (
    <section className="newsletter" aria-labelledby="nl-title">
      <div className="container newsletter__inner">
        <div>
          <h2 id="nl-title" className="newsletter__title">Que no se te escape ninguna preventa</h2>
          <p>Novedades de manga, nuevas colecciones de Magic y reservas de figuras, una vez por semana.</p>
        </div>
        <form className="newsletter__form" onSubmit={submit} noValidate>
          <label htmlFor="nl-email" className="sr-only">Email</label>
          <input
            id="nl-email"
            type="email" spellCheck={false}
            placeholder="tu@email.com"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "nl-error" : undefined}
            autoComplete="email"
          />
          <button type="submit" className="btn btn--primary">Suscribirme</button>
          {error && <p id="nl-error" className="newsletter__error" role="alert">{error}</p>}
        </form>
      </div>
    </section>
  );
}
