import type { Category } from "./types";

/**
 * Árbol de categorías. Las secciones y subsecciones corresponden a las que
 * aparecen en la web pública (ver docs/INVESTIGACION.md). Se ha simplificado
 * la estructura original, que repite secciones con nombres distintos.
 */
export const categories: Category[] = [
  {
    slug: "manga",
    name: "Manga y cómic",
    shortName: "Manga",
    description: "Shonen, seinen, ediciones coleccionista y las últimas novedades editoriales.",
    hue: 4,
    sourceUrl: "https://cartooncorp.es/314-pre-pedidos-novedades-comics",
  },
  { slug: "shonen", parent: "manga", name: "Shonen", description: "Aventuras, acción y los grandes clásicos del género.", hue: 4 },
  { slug: "seinen", parent: "manga", name: "Seinen", description: "Historias adultas, épicas y de autor.", hue: 350 },

  {
    slug: "figuras",
    name: "Figuras y merchandising",
    shortName: "Figuras",
    description: "Figuras de anime, manga y videojuegos de Banpresto, Bandai y más fabricantes.",
    hue: 262,
    sourceUrl: "https://cartooncorp.es/295-figuras-y-merchan",
  },
  { slug: "dragon-ball", parent: "figuras", name: "Dragon Ball", description: "Match Makers, Ichibansho, WCF, Qposket…", hue: 32, sourceUrl: "https://cartooncorp.es/526-figuras-dragon-ball-y-merchandising-dragon-ball" },
  { slug: "one-piece", parent: "figuras", name: "One Piece", description: "La tripulación del Sombrero de Paja al completo.", hue: 210, sourceUrl: "https://cartooncorp.net/527-figuras-one-piece-y-merchandising" },

  {
    slug: "funko",
    name: "Funko Pop!",
    shortName: "Funko",
    description: "Funko Pop! originales de anime, superhéroes, cine, series y videojuegos.",
    hue: 196,
    sourceUrl: "https://cartooncorp.es/278-munecos-funko-pop",
  },
  { slug: "funko-anime", parent: "funko", name: "Pop! Anime", description: "Pokémon, One Piece, Frieren y más.", hue: 196, sourceUrl: "https://cartooncorp.es/496-funko-pop-manga-y-anime" },
  { slug: "funko-superheroes", parent: "funko", name: "Pop! Superhéroes", description: "Marvel y DC.", hue: 220, sourceUrl: "https://cartooncorp.es/495-funko-pop-superheroes" },
  { slug: "funko-cine-series", parent: "funko", name: "Pop! Cine y series", description: "Personajes de películas y series.", hue: 170, sourceUrl: "https://cartooncorp.es/498-funko-pop-peliculas-y-series" },
  { slug: "funko-games", parent: "funko", name: "Pop! Games", description: "Iconos del videojuego.", hue: 140, sourceUrl: "https://cartooncorp.es/499-pop-games" },

  {
    slug: "cartas",
    name: "Cartas coleccionables",
    shortName: "Cartas",
    description: "Magic: The Gathering, Pokémon, One Piece Card Game y otros TCG.",
    hue: 28,
    sourceUrl: "https://cartooncorp.es/195-cartas-coleccionables",
  },
  { slug: "magic", parent: "cartas", name: "Magic: The Gathering", shortName: "Magic", description: "Cajas de sobres, mazos y productos de Commander.", hue: 28, sourceUrl: "https://cartooncorp.es/32-tienda-magic-gathering-en-valencia" },
  { slug: "pokemon-tcg", parent: "cartas", name: "Pokémon JCC", shortName: "Pokémon", description: "Sobres y colecciones del juego de cartas Pokémon.", hue: 48, sourceUrl: "https://cartooncorp.es/347-comprar-cartas-pokemon" },
  { slug: "one-piece-tcg", parent: "cartas", name: "One Piece Card Game", shortName: "One Piece TCG", description: "Sobres y barajas del juego de cartas de One Piece.", hue: 0, sourceUrl: "https://cartooncorp.es/595-one-piece-card-game" },
  { slug: "accesorios-cartas", parent: "cartas", name: "Fundas y accesorios", shortName: "Accesorios", description: "Fundas, cajas para cartas, tapetes, dados y contadores.", hue: 230, sourceUrl: "https://cartooncorp.net/337-accesorios-para-juegos-de-mesa" },

  {
    slug: "modelismo",
    name: "Modelismo",
    description: "Gunpla, maquetas, pinturas, pinceles y wargames.",
    hue: 150,
    sourceUrl: "https://cartooncorp.net/17-modelismo",
  },
  { slug: "gunpla", parent: "modelismo", name: "Gundam (Gunpla)", shortName: "Gunpla", description: "HG, SD y BB de Bandai. Sin pegamento ni pintura.", hue: 150, sourceUrl: "https://cartooncorp.es/gundam-model-kits-gunpla" },
  { slug: "pinturas", parent: "modelismo", name: "Pinturas y herramientas", shortName: "Pinturas", description: "Todo para montar y pintar tus maquetas.", hue: 120 },

  {
    slug: "juegos",
    name: "Juegos de mesa y puzzles",
    shortName: "Juegos",
    description: "Juegos de mesa, de cartas y puzzles de tus licencias favoritas.",
    hue: 90,
    sourceUrl: "https://cartooncorp.net/449-juegos-de-mesa-y-cartas",
  },
  { slug: "juegos-de-mesa", parent: "juegos", name: "Juegos de mesa", description: "Para jugar en casa o en la tienda.", hue: 90 },
  { slug: "puzzles", parent: "juegos", name: "Puzzles", description: "De 500 a 1500 piezas.", hue: 70, sourceUrl: "https://cartooncorp.net/493-comprar-puzzles" },
];

export const topCategories = categories.filter((c) => !c.parent);

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getChildren(slug: string) {
  return categories.filter((c) => c.parent === slug);
}

/** Slug de la categoría y de todas sus descendientes. */
export function getCategoryTree(slug: string): string[] {
  return [slug, ...getChildren(slug).flatMap((c) => getCategoryTree(c.slug))];
}
