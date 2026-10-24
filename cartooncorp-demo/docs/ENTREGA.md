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

- **Catálogo completo.** La demo tiene 45 productos: 35 con nombre real y 26 de ellos también con precio observado, más 10 productos ficticios marcados "(producto de demostración)".
- **Precios.** Hay que confirmar los observados y sustituir los de demostración.
- **Stock y disponibilidad.** Son simulados, salvo 2 casos observados.
- **Fotografías de producto.** Ahora son ilustraciones SVG generadas. El campo `images[].src` ya está preparado para poner la foto real.
- **Logotipo y colores de marca.** El logotipo es una propuesta (`src/components/Logo.tsx`).
- **Tarifas y plazos de envío.** Los 4,95 € son un valor de demostración.
- **Formas de pago y condiciones de los pre-pedidos.**
- **Horario, email oficial, razón social, CIF y textos legales.**
- **Artículos del blog** (ahora son tres textos de ejemplo).
- **Orden de "Novedades"** (`addedAt` es una fecha interna de la demo).

## 4. Limitaciones por no tener acceso al sistema original

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
