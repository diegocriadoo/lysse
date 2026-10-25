# Entrega: propuesta de rediseño de CartoonCorp

## 1. Qué es

Una tienda online **nueva e independiente**, navegable de principio a fin, para enseñar al propietario cómo quedaría su tienda tras una renovación completa.

No usa el código, la base de datos ni el panel de la tienda actual, y no está conectada a ellos. Tampoco cobra ni genera pedidos reales.

## 2. Funcionalidades implementadas (probadas en `tests/e2e/run.mjs`)

**Navegación**
- Cabecera fija con un aviso de envío gratis y de demo.
- Menú de categorías desplegable en escritorio, que funciona con ratón, clic y teclado.
- Menú lateral en móvil con subcategorías plegables.
- Migas de pan.
- Página 404 con buscador.

**Búsqueda**
- Sugerencias en vivo con miniatura y precio, siguiendo el patrón *combobox* accesible (flechas, Enter, Escape).
- Búsquedas populares.
- Página de resultados ordenada por relevancia.
- Búsqueda tolerante a tildes y mayúsculas.

**Catálogo**
- Rutas para categorías, subcategorías, todo el catálogo, novedades, ofertas y pre-pedidos.
- Filtros por disponibilidad, precio, ofertas, licencia y editorial/fabricante, con contadores.
- Chips con los filtros activos y botón para limpiarlos.
- Orden por relevancia, novedades, precio y nombre.
- Contador de resultados y paginación con enlaces reales.
- Todo el estado queda en la URL, así que se puede compartir.
- Esqueletos de carga, estado vacío y estado de error con reintento.
- En móvil, los filtros se abren en una hoja inferior.

**Ficha de producto**
- Galería con tres vistas.
- Precio, y precio tachado con % de descuento solo cuando el precio anterior es real.
- Disponibilidad: disponible, pre-pedido o agotado.
- Variantes con precio y stock propios.
- Selector de cantidad y botón de añadir o reservar.
- Información de envío y devoluciones, características y relacionados.
- Origen de los datos de la ficha y enlace a la ficha actual.
- Barra fija de compra en móvil.
- Datos estructurados `Product` (JSON-LD).

**Carrito**
- Carrito lateral y página de carrito.
- Modificar cantidades, eliminar con opción de deshacer y vaciar.
- Barra de progreso hacia el envío gratis.
- Importes calculados en céntimos.
- El carrito se guarda en `localStorage` y se sincroniza entre pestañas.

**Checkout de demostración**
- Tres pasos: contacto, entrega y pago simulado.
- Validación de email, teléfono español, código postal y provincia.
- Envío a domicilio o recogida gratis.
- Al fallar la validación, el foco va al primer error.
- Confirmación etiquetada como "pedido de demostración".
- No se piden datos de tarjeta.

**Cuenta demo**
- Acceso sin contraseña (solo nombre y email en el navegador).
- Historial de pedidos de prueba.

**Páginas secundarias**
- Contacto con formulario validado.
- Tienda física.
- FAQ con buscador.
- Envíos, devoluciones y cuatro páginas legales con estructura preparada.
- Noticias y artículo.
- "Sobre esta demo", que separa lo verificado de lo propuesto.

**Notificaciones (toasts)**
- Aparecen al añadir, eliminar o deshacer, en suscripción y en errores, con región `aria-live`.

**Accesibilidad**
- Enlace para saltar al contenido.
- Foco gestionado al cambiar de página y en los modales (trampa de foco, Escape, devolución del foco).
- Etiquetas en todos los controles.
- Objetivos táctiles de al menos 40–44 px.
- Respeta `prefers-reduced-motion`.

**SEO básico**
- Título, descripción, Open Graph y *canonical* por página.
- JSON-LD `Store` y `Product`.
- `noindex` y `robots.txt` cerrados a propósito, porque es una demo con la marca del cliente.

## 3. Elementos demostrativos que necesitan datos reales del cliente

- **Catálogo completo.** La demo tiene 44 productos: 34 con nombre real y 25 de ellos también con precio observado, más 10 productos ficticios con la etiqueta "Producto demo".
- **Precios.** Hay que confirmar los observados y sustituir los de demostración.
- **Stock y disponibilidad.** Son simulados, salvo 2 casos observados.
- **Fotografías de producto.** Ahora son ilustraciones provisionales, marcadas como tales. Para añadir las fotos reales ver la sección 7.
- **Logotipo y colores de marca.** El logotipo es una propuesta (`src/components/Logo.tsx`).
- **Tarifas y plazos de envío.** Los 4,95 € son un valor de demostración.
- **Formas de pago y condiciones de los pre-pedidos.**
- **Horario, email oficial, razón social, CIF y textos legales.**
- **Artículos del blog** (ahora son tres textos de ejemplo).
- **Orden de "Novedades"** (`addedAt` es una fecha interna de la demo).

