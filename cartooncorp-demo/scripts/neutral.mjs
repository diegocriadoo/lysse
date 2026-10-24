// Genera una copia SIN la marca real a partir de dist-single/cartooncorp-demo.html,
// para poder compartir una vista previa sin usar el nombre, el logotipo ni los
// datos de contacto de CartoonCorp. Falla si queda cualquier referencia.
import { readFileSync, writeFileSync } from "node:fs";

const src = "dist-single/cartooncorp-demo.html";
const out = "dist-single/demo-sin-marca.html";
let html = readFileSync(src, "utf8");

const Q = "[\"`]"; // el minificador usa comillas dobles o invertidas
const re = (src) => new RegExp(src.replaceAll("Q", Q), "g");
const replacements = [
  // Enlaces a la web, blog y redes reales → sin enlace
  [re("Qhttps://cartooncorp\\.(?:es|net)/[^\"`]*Q"), "void 0"],
  [re("Qhttps://noticias\\.cartooncorp\\.net/Q"), "void 0"],
  [re("Qhttps://bsky\\.app/profile/cartooncorp\\.bsky\\.socialQ"), "void 0"],
  [/noticias\.cartooncorp\.net/g, "el blog actual"],
  [/cartooncorp\.net menciona 14 días y cartooncorp\.es 7 días/g, "la web actual da plazos distintos (14 y 7 días)"],
  // Logotipo "Cartoon" + <span>Corp</span>
  [re("children:\\[QCartoonQ,"), "children:[`Tienda`,"],
  [re("children:QCorpQ"), "children:`Demo`"],
  // Datos de la empresa
  [/Cartoon Corp SLU/g, "Razón social"],
  [/CartoonCorp/g, "Tienda Demo"],
  [/C\/ Guillem de Castro, 53/g, "C/ Ejemplo, 1"],
  [/Guillem de Castro, 53/g, "C/ Ejemplo, 1"],
  [/Guillem de Castro/g, "Calle Ejemplo"],
  [re("children:Q53Q"), "children:`1`"],
  [/46007/g, "46000"],
  [/963 28 83 85/g, "900 000 000"],
  [/\+34963288385/g, "+34900000000"],
  [/cartooncorp@gmail\.com/g, "hola@ejemplo.com"],
];
for (const [pattern, to] of replacements) html = html.replace(pattern, to);

const withoutData = html.replace(/data:[^"')\s]+/g, "");
const leftover = withoutData.match(/.{0,40}(cartoon|guillem|963 ?28|46007).{0,40}/gi);
if (leftover) throw new Error("Quedan referencias a la marca:\n" + leftover.join("\n"));

writeFileSync(out, html);
console.log(`${out} (${(html.length / 1024).toFixed(0)} KB)`);

// Versión para publicar como página: sin <html>/<head>/<body>, con el <title> al principio.
const head = html.match(/<head>([\s\S]*?)<\/head>/)[1];
const body = html.match(/<body>([\s\S]*?)<\/body>/)[1];
const page = [
  "<title>Tienda Demo</title>",
  head.match(/<meta name="description"[^>]*>/)[0],
  ...head.match(/<style>[\s\S]*?<\/style>/g),
  body.trim(),
  ...head.match(/<script type="module">[\s\S]*?<\/script>/g),
].join("\n");
writeFileSync("dist-single/tienda-demo-page.html", page);
console.log(`dist-single/tienda-demo-page.html (${(page.length / 1024).toFixed(0)} KB)`);
