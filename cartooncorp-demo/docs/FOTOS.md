# Fotos de producto: estado

Generado con `npm run fotos:informe` el 2026-10-25.

**3 de 34 productos reales tienen foto.** 31 pendientes. Los 10 productos de demostración son ficticios: no deben llevar foto de un producto real, sino sustituirse por productos del catálogo de CartoonCorp.

## Fotos integradas y su verificación

| Archivo | Producto | Fuente | Licencia |
|---|---|---|---|
| `33562.webp` | Caja del Funko Pop! Roronoa Zoro nº 327 de One Piece | [Funko](https://funko.com/pop-roronoa-zoro/23191.html) | Imagen oficial del fabricante (funko.com); uso sujeto a autorización como distribuidor |
| `33562__2.webp` | Figura Funko Pop! Roronoa Zoro de One Piece, vista frontal | [Funko](https://funko.com/pop-roronoa-zoro/23191.html) | Imagen oficial del fabricante (funko.com); uso sujeto a autorización como distribuidor |
| `40921.webp` | Figura Funko Pop! Bulbasaur nº 453 de Pokémon | [Funko](https://funko.com/pop-bulbasaur/36237.html) | Imagen oficial del fabricante (funko.com); uso sujeto a autorización como distribuidor |
| `44311.webp` | Caja del Funko Pop! The Thing nº 1516 de The Fantastic Four: First Steps | [Funko](https://funko.com/pop-the-thing-fantastic-four-first-steps/83585.html) | Imagen oficial del fabricante (funko.com); uso sujeto a autorización como distribuidor |
| `44311__2.webp` | Figura Funko Pop! The Thing de The Fantastic Four: First Steps, vista frontal | [Funko](https://funko.com/pop-the-thing-fantastic-four-first-steps/83585.html) | Imagen oficial del fabricante (funko.com); uso sujeto a autorización como distribuidor |

Las tres fotos de Funko proceden de funko.com (buscador oficial; las fichas tienen un desafío anti-bots que no se ha intentado saltar). La correspondencia con el producto de la demo se verificó cruzando el número de artículo de Funko con el número de figura que publican tiendas externas: 36237 = Bulbasaur nº 453, 23191 = Roronoa Zoro nº 327 (el 54462 es otro Zoro y se descartó), 83585 = The Thing nº 1516. Se revisó cada imagen a ojo y se descartó una ilustración ambientada de Bulbasaur que no mostraba el producto tal como se vende. Las imágenes se recortaron, se pasaron a WebP de 900 px y se incrustan en el HTML.

## Fuentes revisadas y no disponibles

- **cartooncorp.es**: su servidor rechaza las peticiones automáticas (403). No se ha intentado saltar esa protección.
- **cartooncorp.net, www.normaeditorial.com, www.planetadelibros.com, Bandai, Wizards of the Coast, Ultra Pro**: no permitidos por la red del entorno de desarrollo (Norma y Planeta redirigen a su dominio con www, que no está en la lista).
- **Wikimedia Commons**: accesible, pero con un límite de peticiones muy estricto (unos 50 s entre consultas). Sólo se completaron 3 búsquedas (los tres Funko), sin resultados; el resto de productos no se llegó a buscar allí.

## Cómo completarlas

1. Consigue la foto con permiso de uso. Lo más directo: las fotos de producto que CartoonCorp ya usa en su tienda (columna "ficha actual"), con su autorización, o el material de prensa de la editorial o el fabricante.
2. Guárdala como `src/assets/productos/<id>.jpg` (más fotos: `<id>__2.jpg`), idealmente 1200×1500 px, producto centrado sobre fondo claro.
3. Anota alt, crédito y licencia en `photoCredits` de `src/data/photos.ts` (la build falla si falta).
4. `npm run build:single` incrusta las fotos en el HTML independiente. Vuelve a ejecutar este informe.

## Productos reales

| Id | Producto | Foto | Origen del producto |
|---|---|---|---|
| `28454` | Choujin X 01 | ⏳ pendiente | [ficha actual](https://cartooncorp.es/comics-manga-seinen/28454-choujin-x-01.html) |
| `38490` | Chainsaw Man 17 | ⏳ pendiente | [ficha actual](https://cartooncorp.es/shonen/38490-chainsaw-man-17.html) |
| `35900` | Kaiju Nº8 09 | ⏳ pendiente | [ficha actual](https://cartooncorp.es/shonen/35900-kaiju-n%C2%BA8-09.html) |
| `14049` | My Hero Academia 15 | ⏳ pendiente | [ficha actual](https://cartooncorp.es/shonen/14049-my-hero-academia-15.html) |
| `14007` | Dragon Ball Ultimate Edition 07 de 34 | ⏳ pendiente | [ficha actual](https://cartooncorp.es/shonen/14007-dragon-ball-ultimate-edition-07-de-34.html) |
| `18599` | Vinland Saga 01 | ⏳ pendiente | [ficha actual](https://cartooncorp.es/comics-manga-seinen/18599-vinland-saga-01.html) |
| `20513` | Akira 05 Edición Original | ⏳ pendiente | [ficha actual](https://cartooncorp.es/comics-manga-seinen/20513-akira-05-edicion-original.html) |
| `34316` | Neon Génesis Evangelion 07 de 07 Edición Coleccionista | ⏳ pendiente | [ficha actual](https://cartooncorp.es/shonen/34316-neon-genesis-evangelion-07-de-07-edicion-coleccionista.html) |
| `38836` | Gintama 03 de 26 | ⏳ pendiente | [ficha actual](https://cartooncorp.es/shonen/38836-gintama-03-de-26.html) |
| `35902` | Lamu 01 de 17 | ⏳ pendiente | [ficha actual](https://cartooncorp.es/shonen/35902-lamu-01-de-17.html) |
| `47963` | Son Goku & Chichi Dragon Ball Ichibansho | ⏳ pendiente | [ficha actual](https://cartooncorp.es/figuras-dragon-ball-y-merchandising-dragon-ball/47963-son-goku-chichi-dragon-ball-ichibansho.html) |
| `23152` | Lunch Dragon Ball Qposket Color A | ⏳ pendiente | [ficha actual](https://cartooncorp.es/figuras-dragon-ball-y-merchandising-dragon-ball/23152-lunch-dragon-ball-qposket-color-a.html) |
| `33309` | Frieza Dragon Ball Z Match Makers | ⏳ pendiente | [ficha actual](https://cartooncorp.es/figuras-dragon-ball-y-merchandising-dragon-ball/33309-frieza-dragon-ball-z-match-makers.html) |
| `40972` | Janemba Dragon Ball Z Match Makers Banpresto | ⏳ pendiente | [ficha actual](https://cartooncorp.es/figuras-dragon-ball-y-merchandising-dragon-ball/40972-janemba-dragon-ball-z-match-makers-banpresto.html) |
| `34609` | Orange Piccolo History Box Vol. 7 Dragon Ball Super: Super Hero | ⏳ pendiente | [ficha actual](https://cartooncorp.es/figuras-dragon-ball-y-merchandising-dragon-ball/34609-orange-piccolo-history-box-vol7-dragon-ball-super-super-hero.html) |
| `23016` | Goku Black WCF Battle of Saiyans Vol. 6 Dragon Ball Super | ⏳ pendiente | [ficha actual](https://cartooncorp.es/figuras-dragon-ball-y-merchandising-dragon-ball/23016-goku-black-wcf-battle-of-saiyans-vol-6-dragon-ball-super.html) |
| `40921` | Funko Pop! Bulbasaur 453 Pokémon | ✅ 40921.webp | [ficha actual](https://cartooncorp.es/funko-pop-manga-y-anime/40921-funko-pop-bulbasaur-453-pok%C3%A9mon.html) |
| `33562` | Funko Pop! Roronoa Zoro 327 One Piece | ✅ 33562.webp, 33562__2.webp | [ficha actual](https://cartooncorp.es/funko-pop-manga-y-anime/33562-funko-pop-roronoa-zoro-327-one-piece.html) |
| `44311` | Funko Pop! The Thing 1516 The Fantastic 4: First Steps | ✅ 44311.webp, 44311__2.webp | [ficha actual](https://cartooncorp.es/funko-pop-superheroes/44311-funko-pop-the-thing-1516-the-fantastic-4-first-steps.html) |
| `40349` | Caja de Sobres de Juego Innistrad Remasterizada (Castellano) – INNR | ⏳ pendiente | [ficha actual](https://cartooncorp.es/tienda-magic-gathering-en-valencia/40349-caja-de-sobres-de-juego-innistrad-remasterizada-magic-the-gathering-castellano-innr.html) |
| `36340` | Caja de Sobres de Juego Horizontes de Modern 3 (Castellano) – MH3 | ⏳ pendiente | [ficha actual](https://cartooncorp.es/tienda-magic-gathering-en-valencia/36340-caja-de-sobres-de-juego-horizontes-de-modern-3-magic-the-gathering-castellano-mtg-mh3.html) |
| `42385` | Caja de Sobres de Juego El Confín de la Eternidad | ⏳ pendiente | [ficha actual](https://cartooncorp.es/tienda-magic-gathering-en-valencia/42385-caja-de-sobres-de-juego-el-conf%C3%ADn-de-la-eternidad-magic-the-gathering-castellano-mtg-edge.html) |
| `29011` | Caja de Sobres de Draft Dominaria Remasterizada (Castellano) | ⏳ pendiente | [ficha actual](https://cartooncorp.es/tienda-magic-gathering-en-valencia/29011--caja-de-sobres-de-draft-dominaria-remasterizada-magic-the-gathering-castellano.html) |
| `25893` | Caja de Sobres de Draft Leyendas de Commander: Batalla por Puerta de Baldur (Castellano) | ⏳ pendiente | [ficha actual](https://cartooncorp.es/tienda-magic-gathering-en-valencia/25893-caja-de-sobres-de-draft-magic-the-gathering-leyendas-de-commander-dungeons-dragons-batalla-por-puerta-de-baldur-castellano.html) |
| `25899` | Caja de Sobres de Edición Leyendas de Commander: Batalla por Puerta de Baldur (Castellano) | ⏳ pendiente | [ficha actual](https://cartooncorp.es/pre-pedidos/25899-caja-de-sobres-de-edici%C3%B3n-magic-the-gathering-leyendas-de-commander-dungeons-dragons-batalla-por-puerta-de-baldur-castellano.html) |
| `23050` | Caja de Sobres de Draft Innistrad: Compromiso Escarlata (Castellano) – VOW | ⏳ pendiente | [ficha actual](https://cartooncorp.es/comprar-magic-gathering-barato-online/23050-caja-de-sobres-de-draft-innistrad-compromiso-escarlata-magic-the-gathering-castellano-mtg-cv.html) |
| `36895` | Caja de Sobres Colección Básica 2021 (Castellano) | ⏳ pendiente | [ficha actual](https://cartooncorp.es/tienda-magic-gathering-en-valencia/36895-caja-de-sobres-colecci%C3%B3n-basica-2021-magic-the-gathering-castellano.html) |
| `3702` | Caja de Sobres Juramento de los Guardianes | ⏳ pendiente | [ficha actual](https://cartooncorp.es/comprar-magic-gathering-barato-online/3702-magic-caja-de-sobres-juramento-de-los-guardianes.html) |
| `8136` | 100 Penny Sleeves Ultra Pro (Fundas) | ⏳ pendiente | [ficha actual](https://cartooncorp.es/fundas-tamano-estandar/8136-100-penny-sleeves-ultra-pro-fundas.html) |
| `42372` | Sabo One Piece TCG Sleeves (70) | ⏳ pendiente | [ficha actual](https://cartooncorp.es/fundas-tamano-estandar/42372-sabo-one-piece-tcg-sleeves-70.html) |
| `40526` | HG Gundam 00 Qan[T] 1/144 | ⏳ pendiente | [ficha actual](https://cartooncorp.es/gundam-model-kits-gunpla/40526-hg-gundam-00-qan-t-1144.html) |
| `7179` | HG Gundam Vual 1/144 | ⏳ pendiente | [ficha actual](https://cartooncorp.es/maquetas/7179-1144-hg-gundam-vual.html) |
| `38119` | BB110 Gouten Gundam | ⏳ pendiente | [ficha actual](https://cartooncorp.es/gundam-model-kits-gunpla/38119-bb110-gouten-gundam.html) |
| `9261` | SD 00 Gundam EX Standard GN-0000 | ⏳ pendiente | [ficha actual](https://cartooncorp.es/gundam-model-kits-gunpla/9261-sd-00-gundam-ex-standard-gn-0000-.html) |

## Productos de demostración (sustituir por productos reales)

| Id | Producto | Foto | |
|---|---|---|---|
| `d-op-01` | Figura Monkey D. Luffy | ⏳ pendiente | — |
| `d-fk-01` | Funko Pop! Frieren | ⏳ pendiente | — |
| `d-fk-02` | Funko Pop! Games | ⏳ pendiente | — |
| `d-fk-03` | Funko Pop! Cine y series | ⏳ pendiente | — |
| `d-pk-01` | Sobre de ampliación Pokémon JCC | ⏳ pendiente | — |
| `d-op-tcg-01` | Sobre One Piece Card Game | ⏳ pendiente | — |
| `d-ac-01` | Tapete de juego | ⏳ pendiente | — |
| `d-pt-01` | Set de pinceles para modelismo | ⏳ pendiente | — |
| `d-jm-01` | Juego de mesa familiar | ⏳ pendiente | — |
| `d-pz-01` | Puzzle 1000 piezas | ⏳ pendiente | — |