## 4. Limitaciones por no tener acceso al sistema original

- No se han podido incluir fotos reales de producto: el entorno de desarrollo bloquea los bancos de imágenes con licencia abierta (Wikimedia Commons, Openverse, Flickr, Unsplash) y la web de CartoonCorp. No se ha usado ninguna imagen cuya licencia no se haya podido comprobar.

- No se pudo abrir la web actual desde el entorno, porque la red bloqueaba el dominio. La investigación se basa en páginas indexadas (ver `INVESTIGACION.md`).
- Sin acceso a PrestaShop no hay catálogo completo, stock real, clientes, pedidos, reglas de precios ni promociones.
- No se ha podido comparar con el carrito, el checkout ni el registro actuales.
- Tampoco se han podido medir el rendimiento ni la analítica de la web actual.

## 5. Requisitos para convertirla en una tienda de producción

1. **Backend de e-commerce.** Opciones: mantener PrestaShop en modo *headless* (Webservice API), migrar a Shopify (Storefront API) o usar otra plataforma. La interfaz solo depende de `src/services/catalog.ts`, `cart.ts` y `orders.ts`.
2. **Pasarela de pago real** (Redsys, Bizum, Stripe o PayPal) con PSD2/3-D Secure.
3. **Inventario y pedidos sincronizados** con el TPV de la tienda física.
4. **Cuentas de cliente con autenticación real,** recuperación de contraseña y RGPD.
5. **Renderizado en servidor (SSR/SSG)** para SEO, por ejemplo Next.js o Astro con la misma interfaz. También URLs canónicas y redirecciones 301 desde las URLs actuales, y unificar los dominios `.net` y `.es`.
6. **Fotografía de producto** con derechos de uso, CDN de imágenes y formatos AVIF/WebP.
7. **Textos legales revisados,** banner de cookies si se añade analítica, y política de devoluciones de 14 días.
8. **Emails transaccionales,** avisos de reposición y gestión de reservas.
9. **Analítica y medición de conversión.**

## 6. Siguientes pasos propuestos

1. **Reunión de validación** con el propietario: identidad visual, secciones, condiciones comerciales y lo que hay en "por confirmar".
2. **Exportar el catálogo** desde PrestaShop (CSV o API) y escribir un adaptador al modelo `Product` de `src/data/types.ts`.
3. **Decidir la plataforma** (headless PrestaShop o migración) según coste, volumen de catálogo y TPV.
4. **Integrar el CMS** para portada, banners, blog y páginas legales (por ejemplo, Sanity, Strapi o el propio CMS de la plataforma).
5. **Integrar pagos, stock y pedidos;** primero en un entorno de pruebas y luego en producción.
6. **Migrar SEO:** mapa de redirecciones, sitemap y Search Console.
7. **Lanzamiento por fases:** tienda nueva en un subdominio, pruebas con clientes habituales y cambio de dominio.

## 7. Imágenes: cómo sustituir las ilustraciones por fotos

Cada producto muestra una ilustración provisional ("packshot" dibujado con el color de su licencia), marcada con "Ilustración provisional" en tarjetas y fichas. No imita portadas ni logotipos reales.

Para poner fotos reales:

1. Copia cada foto a `public/productos/<id>.webp`. Recomendado: 1200×1500 px (4:5), producto centrado sobre fondo claro y uniforme.
2. Regístrala en `src/data/photos.ts` con su texto alternativo, crédito y licencia. La ficha muestra el crédito automáticamente.
3. Si un producto tiene varias fotos, la ficha muestra una miniatura por foto.

Si una foto no carga, se vuelve a mostrar la ilustración (comprobado con una foto válida, una rota y una galería mixta).

Fuentes recomendadas, por orden: fotos propias de CartoonCorp o las que ya usa en su web (las tiene el cliente), material de prensa de editoriales y fabricantes con permiso para distribuidores, y bancos con licencia abierta revisando cada licencia.

## 8. Segunda iteración de calidad (cambios)

**Imágenes**
- Ilustraciones rehechas como fotos de producto de estudio: volumen (frontal, lateral y tapa), luz cenital y sombra de contacto, mismo fondo en todos los productos. Encuadre vertical para tarjetas y panorámico para mosaicos.
- Componente `ProductMedia`: usa la foto real si existe y la ilustración si falta o falla.

**Portada**
- Franja de ventajas (envío, recogida, producto oficial, atención) justo bajo el hero.
- Categorías con imagen de un producto real de cada sección.
- "Novedades" y "Descubre" unidas en una sola sección con pestañas (Todo, Manga, Figuras, Cartas, Gunpla).
- Ajustes del hero en móvil: botones en una fila y precios sin tapar las imágenes.

