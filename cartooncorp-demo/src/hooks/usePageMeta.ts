import { useEffect } from "react";

const SITE = "CartoonCorp";
const BASE_DESCRIPTION =
  "Manga, figuras, Funko Pop!, Magic: The Gathering y cartas coleccionables. Propuesta de rediseño de la tienda online de CartoonCorp (Valencia).";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/**
 * Título, descripción, Open Graph, canonical y datos estructurados por página.
 * En producción conviene renderizar esto en servidor (SSR/SSG) para SEO.
 */
export function usePageMeta(title: string, description = BASE_DESCRIPTION, jsonLd?: object, options?: { noindex?: boolean }) {
  const ld = jsonLd ? JSON.stringify(jsonLd) : "";
  useEffect(() => {
    const full = title ? `${title} · ${SITE}` : `${SITE} · Tienda friki en Valencia`;
    document.title = full;
    setMeta("name", "description", description);
    setMeta("property", "og:title", full);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", "website");
    setMeta("name", "robots", options?.noindex ? "noindex, nofollow" : "noindex, follow");

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + window.location.pathname;

    const id = "page-jsonld";
    document.getElementById(id)?.remove();
    if (ld) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = id;
      script.textContent = ld;
      document.head.appendChild(script);
    }
  }, [title, description, ld, options?.noindex]);
}
