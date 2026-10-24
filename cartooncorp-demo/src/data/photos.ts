/**
 * Fotografías de producto.
 *
 * Está vacío a propósito: no se han incluido fotos porque no se ha podido
 * verificar su licencia (ver docs/ENTREGA.md, «Imágenes»). Mientras un
 * producto no tenga foto, la interfaz muestra una ilustración provisional
 * marcada como tal.
 *
 * Para añadir una foto:
 *   1. Copia el archivo a `public/productos/<id>.webp` (recomendado 1200×1500,
 *      proporción 4:5, producto centrado sobre fondo claro y uniforme).
 *   2. Añade una entrada con el id del producto (ver src/data/products.ts):
 *
 *      "38490": [{ src: "/productos/38490.webp", alt: "Portada de Chainsaw Man 17",
 *                  credit: "Norma Editorial", license: "Material de prensa del editor" }],
 *
 * La primera foto es la principal; las siguientes forman la galería. Si una
 * foto no carga, se vuelve a mostrar la ilustración automáticamente.
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

export const productPhotos: Record<string, ProductPhoto[]> = {};
