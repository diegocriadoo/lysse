/**
 * Fotografías de producto.
 *
 * Estado actual en docs/FOTOS.md (`npm run fotos:informe`). Mientras un
 * producto no tenga foto, la interfaz muestra un marcador neutro «Foto
 * pendiente», nunca una imagen que imite el producto.
 *
 * Para añadir fotos:
 *   1. Guarda el archivo en `src/assets/productos/<id>.jpg` (también .jpeg,
 *      .png o .webp). El id es el de `src/data/products.ts`. Para varias fotos
 *      del mismo producto: `<id>.jpg`, `<id>__2.jpg`, `<id>__3.jpg`…
 *      Recomendado: 1200×1500 px (4:5), producto centrado sobre fondo claro.
 *   2. Anota su procedencia en `photoCredits` (abajo). Es obligatorio: la build
 *      falla si una foto no tiene crédito y licencia.
 *
 * Vite optimiza las fotos al compilar y, en la versión de un solo archivo
 * (`npm run build:single`), las incrusta dentro del HTML para que funcione
 * sin servidor. Si una foto no carga, se muestra el marcador «Foto pendiente».
 */
export interface ProductPhoto {
  src: string;
  alt: string;
  /** Autor o titular de los derechos, para mostrarlo en la ficha. */
  credit?: string;
  /** Licencia o permiso de uso (p. ej. «Foto propia de CartoonCorp», «CC BY 4.0»). */
  license?: string;
  sourceUrl?: string;
}

