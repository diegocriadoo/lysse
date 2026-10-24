import { Link, useParams } from "react-router";
import { Icon } from "../components/Icon";
import { Breadcrumbs, DemoNote } from "../components/ui";
import { commerce, store } from "../data/store";
import { usePageMeta } from "../hooks/usePageMeta";
import { formatPrice } from "../lib/format";
import { NotFoundPage } from "./NotFoundPage";

interface InfoDoc {
  title: string;
  description: string;
  eyebrow: string;
  status: "verified" | "template";
  sections: { heading: string; body: string[] }[];
}

const DOCS: Record<string, InfoDoc> = {
  envios: {
    title: "Envíos y recogida",
    eyebrow: "Ayuda",
    description: "Métodos de entrega, envío gratis y recogida en tienda.",
    status: "verified",
    sections: [
      { heading: "Envío gratis", body: [`Los pedidos superiores a ${formatPrice(commerce.freeShippingThreshold)} tienen envío gratuito (dato visible en las fichas de la web actual).`] },
      { heading: "Recogida en tienda", body: [`Puedes recoger tu pedido sin gastos en ${store.address.street}, ${store.address.postalCode} ${store.address.city}.`] },
      { heading: "Envío a domicilio", body: ["Las condiciones actuales mencionan envío por agencia de transportes o Correos. La tarifa que se muestra en la demo es provisional; los plazos de entrega reales deben confirmarse."] },
      { heading: "Pre-pedidos", body: ["Los productos en reserva se envían cuando llegan a tienda. Falta definir cómo se gestionan los pedidos mixtos (disponibles + reservas)."] },
    ],
  },
  devoluciones: {
    title: "Devoluciones",
    eyebrow: "Ayuda",
    description: "Cómo devolver un producto y plazos de desistimiento.",
    status: "verified",
    sections: [
      { heading: "Plazo", body: [`Dispones de ${commerce.withdrawalDays} días naturales desde la recepción para desistir de la compra.`, "Nota para el cliente: cartooncorp.net menciona 14 días y cartooncorp.es 7 días. La normativa de consumo española fija un mínimo de 14 días para ventas a distancia a consumidores, por lo que la demo usa 14."] },
      { heading: "Estado del producto", body: ["El producto debe estar en perfecto estado y en su embalaje original."] },
      { heading: "Gastos", body: ["Según las condiciones actuales, la devolución se realiza a portes pagados por el cliente y se reembolsa el importe del producto."] },
      { heading: "Cómo solicitarla", body: ["Escríbenos desde el formulario de contacto indicando el número de pedido. En producción, este paso puede automatizarse desde la cuenta de cliente."] },
    ],
  },
  "aviso-legal": {
    title: "Aviso legal",
    eyebrow: "Legal",
    description: "Información legal del titular de la web.",
    status: "template",
    sections: [{ heading: "Titular", body: [`Razón social: ${store.legalName}. CIF, domicilio social y datos registrales: pendientes de facilitar por el cliente.`] }],
  },
  privacidad: {
    title: "Política de privacidad",
    eyebrow: "Legal",
    description: "Tratamiento de datos personales.",
    status: "template",
    sections: [
      { heading: "Esta demo", body: ["La demo no envía datos a ningún servidor. El carrito, la cuenta de demostración y los pedidos de prueba se guardan sólo en el almacenamiento local de tu navegador y puedes borrarlos limpiando los datos del sitio."] },
      { heading: "Versión de producción", body: ["El texto definitivo (responsable, finalidades, base legal, conservación, derechos) debe redactarlo o revisarlo la asesoría legal de CartoonCorp."] },
    ],
  },
  cookies: {
    title: "Política de cookies",
    eyebrow: "Legal",
    description: "Uso de cookies y almacenamiento local.",
    status: "template",
    sections: [{ heading: "Esta demo", body: ["No usa cookies de terceros ni analítica. Sólo usa almacenamiento local técnico para el carrito y la cuenta de demostración. En producción habrá que añadir un banner de consentimiento si se incorporan analítica o publicidad."] }],
  },
  condiciones: {
    title: "Condiciones de venta",
    eyebrow: "Legal",
    description: "Condiciones generales de contratación.",
    status: "template",
    sections: [
      { heading: "Precios", body: ["Los precios incluyen IVA. Los gastos de envío no están incluidos y se muestran antes de confirmar el pedido."] },
      { heading: "Formas de entrega", body: ["Agencia de transportes, Correos o recogida en tienda sin gastos de envío."] },
      { heading: "Desistimiento", body: [`${commerce.withdrawalDays} días naturales. Ver la página de devoluciones.`] },
      { heading: "Texto definitivo", body: ["Este resumen procede de las condiciones públicas actuales y debe sustituirse por el texto legal revisado."] },
    ],
  },
};

export default function InfoPage({ page }: { page?: string }) {
  const params = useParams();
  const slug = page ?? params.slug ?? "";
  const doc = DOCS[slug];
  usePageMeta(doc?.title ?? "No encontrado", doc?.description);
  if (!doc) return <NotFoundPage />;
  return (
    <div className="container page narrow">
      <Breadcrumbs items={[{ label: doc.title }]} />
      <p className="eyebrow">{doc.eyebrow}</p>
      <h1 className="page-title">{doc.title}</h1>
      {doc.status === "template" ? (
        <DemoNote tone="warn">Página de propuesta: estructura preparada, contenido legal pendiente de facilitar por CartoonCorp.</DemoNote>
      ) : (
        <DemoNote>Contenido basado en la información pública de la web actual. Debe validarse con CartoonCorp.</DemoNote>
      )}
      <div className="prose">
        {doc.sections.map((s) => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            {s.body.map((b, i) => <p key={i}>{b}</p>)}
          </section>
        ))}
      </div>
      <p className="center">
        <Link to="/contacto" className="btn btn--ghost"><Icon name="mail" /> ¿Más dudas? Contacta</Link>
      </p>
    </div>
  );
}
