// Genera docs/FOTOS.md: qué productos tienen foto real y cuáles siguen pendientes.
// Uso: npm run fotos:informe
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const src = readFileSync("src/data/products.ts", "utf8");
const seeds = [...src.matchAll(/\{\s*id: "([^"]+)", name: "([^"]+)"[\s\S]*?origin: "([a-z-]+)"(?:, url: "([^"]+)")?/g)].map(([, id, name, origin, url]) => ({ id, name, origin, url }));
const files = readdirSync("src/assets/productos").filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
const photosOf = (id) => files.filter((f) => f.replace(/\.[^.]+$/, "").replace(/__\d+$/, "") === id);

const real = seeds.filter((s) => s.origin !== "demo");
const demo = seeds.filter((s) => s.origin === "demo");
const done = real.filter((s) => photosOf(s.id).length);
const row = (s) => `| \`${s.id}\` | ${s.name} | ${photosOf(s.id).length ? `✅ ${photosOf(s.id).join(", ")}` : "⏳ pendiente"} | ${s.url ? `[ficha actual](${s.url})` : "—"} |`;

const md = `# Fotos de producto: estado

Generado con \`npm run fotos:informe\` el ${new Date().toISOString().slice(0, 10)}.

**${done.length} de ${real.length} productos reales tienen foto.** ${real.length - done.length} pendientes. Los ${demo.length} productos de demostración son ficticios: no deben llevar foto de un producto real, sino sustituirse por productos del catálogo de CartoonCorp.

## Por qué no hay fotos todavía

El entorno donde se ha desarrollado la demo no tiene acceso a Internet para imágenes: se probaron cartooncorp.es, cartooncorp.net, Norma Editorial, Planeta de Libros, Funko, Bandai, Bandai Spirits, Wizards of the Coast, Amazon, Wikimedia Commons, Google, Bing y DuckDuckGo, y todos fueron rechazados por la política de red. No se ha descargado, generado ni enlazado ninguna foto sin verificar.

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
