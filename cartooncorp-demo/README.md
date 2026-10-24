# CartoonCorp — propuesta de rediseño (demo)

Tienda online de demostración que propone un rediseño de [CartoonCorp](https://cartooncorp.net/), una tienda friki de Valencia. Es un proyecto **independiente**: no usa el código, el catálogo completo ni los sistemas de la tienda actual. **No procesa pagos ni genera pedidos reales.**

- Investigación de la web actual: [`docs/INVESTIGACION.md`](docs/INVESTIGACION.md)
- Funcionalidades, datos simulados, limitaciones y siguientes pasos: [`docs/ENTREGA.md`](docs/ENTREGA.md)

## Requisitos

Node.js 20 o superior y npm.

## Instalar y ejecutar

```sh
cd cartooncorp-demo
npm install
npm run dev        # http://localhost:5173
```

Versión de producción:

```sh
npm run build      # comprueba tipos y genera dist/
npm run preview    # sirve dist/ en http://localhost:4173
```

`dist/` es una web estática. Para publicarla en un hosting, configura la reescritura de todas las rutas a `index.html`, porque es una SPA con rutas del navegador (Netlify: `_redirects`; Vercel: `rewrites`).

## Pruebas

```sh
npm test           # pruebas unitarias (Vitest): carrito, totales, búsqueda, filtros, validación
npm run build && npm run test:e2e   # recorrido completo con Playwright (escritorio y móvil)
```

Las pruebas end-to-end usan el Playwright instalado en el sistema. Si no lo tienes: `npm i -D playwright && npx playwright install chromium`.

## Estructura

```
src/
  data/          catálogo, categorías, datos de la tienda, artículos (sustituibles por API/CMS)
    types.ts     modelo de datos (Product, Category…) con procedencia de cada dato
  services/      lógica sin interfaz: catalog (búsqueda, filtros, orden, paginación),
                 cart (cálculos en céntimos, persistencia), orders (pedidos demo), validation
  state/         contextos de React: carrito, notificaciones, cuenta demo
  components/    cabecera, menú, buscador, tarjetas, ilustraciones, drawer/modal, footer…
  pages/         una página por ruta; las secundarias se cargan bajo demanda
  hooks/         usePageMeta (título, descripción, OG, canonical, JSON-LD)
  styles/        global.css: sistema de diseño (tokens, componentes, breakpoints mobile-first)
tests/e2e/       recorrido automatizado de rutas y flujos
docs/            investigación y documento de entrega
```

**Stack:** React 19, React Router 7, Vite y TypeScript, con fuentes autoalojadas (Archivo variable e IBM Plex Mono). No hay librería de UI ni de estado: se ha evitado cualquier dependencia que no hiciera falta.

## Conectar datos reales

La interfaz solo consume `src/services/*`. Para conectar PrestaShop, Shopify u otro backend:

1. Reimplementa las funciones de `src/services/catalog.ts` (`queryCatalog`, `getProductBySlug`…) contra la API, devolviendo objetos `Product`.
2. Pon en `images[].src` la URL de la foto real. La ilustración generada solo aparece cuando falta.
3. Sustituye `placeDemoOrder` en `src/services/orders.ts` por la creación real del pedido y el redireccionamiento a la pasarela de pago.
