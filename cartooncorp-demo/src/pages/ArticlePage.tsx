import { useParams } from "react-router";
import { ProductRail } from "../components/ProductCard";
import { Breadcrumbs, DemoNote, SectionHead } from "../components/ui";
import { getArticle } from "../data/articles";
import { usePageMeta } from "../hooks/usePageMeta";
import { queryCatalog } from "../services/catalog";
import { NotFoundPage } from "./NotFoundPage";

export default function ArticlePage() {
  const { slug = "" } = useParams();
  const article = getArticle(slug);
  usePageMeta(article?.title ?? "No encontrado", article?.excerpt);
  if (!article) return <NotFoundPage what="artículo" />;
  const products = queryCatalog({ category: article.relatedCategory, pageSize: 4, availability: ["in_stock", "preorder"] }).items;
  return (
    <article className="container page" style={{ ["--hue" as string]: article.hue }}>
      <Breadcrumbs items={[{ label: "Noticias", to: "/noticias" }, { label: article.title }]} />
      <header className="article-head">
        <p className="eyebrow">{article.category}</p>
        <h1 className="page-title">{article.title}</h1>
        <p className="lead">{article.excerpt}</p>
      </header>
      <div className="prose narrow">
        {article.body.map((p, i) => <p key={i}>{p}</p>)}
        <DemoNote>Artículo de ejemplo escrito para la demo.</DemoNote>
      </div>
      {products.length > 0 && (
        <section className="section" aria-labelledby="art-products">
          <SectionHead title="Productos relacionados" id="art-products" to={`/categoria/${article.relatedCategory}`} />
          <ProductRail products={products} label="Productos relacionados" />
        </section>
      )}
    </article>
  );
}
