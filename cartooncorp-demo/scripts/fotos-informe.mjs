// Genera docs/FOTOS.md: qué productos tienen foto real y cuáles siguen pendientes.
// Uso: npm run fotos:informe
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const src = readFileSync("src/data/products.ts", "utf8");
const seeds = [...src.matchAll(/\{\s*id: "([^"]+)", name: "([^"]+)"[\s\S]*?origin: "([a-z-]+)"(?:, url: "([^"]+)")?/g)].map(([, id, name, origin, url]) => ({ id, name, origin, url }));
const credits = Object.fromEntries([...readFileSync("src/data/photos.ts", "utf8").matchAll(/"([^"]+)": \{ alt: "([^"]+)", credit: "([^"]+)", license: "([^"]+)"(?:, sourceUrl: "([^"]+)")?/g)].map(([, name, alt, credit, license, url]) => [name, { alt, credit, license, url }]));
const files = readdirSync("src/assets/productos").filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
const photosOf = (id) => files.filter((f) => f.replace(/\.[^.]+$/, "").replace(/__\d+$/, "") === id);

const real = seeds.filter((s) => s.origin !== "demo");
const demo = seeds.filter((s) => s.origin === "demo");
const done = real.filter((s) => photosOf(s.id).length);
const row = (s) => `| \`${s.id}\` | ${s.name} | ${photosOf(s.id).length ? `✅ ${photosOf(s.id).join(", ")}` : "⏳ pendiente"} | ${s.url ? `[ficha actual](${s.url})` : "—"} |`;

const md = `# Fotos de producto: estado

Generado con \`npm run fotos:informe\` el ${new Date().toISOString().slice(0, 10)}.

**${done.length} de ${real.length} productos reales tienen foto.** ${real.length - done.length} pendientes. Los ${demo.length} productos de demostración son ficticios: no deben llevar foto de un producto real, sino sustituirse por productos del catálogo de CartoonCorp.

## Fotos integradas y su verificación

| Archivo | Producto | Fuente | Licencia |
|---|---|---|---|
${files.map((f) => { const n = f.replace(/\.[^.]+$/, ""); const c = credits[n] ?? {}; return `| \`${f}\` | ${c.alt ?? "?"} | ${c.url ? `[${c.credit}](${c.url})` : c.credit ?? "?"} | ${c.license ?? "?"} |`; }).join("\n")}

Las tres fotos de Funko proceden de funko.com (buscador oficial; las fichas tienen un desafío anti-bots que no se ha intentado saltar). La correspondencia con el producto de la demo se verificó cruzando el número de artículo de Funko con el número de figura que publican tiendas externas: 36237 = Bulbasaur nº 453, 23191 = Roronoa Zoro nº 327 (el 54462 es otro Zoro y se descartó), 83585 = The Thing nº 1516. Se revisó cada imagen a ojo y se descartó una ilustración ambientada de Bulbasaur que no mostraba el producto tal como se vende. Las imágenes se recortaron, se pasaron a WebP de 900 px y se incrustan en el HTML.

Las cuatro portadas de Norma Editorial proceden de la imagen principal (og:image) de la ficha oficial de cada tomo, localizada con un buscador web porque el buscador interno de Norma está vetado a robots en su robots.txt. Se verificó título, número de tomo, ISBN y precio (iguales a los observados en CartoonCorp), y se evitó «Akira 05» a color, que es otro producto distinto de «Akira 5. Edición original». Cada portada se revisó a ojo (título y número visibles).

Las seis portadas de Planeta Cómic proceden de la ficha oficial de cada tomo (localizada con un buscador web; el buscador interno de Planeta también está vetado a robots). Como esas fichas incluyen portadas de otros libros recomendados, se tomó sólo la imagen de la carpeta que corresponde al identificador de la ficha y se comprobó a ojo el título y el número de tomo. La de Vinland Saga 01 lleva el logotipo antiguo «Planeta DeAgostini», pero es la imagen que publica Planeta para ese producto (ISBN 978-84-16051-81-6).

## Fuentes revisadas y no disponibles

- **cartooncorp.es**: protegida por una verificación de Cloudflare que no se completa en un navegador automático (probado 30 s en Chromium con challenges.cloudflare.com permitido). No se ha intentado saltar.
- **Wizards of the Coast (9 cajas de Magic)**: sus fichas sólo tienen banners promocionales, no fotos de las cajas en castellano que vende la tienda. Pendientes de fotos de CartoonCorp.
- **Bandai / Banpresto (6 figuras, 4 Gunpla, fundas de Sabo)**: p-bandai.com y bandaispirits.co.jp no publican estos productos; las bases de datos oficiales (bandai-hobby.net, bsp-prize.jp) no están permitidas.
- **Ultra Pro (fundas)**: www.ultrapro.com redirige a ultrapro.com, que no está permitido.
- **Wikimedia Commons**: accesible, pero con un límite de peticiones muy estricto (unos 50 s entre consultas). Sólo se completaron 3 búsquedas (los tres Funko), sin resultados.

## Cómo completarlas

1. Consigue la foto con permiso de uso. Lo más directo: las fotos de producto que CartoonCorp ya usa en su tienda (columna "ficha actual"), con su autorización, o el material de prensa de la editorial o el fabricante.
2. Guárdala como \`src/assets/productos/<id>.jpg\` (más fotos: \`<id>__2.jpg\`), idealmente 1200×1500 px, producto centrado sobre fondo claro.
3. Anota alt, crédito y licencia en \`photoCredits\` de \`src/data/photos.ts\` (la build falla si falta).
4. \`npm run build:single\` incrusta las fotos en el HTML independiente. Vuelve a ejecutar este informe.

## Productos reales

| Id | Producto | Foto | Origen del producto |
|---|---|---|---|
${real.map(row).join("\n")}

## Productos de demostración (sustituir por productos reales)

| Id | Producto | Foto | |
|---|---|---|---|
${demo.map(row).join("\n")}
`;
writeFileSync("docs/FOTOS.md", md);
console.log(`docs/FOTOS.md: ${done.length}/${real.length} reales con foto, ${demo.length} demo`);
