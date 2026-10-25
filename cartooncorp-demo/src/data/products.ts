import { productPhotos } from "./photos";
import type { Availability, Product, ProductVariantGroup } from "./types";

/**
 * Catálogo de la demo.
 *
 * - `source.name/price = "observed"`: el nombre y el precio se han visto en las
 *   páginas públicas de CartoonCorp indexadas por buscadores (oct. 2026). Los
 *   precios pueden haber cambiado y deben revisarse con el cliente.
 * - `source.* = "demo"`: dato de relleno para que la demo funcione.
 * - `compareAtPrice` sólo aparece cuando el precio anterior se ha observado.
 * - La disponibilidad es simulada salvo que se indique `availability: "observed"`.
 * - `addedAt` es una fecha interna de la demo que sólo sirve para ordenar
 *   novedades; no es una fecha de lanzamiento.
 *
 * Las fotos se registran en `src/data/photos.ts`; sin foto verificada, la
 * interfaz muestra «Foto pendiente». `art.hue` sólo da el color de la sección.
 */

interface Seed {
  id: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  brand?: string;
  franchise?: string;
  availability?: Availability;
  addedAt: string;
  releaseNote?: string;
  short: string;
  description?: string[];
  specs?: [string, string][];
  tags?: string[];
  art: Product["art"];
  variants?: ProductVariantGroup[];
  featured?: boolean;
  /** observed = nombre y precio observados. demo = producto inventado. */
  origin: "observed" | "observed-name" | "demo";
  availabilityObserved?: boolean;
  url?: string;
  collectorNote?: string;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}


function build(seed: Seed): Product {
  const demo = seed.origin === "demo";
  return {
    id: seed.id,
    slug: `${slugify(seed.name)}-${seed.id}`,
    name: seed.name,
    category: seed.category,
    brand: seed.brand,
    franchise: seed.franchise,
    price: seed.price,
    compareAtPrice: seed.compareAtPrice,
    availability: seed.availability ?? "in_stock",
    addedAt: seed.addedAt,
    releaseNote: seed.releaseNote,
    shortDescription: seed.short,
    description: seed.description ?? [seed.short],
    specs: (seed.specs ?? []).map(([label, value]) => ({ label, value })),
    tags: seed.tags ?? [],
    images: productPhotos[seed.id] ?? [],
    art: seed.art,
    variants: seed.variants,
    featured: seed.featured,
    collectorNote: seed.collectorNote,
    source: {
      name: demo ? "demo" : "observed",
      price: seed.origin === "observed" ? "observed" : "demo",
      availability: seed.availabilityObserved ? "observed" : "demo",
      url: seed.url,
    },
  };
}

