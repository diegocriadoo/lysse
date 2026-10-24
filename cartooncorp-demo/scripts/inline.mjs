// Mete el JS, el CSS y el favicon de dist-single/ dentro de un único HTML
// autocontenido: dist-single/cartooncorp-demo.html
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = "dist-single";
let html = readFileSync(join(dir, "index.html"), "utf8");
const read = (url) => readFileSync(join(dir, url.replace(/^\//, "")), "utf8");

html = html.replace(/<script type="module" crossorigin src="([^"]+)"><\/script>/, (_, src) =>
  `<script type="module">${read(src).replace(/<\/script/gi, "<\\/script")}</script>`,
);
html = html.replace(/<link rel="stylesheet" crossorigin href="([^"]+)">/, (_, href) => `<style>${read(href)}</style>`);
html = html.replace('href="/favicon.svg"', `href="data:image/svg+xml,${encodeURIComponent(read("favicon.svg"))}"`);

if (/src="\/assets|href="\/assets/.test(html)) throw new Error("Quedan recursos externos sin incrustar");
writeFileSync(join(dir, "cartooncorp-demo.html"), html);
console.log(`dist-single/cartooncorp-demo.html (${(html.length / 1024).toFixed(0)} KB)`);