/** Procedencia de cada archivo de `src/assets/productos/`, por nombre de archivo sin extensión. */
export const photoCredits: Record<string, { alt: string; credit: string; license: string; sourceUrl?: string }> = {
  // Imágenes oficiales de funko.com. Correspondencia verificada por número de
  // artículo de Funko y número de figura (ver docs/FOTOS.md).
  "33562": { alt: "Caja del Funko Pop! Roronoa Zoro nº 327 de One Piece", credit: "Funko", license: "Imagen oficial del fabricante (funko.com); uso sujeto a autorización como distribuidor", sourceUrl: "https://funko.com/pop-roronoa-zoro/23191.html" },
  "33562__2": { alt: "Figura Funko Pop! Roronoa Zoro de One Piece, vista frontal", credit: "Funko", license: "Imagen oficial del fabricante (funko.com); uso sujeto a autorización como distribuidor", sourceUrl: "https://funko.com/pop-roronoa-zoro/23191.html" },
  "44311": { alt: "Caja del Funko Pop! The Thing nº 1516 de The Fantastic Four: First Steps", credit: "Funko", license: "Imagen oficial del fabricante (funko.com); uso sujeto a autorización como distribuidor", sourceUrl: "https://funko.com/pop-the-thing-fantastic-four-first-steps/83585.html" },
  "44311__2": { alt: "Figura Funko Pop! The Thing de The Fantastic Four: First Steps, vista frontal", credit: "Funko", license: "Imagen oficial del fabricante (funko.com); uso sujeto a autorización como distribuidor", sourceUrl: "https://funko.com/pop-the-thing-fantastic-four-first-steps/83585.html" },
  // Portadas oficiales de Norma Editorial. Verificadas por título, número de tomo,
  // ISBN y precio de la ficha de la editorial (ver docs/FOTOS.md).
  "38490": { alt: "Portada de Chainsaw Man 17, de Tatsuki Fujimoto (Norma Editorial)", credit: "Norma Editorial", license: "Imagen oficial de la editorial (normaeditorial.com); uso sujeto a autorización como distribuidor", sourceUrl: "https://www.normaeditorial.com/ficha/manga/chainsaw-man/chainsaw-man-17" },
  "28454": { alt: "Portada de Choujin X 1, de Sui Ishida (Norma Editorial)", credit: "Norma Editorial", license: "Imagen oficial de la editorial (normaeditorial.com); uso sujeto a autorización como distribuidor", sourceUrl: "https://www.normaeditorial.com/ficha/manga/choujin-x/choujin-x-1" },
  "20513": { alt: "Portada de Akira 5. Edición original, de Katsuhiro Otomo (Norma Editorial)", credit: "Norma Editorial", license: "Imagen oficial de la editorial (normaeditorial.com); uso sujeto a autorización como distribuidor", sourceUrl: "https://www.normaeditorial.com/ficha/manga/katsuhiro-otomo/akira-edicion-original/akira-5-edicion-original" },
  "34316": { alt: "Portada de Neon Genesis Evangelion. Edición coleccionista 7 (Norma Editorial)", credit: "Norma Editorial", license: "Imagen oficial de la editorial (normaeditorial.com); uso sujeto a autorización como distribuidor", sourceUrl: "https://www.normaeditorial.com/ficha/manga/neon-genesis-evangelion-edicion-coleccionista/neon-genesis-evangelion-edicion-coleccionista-7" },
  // Portadas oficiales de Planeta Cómic. Verificadas por título y número de tomo
  // en la ficha de la editorial y revisadas a ojo (ver docs/FOTOS.md).
  "35900": { alt: "Portada de Kaiju 8 nº 09, de Naoya Matsumoto (Planeta Cómic)", credit: "Planeta Cómic", license: "Imagen oficial de la editorial (planetadelibros.com); uso sujeto a autorización como distribuidor", sourceUrl: "https://www.planetadelibros.com/libro-kaiju-8-n-09/386560" },
  "14049": { alt: "Portada de My Hero Academia nº 15, de Kohei Horikoshi (Planeta Cómic)", credit: "Planeta Cómic", license: "Imagen oficial de la editorial (planetadelibros.com); uso sujeto a autorización como distribuidor", sourceUrl: "https://www.planetadelibros.com/libro-my-hero-academia-n-15/279978" },
  "14007": { alt: "Portada de Dragon Ball Ultimate nº 07/34, de Akira Toriyama (Planeta Cómic)", credit: "Planeta Cómic", license: "Imagen oficial de la editorial (planetadelibros.com); uso sujeto a autorización como distribuidor", sourceUrl: "https://www.planetadelibros.com/libro-dragon-ball-ultimate-n-0734/324737" },
  "18599": { alt: "Portada de Vinland Saga nº 01, de Makoto Yukimura (Planeta Cómic)", credit: "Planeta Cómic", license: "Imagen oficial de la editorial (planetadelibros.com); uso sujeto a autorización como distribuidor", sourceUrl: "https://www.planetadelibros.com/libro-vinland-saga-n-01/162006" },
  "38836": { alt: "Portada de Gintama nº 03/26, de Hideaki Sorachi (Planeta Cómic)", credit: "Planeta Cómic", license: "Imagen oficial de la editorial (planetadelibros.com); uso sujeto a autorización como distribuidor", sourceUrl: "https://www.planetadelibros.com/libro-gintama-n-0326/388090" },
  "35902": { alt: "Portada de Lamu nº 01/17, de Rumiko Takahashi (Planeta Cómic)", credit: "Planeta Cómic", license: "Imagen oficial de la editorial (planetadelibros.com); uso sujeto a autorización como distribuidor", sourceUrl: "https://www.planetadelibros.com/libro-lamu-n-0117/376422" },
  "40921": { alt: "Figura Funko Pop! Bulbasaur nº 453 de Pokémon", credit: "Funko", license: "Imagen oficial del fabricante (funko.com); uso sujeto a autorización como distribuidor", sourceUrl: "https://funko.com/pop-bulbasaur/36237.html" },
};

const files = import.meta.glob<string>("../assets/productos/*.{jpg,jpeg,png,webp}", { eager: true, import: "default", query: "?url" });

/** `38490` → foto 1 de 38490; `38490__2` → foto 2. Los ids pueden contener guiones y números (`d-op-01`). */
export function parsePhotoName(name: string) {
  const match = name.match(/^(.+?)(?:__(\d+))?$/)!;
  return { id: match[1], order: Number(match[2] ?? 1) };
}

function collect(): Record<string, ProductPhoto[]> {
  const byProduct: Record<string, { order: number; photo: ProductPhoto }[]> = {};
  for (const [path, src] of Object.entries(files)) {
    const name = path.split("/").pop()!.replace(/\.[^.]+$/, "");
    const { id, order } = parsePhotoName(name);
    const meta = photoCredits[name];
    if (!meta) throw new Error(`Falta el crédito de la foto ${name} en src/data/photos.ts (photoCredits).`);
    (byProduct[id] ??= []).push({ order, photo: { src, ...meta } });
  }
  return Object.fromEntries(Object.entries(byProduct).map(([id, list]) => [id, list.sort((a, b) => a.order - b.order).map((x) => x.photo)]));
}

export const productPhotos: Record<string, ProductPhoto[]> = collect();