const seeds: Seed[] = [
  // ─── Manga ──────────────────────────────────────────────────────────────
  {
    id: "28454", name: "Choujin X 01", category: "seinen", price: 9.0, brand: "Norma Editorial", franchise: "Choujin X",
    addedAt: "2026-10-20", short: "El nuevo manga de Sui Ishida, autor de Tokyo Ghoul.",
    description: [
      "Primer volumen de Choujin X, la obra de Sui Ishida publicada en castellano por Norma Editorial.",
      "La web original indica que la primera edición especial incluye un posavasos magnético.",
    ],
    specs: [["Autor", "Sui Ishida"], ["Editorial", "Norma Editorial"], ["Formato", "Rústica"]],
    tags: ["seinen", "novedad"], art: { kind: "manga", hue: 340, number: "01", label: "CHOUJIN X" },
    origin: "observed", url: "https://cartooncorp.es/comics-manga-seinen/28454-choujin-x-01.html", featured: true,
  },
  {
    id: "38490", name: "Chainsaw Man 17", category: "shonen", price: 9.0, brand: "Norma Editorial", franchise: "Chainsaw Man",
    addedAt: "2026-10-22", short: "Denji sigue en el punto de mira en el nuevo tomo de Tatsuki Fujimoto.",
    specs: [["Autor", "Tatsuki Fujimoto"], ["Editorial", "Norma Editorial"]],
    tags: ["shonen", "novedad"], art: { kind: "manga", hue: 18, number: "17", label: "CHAINSAW MAN" },
    origin: "observed", url: "https://cartooncorp.es/shonen/38490-chainsaw-man-17.html", featured: true,
  },
  {
    id: "35900", name: "Kaiju Nº8 09", category: "shonen", price: 8.5, brand: "Planeta Cómic", franchise: "Kaiju Nº8",
    addedAt: "2026-10-18", short: "Kafka Hibino continúa su lucha como el Kaiju Nº8.",
    specs: [["Autor", "Naoya Matsumoto"], ["Editorial", "Planeta Cómic"]],
    tags: ["shonen"], art: { kind: "manga", hue: 150, number: "09", label: "KAIJU Nº8" },
    origin: "observed", url: "https://cartooncorp.es/shonen/35900-kaiju-n%C2%BA8-09.html",
  },
  {
    id: "14049", name: "My Hero Academia 15", category: "shonen", price: 8.5, brand: "Planeta Cómic", franchise: "My Hero Academia",
    addedAt: "2026-08-02", short: "La academia U.A. sigue formando a los héroes del futuro.",
    specs: [["Autor", "Kohei Horikoshi"], ["Editorial", "Planeta Cómic"]],
    tags: ["shonen"], art: { kind: "manga", hue: 205, number: "15", label: "MY HERO ACADEMIA" },
    origin: "observed", url: "https://cartooncorp.es/shonen/14049-my-hero-academia-15.html",
  },
  {
    id: "14007", name: "Dragon Ball Ultimate Edition 07 de 34", category: "shonen", price: 12.95, brand: "Planeta Cómic", franchise: "Dragon Ball",
    addedAt: "2026-07-14", short: "La edición definitiva del clásico de Akira Toriyama.",
    specs: [["Autor", "Akira Toriyama"], ["Editorial", "Planeta Cómic"], ["Páginas", "232"]],
    tags: ["shonen", "clásico"], art: { kind: "manga", hue: 30, number: "07", label: "DRAGON BALL" },
    origin: "observed", url: "https://cartooncorp.es/shonen/14007-dragon-ball-ultimate-edition-07-de-34.html", featured: true,
  },
  {
    id: "18599", name: "Vinland Saga 01", category: "seinen", price: 12.95, brand: "Planeta Cómic", franchise: "Vinland Saga",
    addedAt: "2026-05-30", short: "La épica vikinga de Makoto Yukimura.",
    specs: [["Autor", "Makoto Yukimura"], ["Editorial", "Planeta Cómic"]],
    tags: ["seinen", "clásico"], art: { kind: "manga", hue: 200, accent: 30, number: "01", label: "VINLAND SAGA" },
    origin: "observed", url: "https://cartooncorp.es/comics-manga-seinen/18599-vinland-saga-01.html",
  },
  {
    id: "20513", name: "Akira 05 Edición Original", category: "seinen", price: 22.95, brand: "Norma Editorial", franchise: "Akira",
    addedAt: "2026-04-11", short: "La obra maestra de Katsuhiro Otomo en su edición original.",
    specs: [["Autor", "Katsuhiro Otomo"], ["Editorial", "Norma Editorial"], ["Páginas", "408"]],
    tags: ["seinen", "clásico"], art: { kind: "manga", hue: 0, accent: 0, number: "05", label: "AKIRA" },
    origin: "observed", url: "https://cartooncorp.es/comics-manga-seinen/20513-akira-05-edicion-original.html", featured: true,
  },
  {
    id: "34316", name: "Neon Génesis Evangelion 07 de 07 Edición Coleccionista", category: "shonen", price: 14.95, brand: "Norma Editorial", franchise: "Evangelion",
    addedAt: "2026-06-21", short: "El volumen final de la edición coleccionista.",
    specs: [["Autores", "Yoshiyuki Sadamoto, Khara"], ["Editorial", "Norma Editorial"], ["Edición", "Coleccionista"]],
    tags: ["shonen", "coleccionista"], art: { kind: "manga", hue: 275, accent: 95, number: "07", label: "EVANGELION" },
    origin: "observed", url: "https://cartooncorp.es/shonen/34316-neon-genesis-evangelion-07-de-07-edicion-coleccionista.html",
  },
  {
    id: "38836", name: "Gintama 03 de 26", category: "shonen", price: 18.95, brand: "Planeta Cómic", franchise: "Gintama",
    addedAt: "2026-09-25", short: "Humor y samuráis en la edición de 552 páginas.",
    specs: [["Autor", "Hideaki Sorachi"], ["Editorial", "Planeta Cómic"], ["Páginas", "552"]],
    tags: ["shonen"], art: { kind: "manga", hue: 190, number: "03", label: "GINTAMA" },
    origin: "observed", url: "https://cartooncorp.es/shonen/38836-gintama-03-de-26.html",
  },
  {
    id: "35902", name: "Lamu 01 de 17", category: "shonen", price: 15.95, brand: "Planeta Cómic", franchise: "Urusei Yatsura",
    addedAt: "2026-09-12", short: "Perfect Color Edition del clásico de Rumiko Takahashi.",
    description: [
      "Primer volumen de la Perfect Color Edition de Lamu (Urusei Yatsura), de Rumiko Takahashi.",
      "Precio orientativo: la página pública mostraba un importe entre 15 y 18 €; debe confirmarse.",
    ],
    specs: [["Autora", "Rumiko Takahashi"], ["Editorial", "Planeta Cómic"], ["Páginas", "384"], ["Edición", "Perfect Color"]],
    tags: ["shonen", "clásico"], art: { kind: "manga", hue: 120, accent: 330, number: "01", label: "LAMU" },
    origin: "observed-name", url: "https://cartooncorp.es/shonen/35902-lamu-01-de-17.html",
  },

  // ─── Figuras ────────────────────────────────────────────────────────────
  {
    id: "47963", name: "Son Goku & Chichi Dragon Ball Ichibansho", category: "dragon-ball", price: 109.95, brand: "Bandai Spirits", franchise: "Dragon Ball",
    addedAt: "2026-10-15", short: "Pieza Snap Collection de la línea Ichibansho.",
    specs: [["Línea", "Ichibansho"], ["Material", "PVC"]],
    tags: ["figura", "dragon ball"], art: { kind: "figure", hue: 30, accent: 300, label: "GOKU & CHICHI" },
    origin: "observed", url: "https://cartooncorp.es/figuras-dragon-ball-y-merchandising-dragon-ball/47963-son-goku-chichi-dragon-ball-ichibansho.html", featured: true,
  },
  {
    id: "23152", name: "Lunch Dragon Ball Qposket Color A", category: "dragon-ball", price: 29.95, brand: "Banpresto", franchise: "Dragon Ball",
    addedAt: "2026-03-08", short: "Figura Qposket de Lunch, versión de color A.",
    specs: [["Línea", "Qposket"], ["Fabricante", "Banpresto"]],
    tags: ["figura", "dragon ball"], art: { kind: "figure", hue: 200, accent: 50, label: "LUNCH" },
    origin: "observed", url: "https://cartooncorp.es/figuras-dragon-ball-y-merchandising-dragon-ball/23152-lunch-dragon-ball-qposket-color-a.html",
  },
  {
    id: "33309", name: "Frieza Dragon Ball Z Match Makers", category: "dragon-ball", price: 29.95, brand: "Banpresto", franchise: "Dragon Ball",
    addedAt: "2026-06-03", short: "Figura de unos 15 cm de la línea Match Makers.",
    specs: [["Línea", "Match Makers"], ["Altura", "≈ 15 cm"], ["Material", "PVC"]],
    tags: ["figura", "dragon ball"], art: { kind: "figure", hue: 280, accent: 320, label: "FRIEZA" },
    origin: "observed-name", url: "https://cartooncorp.es/figuras-dragon-ball-y-merchandising-dragon-ball/33309-frieza-dragon-ball-z-match-makers.html",
  },
  {
    id: "40972", name: "Janemba Dragon Ball Z Match Makers Banpresto", category: "dragon-ball", price: 29.95, brand: "Banpresto", franchise: "Dragon Ball",
    addedAt: "2026-09-01", short: "Figura de unos 14 cm de la línea Match Makers.",
    specs: [["Línea", "Match Makers"], ["Altura", "≈ 14 cm"], ["Material", "PVC"]],
    tags: ["figura", "dragon ball"], art: { kind: "figure", hue: 350, accent: 50, label: "JANEMBA" },
    origin: "observed-name", url: "https://cartooncorp.es/figuras-dragon-ball-y-merchandising-dragon-ball/40972-janemba-dragon-ball-z-match-makers-banpresto.html",
  },
  {
    id: "34609", name: "Orange Piccolo History Box Vol. 7 Dragon Ball Super: Super Hero", category: "dragon-ball", price: 24.95, brand: "Banpresto", franchise: "Dragon Ball",
    addedAt: "2026-02-19", short: "Piccolo en su forma Orange, de unos 14 cm.",
    specs: [["Línea", "History Box"], ["Altura", "≈ 14 cm"]],
    tags: ["figura", "dragon ball"], art: { kind: "figure", hue: 24, accent: 140, label: "PICCOLO" },
    origin: "observed-name", url: "https://cartooncorp.es/figuras-dragon-ball-y-merchandising-dragon-ball/34609-orange-piccolo-history-box-vol7-dragon-ball-super-super-hero.html",
  },
  {
    id: "23016", name: "Goku Black WCF Battle of Saiyans Vol. 6 Dragon Ball Super", category: "dragon-ball", price: 12.95, brand: "Banpresto", franchise: "Dragon Ball",
    addedAt: "2026-01-10", short: "Mini figura World Collectable Figure de 7 cm.",
    specs: [["Línea", "World Collectable Figure"], ["Altura", "≈ 7 cm"], ["Material", "PVC"]],
    tags: ["figura", "dragon ball"], art: { kind: "figure", hue: 320, accent: 260, label: "GOKU BLACK" },
    origin: "observed-name", url: "https://cartooncorp.es/figuras-dragon-ball-y-merchandising-dragon-ball/23016-goku-black-wcf-battle-of-saiyans-vol-6-dragon-ball-super.html",
  },
  {
    id: "d-op-01", name: "Figura Monkey D. Luffy", category: "one-piece", price: 34.95, brand: "Fabricante por confirmar", franchise: "One Piece",
    addedAt: "2026-08-05", short: "Producto de ejemplo para ilustrar la sección de One Piece.",
    description: ["Producto ficticio creado para la demo. La web real tiene una sección de figuras de One Piece cuyo catálogo debe importarse."],
    tags: ["figura", "one piece"], art: { kind: "figure", hue: 0, accent: 45, label: "LUFFY" },
    origin: "demo",
  },

  // ─── Funko ──────────────────────────────────────────────────────────────
  {
    id: "40921", name: "Funko Pop! Bulbasaur 453 Pokémon", category: "funko-anime", price: 14.01, brand: "Funko", franchise: "Pokémon",
    addedAt: "2026-07-01", short: "Funko Pop! oficial de vinilo de unos 10 cm.",
    specs: [["Número", "453"], ["Altura", "≈ 10 cm"], ["Material", "Vinilo"]],
    tags: ["funko", "pokémon"], art: { kind: "funko", hue: 150, accent: 200, number: "453", label: "BULBASAUR" },
    origin: "observed", url: "https://cartooncorp.es/funko-pop-manga-y-anime/40921-funko-pop-bulbasaur-453-pok%C3%A9mon.html", featured: true,
    collectorNote: "Producto de coleccionismo, no es un juguete.",
  },
  {
    id: "33562", name: "Funko Pop! Roronoa Zoro 327 One Piece", category: "funko-anime", price: 16.95, brand: "Funko", franchise: "One Piece",
    addedAt: "2026-05-12", short: "El espadachín de los Sombrero de Paja en formato Pop!",
    specs: [["Número", "327"], ["Material", "Vinilo"]],
    tags: ["funko", "one piece"], art: { kind: "funko", hue: 130, accent: 0, number: "327", label: "ZORO" },
    origin: "observed-name", url: "https://cartooncorp.es/funko-pop-manga-y-anime/33562-funko-pop-roronoa-zoro-327-one-piece.html",
    collectorNote: "Producto de coleccionismo, no es un juguete.",
  },
  {
    id: "44311", name: "Funko Pop! The Thing 1516 The Fantastic 4: First Steps", category: "funko-superheroes", price: 16.95, brand: "Funko", franchise: "Marvel",
    addedAt: "2026-10-10", short: "La Cosa de Los 4 Fantásticos: Primeros Pasos.",
    specs: [["Número", "1516"], ["Material", "Vinilo"]],
    tags: ["funko", "marvel"], art: { kind: "funko", hue: 24, accent: 210, number: "1516", label: "THE THING" },
    origin: "observed-name", url: "https://cartooncorp.es/funko-pop-superheroes/44311-funko-pop-the-thing-1516-the-fantastic-4-first-steps.html",
    collectorNote: "Producto de coleccionismo, no es un juguete.",
  },
  {
    id: "d-fk-01", name: "Funko Pop! Frieren", category: "funko-anime", price: 16.95, brand: "Funko", franchise: "Frieren",
    availability: "preorder", addedAt: "2026-09-29", short: "Ejemplo de ficha en reserva (pre-pedido).",
    description: ["Producto ficticio. La web real muestra figuras de Frieren en pre-pedido; los datos exactos deben importarse del catálogo del cliente."],
    tags: ["funko", "preventa"], art: { kind: "funko", hue: 250, accent: 140, label: "FRIEREN" },
    origin: "demo",
  },
  {
    id: "d-fk-02", name: "Funko Pop! Games", category: "funko-games", price: 16.95, brand: "Funko",
    addedAt: "2026-04-02", short: "Ejemplo para la sección Pop! Games.",
    description: ["Producto ficticio para ilustrar la subcategoría Pop! Games."],
    tags: ["funko"], art: { kind: "funko", hue: 100, accent: 280, label: "POP! GAMES" },
    origin: "demo",
  },
  {
    id: "d-fk-03", name: "Funko Pop! Cine y series", category: "funko-cine-series", price: 16.95, brand: "Funko",
    availability: "out_of_stock", addedAt: "2026-03-20", short: "Ejemplo de producto agotado.",
    description: ["Producto ficticio para mostrar cómo se ve un artículo agotado."],
    tags: ["funko"], art: { kind: "funko", hue: 175, accent: 330, label: "POP! MOVIES" },
    origin: "demo",
  },

  // ─── Magic: The Gathering ───────────────────────────────────────────────
  {
    id: "40349", name: "Caja de Sobres de Juego Innistrad Remasterizada (Castellano) – INNR", category: "magic", price: 219.95, compareAtPrice: 249.95, brand: "Wizards of the Coast", franchise: "Magic: The Gathering",
    availabilityObserved: true, addedAt: "2026-02-01", short: "36 sobres de juego de Innistrad Remasterizada.",
    description: [
      "Caja de 36 sobres de juego de Innistrad Remasterizada en castellano.",
      "Cada sobre contiene entre 1 y 4 cartas raras o superiores, de 3 a 6 infrecuentes, de 6 a 9 comunes y una tierra.",
    ],
    specs: [["Sobres", "36"], ["Idioma", "Castellano"], ["Código", "INNR"]],
    tags: ["magic", "caja de sobres", "oferta"], art: { kind: "tcg-box", hue: 210, accent: 0, label: "INNISTRAD REMASTERIZADA" },
    origin: "observed", url: "https://cartooncorp.es/tienda-magic-gathering-en-valencia/40349-caja-de-sobres-de-juego-innistrad-remasterizada-magic-the-gathering-castellano-innr.html", featured: true,
  },
  {
    id: "36340", name: "Caja de Sobres de Juego Horizontes de Modern 3 (Castellano) – MH3", category: "magic", price: 339.95, compareAtPrice: 364.95, brand: "Wizards of the Coast", franchise: "Magic: The Gathering",
    addedAt: "2026-03-15", short: "36 sobres de juego de Horizontes de Modern 3.",
    specs: [["Sobres", "36"], ["Idioma", "Castellano"], ["Código", "MH3"]],
    tags: ["magic", "caja de sobres", "oferta"], art: { kind: "tcg-box", hue: 160, accent: 280, label: "HORIZONTES DE MODERN 3" },
    origin: "observed", url: "https://cartooncorp.es/tienda-magic-gathering-en-valencia/36340-caja-de-sobres-de-juego-horizontes-de-modern-3-magic-the-gathering-castellano-mtg-mh3.html", featured: true,
  },
  {
    id: "42385", name: "Caja de Sobres de Juego El Confín de la Eternidad", category: "magic", price: 139.95, compareAtPrice: 179.95, brand: "Wizards of the Coast", franchise: "Magic: The Gathering",
    addedAt: "2026-07-25", releaseNote: "La web original indicaba salida el 25/07/2025.", short: "Caja completa de 30 sobres de juego.",
    description: [
      "Caja de 30 sobres de juego de El Confín de la Eternidad.",
      "El idioma no es coherente en la web original (el título dice «English» y la URL «castellano»); debe confirmarse antes de publicar.",
    ],
    specs: [["Sobres", "30"], ["Idioma", "Por confirmar"]],
    tags: ["magic", "caja de sobres", "oferta"], art: { kind: "tcg-box", hue: 250, accent: 190, label: "EL CONFÍN DE LA ETERNIDAD" },
    origin: "observed", url: "https://cartooncorp.es/tienda-magic-gathering-en-valencia/42385-caja-de-sobres-de-juego-el-conf%C3%ADn-de-la-eternidad-magic-the-gathering-castellano-mtg-edge.html", featured: true,
  },
  {
    id: "29011", name: "Caja de Sobres de Draft Dominaria Remasterizada (Castellano)", category: "magic", price: 289.95, brand: "Wizards of the Coast", franchise: "Magic: The Gathering",
    addedAt: "2025-12-02", short: "36 sobres de draft de Dominaria Remasterizada.",
    specs: [["Sobres", "36 de draft"], ["Idioma", "Castellano"]],
    tags: ["magic", "caja de sobres"], art: { kind: "tcg-box", hue: 40, accent: 210, label: "DOMINARIA REMASTERIZADA" },
    origin: "observed", url: "https://cartooncorp.es/tienda-magic-gathering-en-valencia/29011--caja-de-sobres-de-draft-dominaria-remasterizada-magic-the-gathering-castellano.html",
  },
  {
    id: "25893", name: "Caja de Sobres de Draft Leyendas de Commander: Batalla por Puerta de Baldur (Castellano)", category: "magic", price: 184.95, brand: "Wizards of the Coast", franchise: "Magic: The Gathering",
    addedAt: "2025-11-18", short: "24 sobres de draft de 20 cartas.",
    specs: [["Sobres", "24 de draft"], ["Cartas por sobre", "20"], ["Idioma", "Castellano"]],
    tags: ["magic", "commander", "caja de sobres"], art: { kind: "tcg-box", hue: 15, accent: 45, label: "PUERTA DE BALDUR" },
    origin: "observed", url: "https://cartooncorp.es/tienda-magic-gathering-en-valencia/25893-caja-de-sobres-de-draft-magic-the-gathering-leyendas-de-commander-dungeons-dragons-batalla-por-puerta-de-baldur-castellano.html",
  },
  {
    id: "25899", name: "Caja de Sobres de Edición Leyendas de Commander: Batalla por Puerta de Baldur (Castellano)", category: "magic", price: 119.95, brand: "Wizards of the Coast", franchise: "Magic: The Gathering",
    availability: "out_of_stock", availabilityObserved: true, addedAt: "2025-11-18", short: "18 sobres de edición de 15 cartas.",
    specs: [["Sobres", "18 de edición"], ["Cartas por sobre", "15"], ["Idioma", "Castellano"]],
    tags: ["magic", "commander", "caja de sobres"], art: { kind: "tcg-box", hue: 15, accent: 280, label: "PUERTA DE BALDUR" },
    origin: "observed", url: "https://cartooncorp.es/pre-pedidos/25899-caja-de-sobres-de-edici%C3%B3n-magic-the-gathering-leyendas-de-commander-dungeons-dragons-batalla-por-puerta-de-baldur-castellano.html",
  },
  {
    id: "23050", name: "Caja de Sobres de Draft Innistrad: Compromiso Escarlata (Castellano) – VOW", category: "magic", price: 124.95, brand: "Wizards of the Coast", franchise: "Magic: The Gathering",
    addedAt: "2025-10-04", short: "36 sobres de draft de 15 cartas.",
    specs: [["Sobres", "36 de draft"], ["Cartas por sobre", "15"], ["Idioma", "Castellano"]],
    tags: ["magic", "caja de sobres"], art: { kind: "tcg-box", hue: 345, accent: 0, label: "COMPROMISO ESCARLATA" },
    origin: "observed", url: "https://cartooncorp.es/comprar-magic-gathering-barato-online/23050-caja-de-sobres-de-draft-innistrad-compromiso-escarlata-magic-the-gathering-castellano-mtg-cv.html",
  },
  {
    id: "36895", name: "Caja de Sobres Colección Básica 2021 (Castellano)", category: "magic", price: 119.95, brand: "Wizards of the Coast", franchise: "Magic: The Gathering",
    addedAt: "2025-09-09", short: "36 sobres de 15 cartas.",
    specs: [["Sobres", "36"], ["Cartas por sobre", "15"], ["Idioma", "Castellano"]],
    tags: ["magic", "caja de sobres"], art: { kind: "tcg-box", hue: 30, accent: 200, label: "COLECCIÓN BÁSICA 2021" },
    origin: "observed", url: "https://cartooncorp.es/tienda-magic-gathering-en-valencia/36895-caja-de-sobres-colecci%C3%B3n-basica-2021-magic-the-gathering-castellano.html",
  },
  {
    id: "3702", name: "Caja de Sobres Juramento de los Guardianes", category: "magic", price: 100.0, brand: "Wizards of the Coast", franchise: "Magic: The Gathering",
    addedAt: "2025-06-06", short: "Caja precintada de 36 sobres.",
    specs: [["Sobres", "36"], ["Estado", "Precintada"]],
    tags: ["magic", "caja de sobres"], art: { kind: "tcg-box", hue: 200, accent: 40, label: "JURAMENTO DE LOS GUARDIANES" },
    origin: "observed", url: "https://cartooncorp.es/comprar-magic-gathering-barato-online/3702-magic-caja-de-sobres-juramento-de-los-guardianes.html",
  },

  // ─── Otros TCG (demo) ───────────────────────────────────────────────────
  {
    id: "d-pk-01", name: "Sobre de ampliación Pokémon JCC", category: "pokemon-tcg", price: 5.95, brand: "The Pokémon Company",
    addedAt: "2026-08-12", short: "Ejemplo de ficha para la sección de cartas Pokémon.",
    description: ["Producto ficticio. La web real tiene una sección de cartas Pokémon; su catálogo debe importarse."],
    tags: ["pokémon", "sobre"], art: { kind: "tcg-pack", hue: 48, accent: 0, label: "POKÉMON TCG" },
    origin: "demo",
  },
  {
    id: "d-op-tcg-01", name: "Sobre One Piece Card Game", category: "one-piece-tcg", price: 5.5, brand: "Bandai",
    availability: "preorder", addedAt: "2026-09-27", short: "Ejemplo de sobre en pre-pedido.",
    description: ["Producto ficticio. La web real lista sobres de One Piece Card Game; los datos reales deben importarse."],
    tags: ["one piece", "sobre", "preventa"], art: { kind: "tcg-pack", hue: 0, accent: 45, label: "ONE PIECE TCG" },
    origin: "demo",
  },

  // ─── Accesorios ─────────────────────────────────────────────────────────
  {
    id: "8136", name: "100 Penny Sleeves Ultra Pro (Fundas)", category: "accesorios-cartas", price: 1.95, brand: "Ultra Pro",
    addedAt: "2025-08-08", short: "Fundas finas para proteger cartas de tamaño estándar.",
    specs: [["Unidades", "100"], ["Tamaño", "Estándar"]],
    tags: ["fundas", "accesorios"], art: { kind: "sleeves", hue: 210, label: "PENNY SLEEVES" },
    origin: "observed-name", url: "https://cartooncorp.es/fundas-tamano-estandar/8136-100-penny-sleeves-ultra-pro-fundas.html",
  },
  {
    id: "42372", name: "Sabo One Piece TCG Sleeves (70)", category: "accesorios-cartas", price: 9.95, brand: "Bandai", franchise: "One Piece",
    addedAt: "2026-09-18", short: "70 fundas oficiales con ilustración de Sabo.",
    specs: [["Unidades", "70"], ["Tamaño", "Estándar"]],
    tags: ["fundas", "one piece"], art: { kind: "sleeves", hue: 220, accent: 40, label: "SABO" },
    origin: "observed-name", url: "https://cartooncorp.es/fundas-tamano-estandar/42372-sabo-one-piece-tcg-sleeves-70.html",
  },
  {
    id: "d-ac-01", name: "Tapete de juego", category: "accesorios-cartas", price: 19.95, brand: "Marca por confirmar",
    addedAt: "2026-06-30", short: "Ejemplo de producto con variantes de diseño.",
    description: ["Producto ficticio para mostrar el selector de variantes con precio y disponibilidad por opción."],
    tags: ["tapete", "accesorios"], art: { kind: "sleeves", hue: 260, accent: 180, label: "PLAYMAT" },
    variants: [
      {
        id: "design", label: "Diseño",
        options: [
          { id: "noche", label: "Noche" },
          { id: "bosque", label: "Bosque" },
          { id: "xl", label: "XL (doble)", price: 29.95, availability: "out_of_stock" },
        ],
      },
    ],
    origin: "demo",
  },

  // ─── Modelismo ──────────────────────────────────────────────────────────
  {
    id: "40526", name: "HG Gundam 00 Qan[T] 1/144", category: "gunpla", price: 24.95, brand: "Bandai", franchise: "Gundam",
    addedAt: "2026-08-20", short: "Maqueta High Grade a escala 1/144.",
    specs: [["Grado", "HG"], ["Escala", "1/144"], ["Montaje", "Sin pegamento"]],
    tags: ["gunpla", "maqueta"], art: { kind: "model-kit", hue: 215, accent: 0, label: "00 QAN[T]" },
    origin: "observed", url: "https://cartooncorp.es/gundam-model-kits-gunpla/40526-hg-gundam-00-qan-t-1144.html", featured: true,
  },
  {
    id: "7179", name: "HG Gundam Vual 1/144", category: "gunpla", price: 24.95, brand: "Bandai", franchise: "Gundam",
    addedAt: "2026-01-28", short: "Maqueta High Grade a escala 1/144.",
    specs: [["Grado", "HG"], ["Escala", "1/144"]],
    tags: ["gunpla", "maqueta"], art: { kind: "model-kit", hue: 130, accent: 50, label: "GUNDAM VUAL" },
    origin: "observed", url: "https://cartooncorp.es/maquetas/7179-1144-hg-gundam-vual.html",
  },
  {
    id: "38119", name: "BB110 Gouten Gundam", category: "gunpla", price: 22.95, brand: "Bandai", franchise: "Gundam",
    addedAt: "2026-05-05", short: "Maqueta SD de la línea BB Senshi.",
    specs: [["Línea", "BB Senshi"]],
    tags: ["gunpla", "maqueta"], art: { kind: "model-kit", hue: 0, accent: 45, label: "GOUTEN" },
    origin: "observed", url: "https://cartooncorp.es/gundam-model-kits-gunpla/38119-bb110-gouten-gundam.html",
  },
  {
    id: "9261", name: "SD 00 Gundam EX Standard GN-0000", category: "gunpla", price: 10.95, brand: "Bandai", franchise: "Gundam",
    addedAt: "2025-12-12", short: "Maqueta SD que no requiere pegamento ni pintura.",
    description: ["Maqueta SD EX Standard. Según la ficha original, no requiere pegamento ni pintura para su montaje, aunque se puede pintar."],
    specs: [["Línea", "SD EX Standard"], ["Montaje", "Sin pegamento ni pintura"]],
    tags: ["gunpla", "maqueta"], art: { kind: "model-kit", hue: 200, accent: 0, label: "00 GUNDAM SD" },
    origin: "observed", url: "https://cartooncorp.es/gundam-model-kits-gunpla/9261-sd-00-gundam-ex-standard-gn-0000-.html",
  },
  {
    id: "d-pt-01", name: "Set de pinceles para modelismo", category: "pinturas", price: 12.95, brand: "Marca por confirmar",
    addedAt: "2026-02-14", short: "Ejemplo para la sección de pinturas y herramientas.",
    description: ["Producto ficticio. La web real vende pinturas, pinceles y aerografía de varias marcas."],
    tags: ["pinturas", "herramientas"], art: { kind: "paint", hue: 150, accent: 20, label: "BRUSH SET" },
    origin: "demo",
  },

  // ─── Juegos y puzzles (demo) ────────────────────────────────────────────
  {
    id: "d-jm-01", name: "Juego de mesa familiar", category: "juegos-de-mesa", price: 34.95, brand: "Editorial por confirmar",
    addedAt: "2026-04-25", short: "Ejemplo para la sección de juegos de mesa.",
    description: ["Producto ficticio. La web real indica más de 300 juegos de mesa y cartas; deben importarse."],
    tags: ["juego de mesa"], art: { kind: "board-game", hue: 90, accent: 20, label: "BOARD GAME" },
    origin: "demo",
  },
  {
    id: "d-pz-01", name: "Puzzle 1000 piezas", category: "puzzles", price: 19.95, brand: "Marca por confirmar",
    addedAt: "2026-03-03", short: "Ejemplo para la sección de puzzles.",
    description: ["Producto ficticio. La web real ofrece puzzles de 500 a 1500 piezas de licencias como Marvel, Spy x Family o Disney."],
    specs: [["Piezas", "1000"]],
    tags: ["puzzle"], art: { kind: "puzzle", hue: 70, accent: 300, label: "1000 PCS" },
    origin: "demo",
  },
];

export const products: Product[] = seeds.map(build);