**Catálogo y fichas**
- Tarjetas con botón de compra con texto ("Añadir", "Reservar", "Elegir opción", "Sin stock"), % de descuento real y etiqueta "Producto demo" uniforme. Los nombres de productos demo ya no llevan sufijo.
- Fichas con indicador del origen del precio (observado o de demostración), importe ahorrado en ofertas, tres características clave a la vista y relacionados que siempre completan la fila.
- Barra de orden y filtros reorganizada en móvil.
- Checkout sin newsletter; etiqueta "Producto demo" también en carrito y resumen del pedido.

**Errores corregidos**
- La barra de compra fija en móvil no aparecía si se bajaba de golpe por la página (usaba `IntersectionObserver`, que no detecta saltos de scroll).
- Las etiquetas "Pre-pedido" y "Producto demo" se solapaban en tarjetas estrechas.
- El contador del carrito tapaba el importe en la cabecera.
- El icono de "Abrir en el mapa" saltaba de línea.
- La documentación decía 45 productos; son 44 (34 con nombre observado, 25 con precio observado).

**Validación**
- `npm test`: 28 pruebas unitarias en verde.
- `npm run test:e2e`: todos los recorridos en verde, incluidos los nuevos de barra fija, solape de etiquetas y tamaño de botones táctiles.
- Revisión visual en capturas de portada, catálogo, fichas, carrito y checkout (escritorio 1440 px y móvil 390 px) y de las páginas secundarias en móvil. Las 27 rutas se comprueban automáticamente (h1, sin errores de consola, sin desbordamiento) en ambos tamaños. No se ha probado en tablet ni en navegadores distintos de Chromium.

**Pendiente**
- Fotos reales de producto (sección 7).
- Prueba en Safari/iOS y en tablet.
- Las páginas legales siguen siendo plantillas.

## 9. Tercera iteración: portada y presentación comercial

Archivo entregable: `entregas/cartooncorp-demo-v3.html` (se abre con doble clic, sin servidor). La versión anterior se conserva intacta en `entregas/cartooncorp-demo-v2-original.html` y en la etiqueta git `demo-v2`.

**Cambios**
- **Hero:** las viñetas se sustituyen por una vitrina editorial. Los productos aparecen iluminados sobre el fondo oscuro, con etiqueta de nombre y precio, y una nota visible de "ilustraciones provisionales". Botones "Explorar novedades" y "Descubrir categorías"; el segundo desplaza la página hasta las categorías y les pasa el foco.
- **Accesos:** cuatro accesos grandes con imagen (Manga, Figuras, Cartas coleccionables, Pre-pedidos) y accesos secundarios a Funko, Modelismo, Juegos y Ofertas con su número de productos.
- **Destacados:** nueva sección con productos de datos observados (sin productos demo).
- **Banda de Magic eliminada** para reducir saturación; las ofertas siguen en el menú, en los accesos y en las etiquetas de descuento de las tarjetas.
- **Ficha:** la tarifa de envío a domicilio se muestra como "tarifa orientativa de la demo".
- **Detalles:** radios más contenidos (10 px en tarjetas, 14 px en bloques), los botones del hero se apilan por debajo de 400 px y la marca de "ilustración provisional" se acorta a "provisional" en tarjetas estrechas.
- **Estilos sin uso eliminados** (viñetas antiguas, banda de ofertas).

**Probado (automático, `npm run test:e2e`)**
- Las 27 rutas, a 1440 px, 820 px (tablet), 390 px y 360 px: cargan con título, sin errores de consola y sin desbordamiento horizontal.
- 88 enlaces internos sin errores.
- Buscador con sugerencias, búsqueda con y sin resultados, filtros, orden por precio, paginación.
- Carrito: añadir, cantidades, eliminar y deshacer, persistencia al recargar y cálculo de totales.
- Checkout: validaciones, envío o recogida, aceptación de condiciones y confirmación marcada como demostración.
- Menú móvil con Escape, filtros en móvil, barra de compra fija, solape de etiquetas, tamaño de botones táctiles, formulario de contacto y "Descubrir categorías".
- Unitarias (`npm test`): 28 pruebas.

**Revisado visualmente (capturas)**
- Portada a 1440, 820 y 360 px.
- Categoría, ficha, carrito y checkout a 1440 y 360 px.

**No probado**
- Safari/iOS y Firefox (solo Chromium).
- Lectores de pantalla reales.

**Sigue siendo provisional**
- Fotos de producto (bloqueado: este entorno no tiene acceso a ningún banco de imágenes ni a la web de la tienda).
- Logotipo.
- Tarifa y plazos de envío.
- Condiciones de pre-pedido.
- Horario y email.
- Textos legales.
- Artículos del blog.
- 10 productos demo.
- Precios de 9 productos con nombre real.
