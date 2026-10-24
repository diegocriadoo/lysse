# Investigación de la web actual de CartoonCorp

Fecha de la consulta: octubre de 2026.

## Cómo se ha investigado (y sus límites)

- **No se pudo abrir `cartooncorp.net` ni `cartooncorp.es` directamente.** La política de red del entorno de desarrollo bloqueó la conexión con ambos dominios. No se ha navegado la web en vivo, ni se ha inspeccionado su HTML, ni se ha probado el carrito, el registro o el checkout.
- La información sale de **páginas públicas indexadas por buscadores** (títulos, fragmentos y datos de las fichas de `cartooncorp.es` y `cartooncorp.net`) y de directorios externos (Cylex, Salir.com, La Tienda One Piece, Infantil MSBEBE) y del perfil público de Bluesky.
- Todo lo que aparece abajo como "observado" se ha visto en esos resultados. Lo demás está marcado como desconocido.

Para completar la auditoría haría falta añadir `cartooncorp.net` y `cartooncorp.es` a los dominios permitidos del entorno, o revisarla junto al cliente.

## Negocio e identidad

- **Nombre:** CartoonCorp / Cartoon Corp / CartoonCorp Evolution. En la página de tiendas aparece la razón social "CARTOON CORP SLU".
- **Posicionamiento:** "Tienda friki en Valencia - Regalos originales" (título de la portada en `.net` y `.es`).
- **Tienda física:** C/ Guillem de Castro, 53, 46007 Valencia.
- **Teléfono:** 963 28 83 85 (según directorios).
- **Email:** aparecen `cartooncorp@gmail.com` y `cartooncorporation@gmail.com`. Está por confirmar cuál es el vigente.
- **Horario:** las fuentes se contradicen. No se publica en la demo.
- **Comunidad:** organizan torneos y partidas en tienda, por ejemplo Commander casual (Bluesky) y rol los fines de semana (Salir.com).
- **Blog:** `noticias.cartooncorp.net`, con lanzamientos de Magic, mazos de Commander y novedades editoriales (por ejemplo, Berserk Master Edition de Panini).
- **Dominios:** `cartooncorp.net` y `cartooncorp.es` parecen servir el mismo catálogo. La URL `cartooncorp.net/tiendas`, la ruta `index.php?controller=stores` y las URL del tipo `/32-categoria` o `/id-producto.html` apuntan a **PrestaShop**.

## Catálogo observado

| Sección | URL pública | Notas |
|---|---|---|
| Manga y cómic (shonen, seinen, novedades/pre-pedidos de cómic) | `/314-pre-pedidos-novedades-comics`, `/shonen/…`, `/comics-manga-seinen/…` | Norma Editorial, Planeta Cómic… |
| Figuras y merchandising | `/295-figuras-y-merchan` | Dragon Ball (`/526-…`), One Piece (`/527-…`). Marcas: Banpresto (más de 140 artículos según su página), Bandai, Ichibansho, Qposket, WCF, Match Makers |
| Funko Pop! | `/278-munecos-funko-pop` | Anime (`/496`), Superhéroes (`/495`), Cine y series (`/498`), Games (`/499`), Famosos (`/503`) |
| Cartas coleccionables | `/195-cartas-coleccionables` | Magic (`/32-…`), Pokémon (`/347-…`), One Piece Card Game (`/595-…`, 8 productos), Digimon, Dragon Ball Super, Yu-Gi-Oh! |
| Accesorios de juego | `/337-accesorios-para-juegos-de-mesa`, `/479-cajas-para-cartas` | Fundas, tapetes, dados, contadores, cajas |
| Juegos de mesa y cartas | `/449-juegos-de-mesa-y-cartas` | "Más de 300 juegos" (la página mostraba 272) |
| Puzzles | `/493-comprar-puzzles` | De 500 a 1500 piezas (Marvel, Spy x Family, Disney) |
| Modelismo | `/17-modelismo` | Gunpla (HG, SD, BB), maquetas, pinturas, pinceles, aerografía, wargames |
| Pre-pedidos | `/pre-pedidos/…` | Funko con fechas por semanas, cajas de Magic |
| Nuevos productos | `/nuevos-productos` | |

Precios observados de ejemplo: Chainsaw Man 17 a 9,00 €, caja de Innistrad Remasterizada a 219,95 € (antes 249,95 €), HG Gundam 00 Qan[T] a 24,95 €, Funko Bulbasaur a 14,01 €. La lista completa está en `src/data/products.ts`.

## Condiciones comerciales observadas

- **Envío gratuito en pedidos superiores a 60 €.** Aparece en las fichas de producto.
- **Métodos de entrega:** agencia de transportes, Correos o recogida en tienda sin gastos (según las condiciones de uso).
- **Gastos de envío:** no están incluidos en el precio. No se encontró la tarifa.
- **Devoluciones:** `.es` habla de 7 días y `.net` de 14 días naturales. Los portes de la devolución los paga el cliente y se reembolsa el importe del producto. ⚠️ La ley española fija 14 días como mínimo para ventas a distancia. **La demo usa 14 días.**
- **Precios con IVA incluido.**
- Algunos productos se marcan como pensados para coleccionistas adultos, no como juguetes.
- Hay promociones puntuales, como la carta promocional "Buy a Box" de Magic.
- **Formas de pago:** no se encontró información.

## Problemas de experiencia de usuario detectados (con lo visible)

1. **Dos dominios con el mismo contenido** (`.net` y `.es`). Diluye el SEO y confunde sobre cuál es la tienda oficial.
2. **Categorías duplicadas o con nombres inconsistentes.** Por ejemplo, "Figuras y merchan" y "Merchandising friki y figuras de series", o "tienda-magic-gathering-en-valencia" frente a "comprar-magic-gathering-barato-online" para el mismo tipo de producto.
3. **Títulos y fichas incoherentes.** Una caja de Magic se titula "(English)" mientras su URL dice "castellano".
4. **Contadores que no cuadran:** "más de 300 juegos" frente a 272, o "más de 140 Banpresto" frente a 58 artículos.
5. **URL de filtros enormes, que se indexan** (`/1-inicios?q=Marca-AK+INTERACTIVE-…&page=66`). Es contenido duplicado para Google.
6. **Información clave poco clara o contradictoria:** horario, email, plazo de devolución.
7. **Pre-pedidos agrupados por semanas,** sin explicar cómo funciona una reserva (pago, aviso, envío).

## Lo que no se ha podido verificar

Portada en vivo y su diseño, menú real, buscador, filtros, carrito, checkout, registro e inicio de sesión, formulario de contacto, FAQ, páginas legales completas, métodos de pago, tarifas y plazos de envío, logotipo y colores de marca.
