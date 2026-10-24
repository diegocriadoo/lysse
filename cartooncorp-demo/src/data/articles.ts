/**
 * Contenido editorial de ejemplo.
 *
 * CartoonCorp tiene un blog propio (noticias.cartooncorp.net) que trata
 * lanzamientos de Magic, mazos de Commander o novedades editoriales. Estos
 * textos son propuestas de formato escritas para la demo, no artículos reales.
 */
export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  hue: number;
  body: string[];
  /** Categoría del catálogo relacionada, para enlazar productos. */
  relatedCategory: string;
}

export const articles: Article[] = [
  {
    slug: "guia-cajas-de-sobres-magic",
    title: "Caja de sobres de juego o de draft: cuál elegir",
    excerpt: "Una guía rápida para saber qué caja de Magic encaja con tu forma de jugar.",
    category: "Magic: The Gathering",
    hue: 28,
    relatedCategory: "magic",
    body: [
      "Los sobres de draft están pensados para jugar en la mesa: abrir, elegir cartas y construir un mazo en el momento. Los sobres de juego mezclan esa experiencia con más rarezas por sobre, por lo que suelen preferirse para abrir en casa.",
      "Si vas a organizar un draft con amigos, una caja de draft rinde mejor. Si buscas cartas concretas para tu colección, compara el contenido de cada sobre en la ficha del producto.",
      "Este artículo es un ejemplo de contenido para el blog. El texto definitivo debería escribirlo el equipo de la tienda.",
    ],
  },
  {
    slug: "empezar-con-gunpla",
    title: "Tu primer Gunpla: por dónde empezar",
    excerpt: "SD, HG… qué significan los grados de Bandai y qué necesitas para montar.",
    category: "Modelismo",
    hue: 150,
    relatedCategory: "gunpla",
    body: [
      "Las maquetas SD y HG son la puerta de entrada al Gunpla. Las fichas de la tienda indican que muchas no requieren pegamento ni pintura, así que basta con unas tenazas de corte para empezar.",
      "Cuando cojas soltura, puedes pasar a pintar detalles o aplicar panel lining para dar profundidad.",
      "Este artículo es un ejemplo de contenido para el blog. El texto definitivo debería escribirlo el equipo de la tienda.",
    ],
  },
  {
    slug: "como-cuidar-tus-funko",
    title: "Cómo exponer y conservar tus Funko Pop!",
    excerpt: "Luz, polvo y cajas: pequeños gestos para que tu colección dure.",
    category: "Coleccionismo",
    hue: 196,
    relatedCategory: "funko",
    body: [
      "La luz directa del sol decolora el vinilo y la caja. Si expones tu colección cerca de una ventana, usa cortinas o vitrinas con protección UV.",
      "Para quien conserva las cajas, los protectores de plástico evitan golpes y esquinas dobladas.",
      "Este artículo es un ejemplo de contenido para el blog. El texto definitivo debería escribirlo el equipo de la tienda.",
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}
