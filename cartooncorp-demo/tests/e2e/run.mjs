/**
 * Pruebas end-to-end de la demo con Playwright.
 *
 *   npm run build && npm run test:e2e
 *
 * Arranca `vite preview`, recorre los flujos principales en escritorio y móvil
 * y falla si hay errores de consola, desbordamiento horizontal, enlaces
 * internos rotos o cálculos incorrectos. Usa el Playwright instalado en el
 * sistema (no es dependencia del proyecto): `npm i -D playwright` si falta.
 */
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { setTimeout as sleep } from "node:timers/promises";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const PORT = 4174;
const BASE = `http://localhost:${PORT}`;
const ROUTES = [
  "/", "/tienda", "/categoria/manga", "/categoria/magic", "/categoria/funko-anime", "/novedades", "/ofertas", "/preventas",
  "/buscar?q=dragon", "/buscar?q=zzzz", "/producto/chainsaw-man-17-38490", "/carrito", "/checkout", "/cuenta", "/contacto",
  "/tienda-fisica", "/ayuda", "/envios", "/devoluciones", "/legal/aviso-legal", "/legal/privacidad", "/legal/cookies",
  "/legal/condiciones", "/noticias", "/noticias/empezar-con-gunpla", "/sobre-la-demo", "/propuesta", "/ruta-inexistente",
];

