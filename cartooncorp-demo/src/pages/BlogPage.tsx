import { Link } from "react-router";
import { Icon } from "../components/Icon";
import { Breadcrumbs, DemoNote } from "../components/ui";
import { articles } from "../data/articles";
import { store } from "../data/store";
import { usePageMeta } from "../hooks/usePageMeta";

export default function BlogPage() {
  usePageMeta("Noticias y guías", "Guías de compra, novedades y contenido de la comunidad.");
  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: "Noticias" }]} />
      <p className="eyebrow">Desde el mostrador</p>
      <h1 className="page-title">Noticias y guías</h1>
      <DemoNote>
        Artículos de ejemplo para mostrar el formato. CartoonCorp ya tiene un blog en{" "}
        <a href={store.blogUrl} target="_blank" rel="noopener noreferrer">noticias.cartooncorp.net</a>; su contenido podría integrarse aquí.
      </DemoNote>
      <ul className="articles articles--page">
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
    </div>
  );
}
