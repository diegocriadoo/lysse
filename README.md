# Lyssé — tema de Shopify

Código del tema de [lyssestyle.com](https://lyssestyle.com) (Shopify Online Store 2.0, sin dependencias ni compilación).

- `layout/` — plantilla base (`theme.liquid`) y página con contraseña.
- `sections/`, `snippets/`, `templates/` — landing, ficha de producto, carrito, etc.
- `assets/` — `base.css`, `theme.js` y fuentes `.woff2` alojadas en la tienda. Las imágenes `.webp` del tema no están en el repositorio.
- `locales/es.default.json` — todos los textos de la interfaz.

## Sincronizar con la tienda

Recomendado: conectar este repositorio desde **Tienda online → Temas → Añadir tema → Conectar desde GitHub**. Shopify crea un tema vinculado a una rama y cada cambio en el editor se guarda como commit (y al revés).

Alternativa con Shopify CLI:

```sh
shopify theme pull --store wyn1uh-4x.myshopify.com   # bajar cambios hechos en el editor
shopify theme push --store wyn1uh-4x.myshopify.com --unpublished   # subir como tema nuevo sin publicar
```
