/**
 * Fotografías de producto.
 *
 * Ahora mismo no hay ninguna: no se han podido obtener ni verificar fotos con
 * permiso de uso (ver docs/FOTOS.md). Mientras un producto no tenga foto, la
 * interfaz muestra una ilustración marcada como provisional.
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
 * sin servidor. Si una foto no carga, se vuelve a mostrar la ilustración.
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
export const photoCredits: Record<string, { alt: string; credit: string; license: string; sourceUrl?: string }> = {};

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