let failures = 0;
const results = [];
function check(name, ok, detail = "") {
  results.push(`${ok ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}
const euro = (s) => Number(s.replace(/[^\d,]/g, "").replace(",", "."));

const server = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], { stdio: "ignore" });
try {
  for (let i = 0; i < 40; i++) {
    try {
      if ((await fetch(BASE)).ok) break;
    } catch {}
    await sleep(250);
  }

  const browser = await chromium.launch();

  // ── 1. Todas las rutas, escritorio y móvil ────────────────────────────────
  for (const [label, viewport] of [["escritorio", { width: 1440, height: 900 }], ["tablet", { width: 820, height: 1180 }], ["móvil", { width: 390, height: 844 }], ["móvil 360", { width: 360, height: 740 }]]) {
    const ctx = await browser.newContext({ viewport });
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));
    const internal = new Set();
    for (const route of ROUTES) {
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      await page.waitForTimeout(350);
      const h1 = await page.locator("h1").first().textContent().catch(() => null);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (!h1 || overflow > 0) check(`[${label}] ${route}`, false, `h1=${!!h1} overflow=${overflow}px`);
      for (const href of await page.$$eval("a[href^='/']", (as) => as.map((a) => a.getAttribute("href")))) internal.add(href);
    }
    check(`[${label}] ${ROUTES.length} rutas cargan con h1 y sin desbordamiento horizontal`, true);
    check(`[${label}] sin errores de consola`, errors.length === 0, errors.slice(0, 3).join(" | "));

    if (label === "escritorio") {
      const broken = [];
      for (const href of internal) {
        await page.goto(BASE + href, { waitUntil: "networkidle" });
        if ((await page.title()).startsWith("No encontrado")) broken.push(href);
      }
      check(`enlaces internos (${internal.size}) sin 404`, broken.length === 0, broken.join(", "));
    }
    await ctx.close();
  }

  // ── 2. Búsqueda, filtros y orden ──────────────────────────────────────────
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE + "/");
    await page.getByRole("link", { name: "Descubrir categorías" }).click();
    await page.waitForTimeout(600);
    const anchorOk = await page.evaluate(() => location.pathname === "/" && document.activeElement?.id === "categorias");
    check("«Descubrir categorías» lleva a las categorías", anchorOk);
    await page.evaluate(() => scrollTo(0, 0));
    const search = page.getByRole("combobox");
    await search.fill("dragon");
    await page.getByRole("listbox").waitFor();
    check("buscador muestra sugerencias", (await page.getByRole("option").count()) > 1);
    await search.press("Enter");
    await page.waitForURL(/\/buscar\?q=dragon/);
    await page.locator("#results-count", { hasText: /\d+ producto/ }).waitFor();
    const n = euro(await page.locator("#results-count").textContent());
    check("búsqueda «dragon» devuelve resultados", n >= 7, `${n} productos`);

    await page.goto(BASE + "/buscar?q=zzzz");
    await page.waitForSelector(".empty");
    check("búsqueda sin resultados muestra estado vacío", await page.getByText("No encontramos nada").isVisible());

    await page.goto(BASE + "/categoria/manga");
    await page.locator("#results-count", { hasText: /\d+ producto/ }).waitFor();
    const total = euro(await page.locator("#results-count").textContent());
    await page.locator(".catalog__aside").getByRole("checkbox", { name: /^Norma Editorial/ }).check();
    await page.waitForURL(/marca=Norma/);
    await page.locator("#results-count", { hasText: /^\d+ productos?$/ }).waitFor();
    await page.waitForFunction((t) => !document.querySelector("[aria-busy=true]") && !document.querySelector("#results-count")?.textContent?.startsWith(String(t)), total);
    const filtered = euro(await page.locator("#results-count").textContent());
    const brands = await page.locator(".card__meta").allTextContents();
    check("filtro por editorial", filtered < total && brands.every((b) => /norma/i.test(b)), `${total} → ${filtered}`);
    await page.getByRole("button", { name: "Quitar filtro Norma Editorial" }).click();
    await page.waitForFunction((t) => document.querySelector("#results-count")?.textContent?.startsWith(String(t)), total);
    check("quitar filtro restaura resultados", true);

    await page.locator(".toolbar__sort select").selectOption("price-asc");
    await page.waitForURL(/orden=price-asc/);
    await page
      .waitForFunction(() => {
        const p = [...document.querySelectorAll(".card .price__now")].map((e) => Number(e.textContent.replace(/[^\d,]/g, "").replace(",", ".")));
        return !document.querySelector("[aria-busy=true]") && p.every((v, i) => i === 0 || v >= p[i - 1]);
      }, null, { timeout: 5000 })
      .catch(() => {});
    const prices = (await page.locator(".card .price__now").allTextContents()).map(euro);
    check("orden por precio ascendente", prices.every((p, i) => i === 0 || p >= prices[i - 1]), prices.join(", "));

    await page.goto(BASE + "/tienda");
    await page.waitForSelector(".pagination");
    await page.getByRole("link", { name: "Página 2" }).click();
    await page.waitForURL(/pagina=2/);
    await page.locator('.pagination [aria-current="page"]', { hasText: "2" }).waitFor();
    check("paginación", true);
    await ctx.close();
  }

  // ── 3. Carrito y checkout ─────────────────────────────────────────────────
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE + "/producto/chainsaw-man-17-38490");
    await page.getByRole("button", { name: "Sumar una unidad" }).first().click();
    await page.getByRole("button", { name: /Añadir al carrito/ }).first().click();
    await page.getByText("Añadido al carrito").waitFor();
    check("toast al añadir", true);
    check("contador del carrito = 2", (await page.locator(".header__cart").getAttribute("aria-label")).includes("2 artículos"));

    await page.goto(BASE + "/producto/my-hero-academia-15-14049");
    await page.getByRole("button", { name: /Añadir al carrito/ }).first().click();

    await page.reload();
    check("carrito persiste tras recargar", (await page.locator(".header__cart").getAttribute("aria-label")).includes("3 artículos"));

    await page.goto(BASE + "/carrito");
    const subtotal = euro(await page.locator(".summary .sum-row").first().locator("span").last().textContent());
    check("subtotal 2×9,00 + 8,50 = 26,50", subtotal === 26.5, String(subtotal));
    check("aviso de envío gratis con importe restante", await page.getByText(/Te faltan\s*33,50/).first().isVisible());

    await page.getByRole("button", { name: "Sumar una unidad" }).first().click();
    await page.waitForTimeout(100);
    const sub2 = euro(await page.locator(".summary .sum-row").first().locator("span").last().textContent());
    check("modificar cantidad recalcula (35,50)", sub2 === 35.5, String(sub2));

    await page.getByRole("button", { name: "Eliminar" }).last().click();
    await page.getByRole("button", { name: "Deshacer" }).click();
    await page.waitForTimeout(100);
    check("eliminar + deshacer", (await page.locator(".lines .line").count()) === 2);

    await page.goto(BASE + "/checkout");
    await page.getByRole("button", { name: /Continuar/ }).click();
    check("checkout valida campos vacíos", (await page.locator(".field__error").count()) === 3);
    await page.locator("#email").fill("prueba@ejemplo.com");
    await page.getByLabel("Nombre y apellidos").fill("Ana Prueba");
    await page.getByLabel("Teléfono").fill("612 345 678");
    await page.getByRole("button", { name: /Continuar/ }).click();
    await page.getByText("¿Cómo quieres recibirlo?").waitFor();
    await page.getByRole("button", { name: /Continuar/ }).click();
    check("dirección obligatoria con envío a domicilio", (await page.locator(".field__error").count()) >= 3);
    const totalShip = euro(await page.locator(".summary .sum-row--total strong").textContent());
    await page.getByText("Recogida en tienda", { exact: true }).click();
    const totalPickup = euro(await page.locator(".summary .sum-row--total strong").textContent());
    check("envío 4,95 € y recogida gratis", Math.round((totalShip - totalPickup) * 100) === 495, `${totalShip} vs ${totalPickup}`);
    await page.getByRole("button", { name: /Continuar/ }).click();
    await page.getByRole("button", { name: /Confirmar pedido de prueba/ }).click();
    check("exige aceptar condiciones", await page.getByText("Debes aceptar las condiciones").isVisible());
    await page.locator(".checkout__form").getByRole("checkbox").check();
    await page.getByRole("button", { name: /Confirmar pedido de prueba/ }).click();
    await page.waitForURL(/\/pedido\/DEMO-/);
    check("confirmación identificada como demostración", /pedido de demostración/i.test(await page.locator(".order__hero").textContent()));
    check("carrito vacío tras el pedido", (await page.locator(".header__cart").getAttribute("aria-label")).includes("0 artículos"));
    await page.goto(BASE + "/cuenta");
    await ctx.close();
  }

  // ── 3b. Fotos reales ─────────────────────────────────────────────────────
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const broken = [];
    page.on("requestfailed", (r) => broken.push(r.url()));
    const imgState = () =>
      page.$$eval("img.product-photo", (imgs) => imgs.map((i) => ({ alt: i.alt, ok: i.complete && i.naturalWidth > 0 })));
    const loadAll = async () => {
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      });
      await page.waitForTimeout(400);
    };
    const results = {};
    for (const route of ["/", "/categoria/funko", "/categoria/manga", "/producto/chainsaw-man-17-38490", "/producto/funko-pop-roronoa-zoro-327-one-piece-33562", "/producto/funko-pop-bulbasaur-453-pokemon-40921", "/producto/funko-pop-the-thing-1516-the-fantastic-4-first-steps-44311"]) {
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      await loadAll();
      results[route] = await imgState();
    }
    const all = Object.values(results).flat();
    check("fotos reales cargan (portada, Funko, Manga y 4 fichas)", all.length > 0 && all.every((i) => i.ok), `${all.filter((i) => i.ok).length}/${all.length} cargadas`);
    check("ficha de Zoro: 2 fotos (caja y figura)", (await (async () => { await page.goto(BASE + "/producto/funko-pop-roronoa-zoro-327-one-piece-33562"); return page.locator(".gallery__thumb").count(); })()) === 2);
    const galleryWidths = {};
    for (const slug of ["akira-05-edicion-original-20513", "funko-pop-bulbasaur-453-pokemon-40921", "kaiju-n-8-09-35900", "funko-pop-roronoa-zoro-327-one-piece-33562", "caja-de-sobres-de-juego-innistrad-remasterizada-castellano-innr-40349"]) {
      await page.goto(BASE + "/producto/" + slug);
      galleryWidths[slug] = Math.round((await page.locator(".gallery__main").boundingBox()).width);
    }
    check("imagen principal de la ficha a tamaño completo (1, 2 o ninguna foto)", Object.values(galleryWidths).every((w) => w > 400), JSON.stringify(galleryWidths));
    check("sin peticiones de imagen fallidas", broken.length === 0, broken.join(", "));
    await page.goto(BASE + "/tienda");
    await page.locator("#results-count", { hasText: /\d+ producto/ }).waitFor();
    const pending = await page.locator(".photo-pending").count();
    const illustrations = await page.locator("svg.product-art").count();
    check("ninguna ilustración de producto en la web", illustrations === 0, `${illustrations} ilustraciones`);
    check("productos sin foto muestran «Foto pendiente»", pending > 0, `${pending} en la página 1 del catálogo`);
    await ctx.close();
  }

  // ── 4. Móvil: menú, filtros, accesibilidad por teclado ────────────────────
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
    const page = await ctx.newPage();
    await page.goto(BASE + "/");
    const burger = page.getByRole("button", { name: "Abrir menú" });
    await burger.click();
    const dialog = page.getByRole("dialog", { name: "Menú" });
    await dialog.waitFor();
    check("menú móvil abre", true);
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "detached" });
    check("Escape cierra el menú y devuelve el foco", await burger.evaluate((el) => el === document.activeElement));

    await page.goto(BASE + "/categoria/cartas");
    await page.locator("#results-count", { hasText: /\d+ producto/ }).waitFor();
    await page.getByRole("button", { name: /Filtros/ }).click();
    const sheet = page.getByRole("dialog", { name: "Filtros" });
    await sheet.getByLabel("Sólo ofertas").check();
    await page.waitForURL(/oferta=1/);
    await page.waitForFunction(() => !document.querySelector("[aria-busy=true]"));
    await sheet.getByRole("button", { name: /Ver \d+ productos?/ }).click();
    const n = euro(await page.locator("#results-count").textContent());
    check("filtros en hoja inferior (móvil)", n === 3, `${n} ofertas`);

    await page.goto(BASE + "/producto/chainsaw-man-17-38490");
    const sticky = page.locator(".sticky-buy");
    const hiddenAtTop = !(await sticky.evaluate((el) => el.classList.contains("is-visible")));
    await page.mouse.wheel(0, 1400);
    await page.waitForTimeout(400);
    const shownAfterScroll = await sticky.evaluate((el) => el.classList.contains("is-visible"));
    check("barra de compra fija: oculta arriba y visible al bajar", hiddenAtTop && shownAfterScroll, `${hiddenAtTop}/${shownAfterScroll}`);
    await sticky.getByRole("button").click();
    await page.getByText("Añadido al carrito").waitFor();
    check("barra de compra fija añade al carrito", true);

    await page.goto(BASE + "/categoria/cartas");
    await page.locator("#results-count", { hasText: /\d+ producto/ }).waitFor();
    const overlaps = await page.$$eval(".card__flags", (rows) =>
      rows.filter((row) => {
        const r = [...row.children].map((c) => c.getBoundingClientRect());
        return r.some((a, i) => r.some((b, j) => i < j && a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom));
      }).length,
    );
    check("etiquetas de tarjeta sin solaparse (móvil)", overlaps === 0, `${overlaps} tarjetas con solape`);

    const small = await page.$$eval("button, a.btn, .card__add, input[type=checkbox]", (els) =>
      els.filter((e) => e.offsetParent && !e.closest(".footer, .crumbs, .announce")).map((e) => e.getBoundingClientRect()).filter((r) => r.width > 0 && (r.height < 24 || r.width < 20)).length,
    );
    check("objetivos táctiles de tamaño suficiente", small === 0, `${small} demasiado pequeños`);
    await ctx.close();
  }

  // ── 5. Formulario de contacto ─────────────────────────────────────────────
  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(BASE + "/contacto");
    await page.getByRole("button", { name: "Enviar mensaje" }).click();
    check("contacto valida campos", (await page.locator(".field__error").count()) === 5);
    await page.locator("#c-name").fill("Ana");
    await page.locator("#c-email").fill("ana@ejemplo.com");
    await page.getByLabel("Motivo").selectOption({ index: 1 });
    await page.getByLabel("Mensaje").fill("¿Os llegará el próximo tomo?");
    await page.locator(".contact__form").getByRole("checkbox").check();
    await page.getByRole("button", { name: "Enviar mensaje" }).click();
    await page.getByText("Mensaje simulado enviado").waitFor();
    check("contacto: envío simulado", true);
    await ctx.close();
  }

  await browser.close();
} catch (e) {
  failures++;
  results.push(`✗ excepción: ${e.message.split("\n")[0]}`);
} finally {
  server.kill();
}

console.log(results.join("\n"));
console.log(`\n${failures === 0 ? "Todo correcto" : `${failures} fallos`}`);
process.exit(failures ? 1 : 0);
