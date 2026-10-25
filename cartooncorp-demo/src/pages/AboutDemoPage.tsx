import { Link } from "react-router";
import { Breadcrumbs } from "../components/ui";
import { products } from "../data/products";
import { usePageMeta } from "../hooks/usePageMeta";

const PAGES: { path: string; label: string; status: "verificada" | "propuesta" }[] = [
  { path: "/", label: "Inicio", status: "verificada" },
  { path: "/categoria/manga", label: "Categorías y subcategorías", status: "verificada" },
  { path: "/producto/chainsaw-man-17-38490", label: "Ficha de producto", status: "verificada" },
  { path: "/buscar?q=dragon", label: "Búsqueda", status: "verificada" },
  { path: "/preventas", label: "Pre-pedidos", status: "verificada" },
  { path: "/ofertas", label: "Ofertas", status: "verificada" },
  { path: "/tienda-fisica", label: "Tienda física", status: "verificada" },
  { path: "/envios", label: "Envíos y recogida", status: "verificada" },
  { path: "/devoluciones", label: "Devoluciones", status: "verificada" },
  { path: "/novedades", label: "Novedades", status: "verificada" },
  { path: "/carrito", label: "Carrito", status: "propuesta" },
  { path: "/checkout", label: "Checkout de demostración", status: "propuesta" },
  { path: "/cuenta", label: "Cuenta de cliente (demo)", status: "propuesta" },
  { path: "/contacto", label: "Contacto con formulario", status: "propuesta" },
  { path: "/ayuda", label: "Preguntas frecuentes", status: "propuesta" },
  { path: "/noticias", label: "Noticias y guías", status: "propuesta" },
  { path: "/legal/aviso-legal", label: "Páginas legales", status: "propuesta" },
];

export default function AboutDemoPage() {
  usePageMeta("Sobre esta demo", "Qué es real y qué es simulado en esta propuesta de rediseño.");
  const observed = products.filter((p) => p.source.name === "observed").length;
  const observedPrice = products.filter((p) => p.source.price === "observed").length;
  return (
    <div className="container page narrow">
      <Breadcrumbs items={[{ label: "Sobre esta demo" }]} />
      <p className="eyebrow">Transparencia</p>
      <h1 className="page-title">Sobre esta demo</h1>
      <div className="prose">
        <p className="lead">
          Esto es una <strong>propuesta de rediseño</strong> de la tienda online de CartoonCorp, construida desde cero como proyecto independiente. No está conectada al sistema, al inventario, a los pedidos ni a los pagos de la tienda.
        </p>
        <h2>Qué es real y qué es simulado</h2>
        <ul>
          <li><strong>{observed} de {products.length} productos</strong> usan nombres vistos en la web pública; {observedPrice} de ellos también su precio (consulta de octubre de 2026, puede haber cambiado).</li>
          <li>Los productos con la etiqueta <em>«Producto demo»</em> son ficticios y sirven para mostrar secciones o estados (agotado, pre-pedido, variantes). Cada ficha indica además si su precio es el observado en la web actual o uno de demostración.</li>
          <li>Sólo se muestran precios tachados cuando el precio anterior se vio en la web actual.</li>
          <li>La disponibilidad es simulada salvo dos casos observados.</li>
          <li>Las imágenes son ilustraciones provisionales generadas para la demo; el logotipo es una propuesta y no el oficial.</li>
          <li>El carrito, la cuenta y los pedidos de prueba viven sólo en tu navegador. No se cobra nada ni se envía ningún dato.</li>
          <li>Datos de contacto (dirección y teléfono) obtenidos de fuentes públicas; el email y el horario están pendientes de confirmar.</li>
        </ul>
        <h2>Páginas de la demo</h2>
        <p>«Verificada» significa que la sección existe en la web actual (según las páginas públicas consultadas). «Propuesta» significa que se ha diseñado sin poder inspeccionar la original.</p>
      </div>
      <div className="table-wrap">
        <table className="table">
          <caption className="sr-only">Páginas de la demo y su origen</caption>
          <thead>
            <tr><th scope="col">Página</th><th scope="col">Origen</th></tr>
          </thead>
          <tbody>
            {PAGES.map((p) => (
              <tr key={p.path}>
                <th scope="row"><Link to={p.path}>{p.label}</Link></th>
                <td><span className={`pill pill--${p.status}`}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
