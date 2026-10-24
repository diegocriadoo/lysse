import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Icon } from "../components/Icon";
import { Breadcrumbs, DemoNote, EmptyState } from "../components/ui";
import { commerce, store } from "../data/store";
import { usePageMeta } from "../hooks/usePageMeta";
import { formatPrice } from "../lib/format";
import { normalize } from "../services/catalog";

const FAQ: { group: string; q: string; a: string }[] = [
  { group: "Envíos", q: "¿A partir de qué importe es gratis el envío?", a: `Los pedidos superiores a ${formatPrice(commerce.freeShippingThreshold)} tienen envío gratuito, tal como indica la web actual.` },
  { group: "Envíos", q: "¿Puedo recoger mi pedido en la tienda?", a: `Sí. Elige «Recogida en tienda» y recógelo en ${store.address.street} (${store.address.city}) sin gastos de envío.` },
  { group: "Envíos", q: "¿Con qué empresa enviáis?", a: "Las condiciones de la web actual mencionan agencia de transportes o Correos. Los plazos y tarifas exactos están pendientes de confirmar." },
  { group: "Pre-pedidos", q: "¿Qué es un pre-pedido?", a: "Es una reserva de un producto que todavía no ha llegado a tienda. Cuando llega, se envía o se prepara para recoger." },
  { group: "Pre-pedidos", q: "¿Cuándo se paga una reserva?", a: "Pendiente de definir con CartoonCorp (pago completo, señal o pago a la llegada). La demo muestra el flujo sin fijar esta condición." },
  { group: "Devoluciones", q: "¿Puedo devolver un producto?", a: `Puedes desistir en ${commerce.withdrawalDays} días naturales desde la recepción, con el producto en perfecto estado y en su embalaje original.` },
  { group: "Devoluciones", q: "¿Quién paga el envío de la devolución?", a: "Según las condiciones públicas actuales, el cliente devuelve el producto a portes pagados. Conviene revisarlo con asesoría legal." },
  { group: "Productos", q: "¿Los productos son originales?", a: "Sí, la tienda trabaja con editoriales y fabricantes oficiales como Norma, Planeta Cómic, Bandai, Banpresto o Funko." },
  { group: "Productos", q: "¿Los Funko son juguetes?", a: "Las fichas indican que algunos artículos están pensados para coleccionistas adultos y no son juguetes." },
  { group: "Cuenta", q: "¿Necesito una cuenta para comprar?", a: "La propuesta permite comprar como invitado y crear la cuenta después, para reducir el abandono del carrito." },
];

export default function FaqPage() {
  usePageMeta("Preguntas frecuentes", "Envíos, recogida en tienda, pre-pedidos, devoluciones y más.");
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const t = normalize(q);
    return t ? FAQ.filter((f) => normalize(`${f.q} ${f.a} ${f.group}`).includes(t)) : FAQ;
  }, [q]);
  const groups = [...new Set(results.map((f) => f.group))];

  return (
    <div className="container page narrow">
      <Breadcrumbs items={[{ label: "Ayuda" }]} />
      <p className="eyebrow">Centro de ayuda</p>
      <h1 className="page-title">Preguntas frecuentes</h1>
      <div className="faq-search">
        <label htmlFor="faq-q" className="sr-only">Buscar en las preguntas frecuentes</label>
        <Icon name="search" />
        <input id="faq-q" type="search" placeholder="Busca: envío, reserva, devolución…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <p className="sr-only" aria-live="polite">{results.length} preguntas encontradas</p>
      {results.length === 0 ? (
        <EmptyState icon="search" title="No hay preguntas que coincidan" action={<Link to="/contacto" className="btn btn--primary">Contactar</Link>}>
          Prueba con otra palabra o escríbenos.
        </EmptyState>
      ) : (
        groups.map((g) => (
          <section key={g} className="faq-group" aria-labelledby={`faq-${g}`}>
            <h2 id={`faq-${g}`} className="section-title section-title--sm">{g}</h2>
            <div className="accordion">
              {results.filter((f) => f.group === g).map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))
      )}
      <DemoNote>Respuestas redactadas a partir de la información pública disponible. Deben validarse con CartoonCorp antes de publicarse.</DemoNote>
    </div>
  );
}
