import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { Icon } from "../components/Icon";
import { Breadcrumbs, DemoNote, Field, describe } from "../components/ui";
import { store } from "../data/store";
import { usePageMeta } from "../hooks/usePageMeta";
import { email, minLength, required, validate } from "../services/validation";

const TOPICS = ["Estado de un pedido", "Reservas y pre-pedidos", "Disponibilidad de un producto", "Devoluciones", "Torneos y eventos", "Otro"];

type Values = { name: string; email: string; topic: string; order: string; message: string };

export default function ContactPage() {
  usePageMeta("Contacto", "Escríbenos o llámanos: te ayudamos con pedidos, reservas y disponibilidad.");
  const [values, setValues] = useState<Values>({ name: "", email: "", topic: "", order: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Values | "privacy", string>>>({});
  const [privacy, setPrivacy] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const set = (k: keyof Values) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = validate(values, {
      name: [required()],
      email: [required(), email],
      topic: [required("Elige un motivo.")],
      message: [required(), minLength(10, "Cuéntanos un poco más (mínimo 10 caracteres).")],
    });
    if (!privacy) errs.privacy = "Debes aceptar la política de privacidad.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>('.contact__form [aria-invalid="true"]')?.focus());
      return;
    }
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 700);
  };

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: "Contacto" }]} />
      <div className="contact">
        <div className="contact__info">
          <p className="eyebrow">Atención al cliente</p>
          <h1 className="page-title">Hablemos</h1>
          <p>¿Dudas con un pedido, una reserva o buscas algo que no ves en la web? Escríbenos o pásate por la tienda.</p>
          <ul className="contact__list">
            <li><Icon name="phone" /><div><strong>Teléfono</strong><a href={store.phone.href}>{store.phone.display}</a></div></li>
            <li><Icon name="mail" /><div><strong>Email</strong><a href={store.email.href}>{store.email.display}</a><small className="muted">Dirección por confirmar con el cliente</small></div></li>
            <li><Icon name="pin" /><div><strong>Tienda</strong><span>{store.address.street}, {store.address.postalCode} {store.address.city}</span><Link to="/tienda-fisica">Cómo llegar</Link></div></li>
          </ul>
        </div>

        <div className="card-panel contact__form">
          {status === "sent" ? (
            <div className="contact__sent" role="status">
              <span className="order__check"><Icon name="check" /></span>
              <h2 className="section-title section-title--sm">Mensaje simulado enviado</h2>
              <p>En la demo el formulario no envía nada. En producción, el mensaje llegaría al email de la tienda o a su herramienta de atención al cliente.</p>
              <button type="button" className="btn btn--ghost" onClick={() => { setStatus("idle"); setValues({ name: "", email: "", topic: "", order: "", message: "" }); setPrivacy(false); }}>
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="form-grid form-grid--2">
                <Field id="c-name" label="Nombre" error={errors.name}>
                  <input type="text" autoComplete="name" value={values.name} onChange={set("name")} {...describe("c-name", errors.name)} />
                </Field>
                <Field id="c-email" label="Email" error={errors.email}>
                  <input type="email" spellCheck={false} autoComplete="email" value={values.email} onChange={set("email")} {...describe("c-email", errors.email)} />
                </Field>
                <Field id="c-topic" label="Motivo" error={errors.topic}>
                  <select value={values.topic} onChange={set("topic")} {...describe("c-topic", errors.topic)}>
                    <option value="">Elige…</option>
                    {TOPICS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </Field>
                <Field id="c-order" label="Nº de pedido" optional>
                  <input type="text" value={values.order} onChange={set("order")} {...describe("c-order")} />
                </Field>
              </div>
              <Field id="c-message" label="Mensaje" error={errors.message}>
                <textarea rows={5} value={values.message} onChange={set("message")} {...describe("c-message", errors.message)} />
              </Field>
              <div className={`field ${errors.privacy ? "field--error" : ""}`}>
                <label className="check check--block">
                  <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} aria-invalid={errors.privacy ? true : undefined} aria-describedby={errors.privacy ? "c-privacy-error" : undefined} />
                  <span>Acepto la <Link to="/legal/privacidad">política de privacidad</Link>.</span>
                </label>
                {errors.privacy && <p id="c-privacy-error" className="field__error" role="alert"><Icon name="alert" /> {errors.privacy}</p>}
              </div>
              <DemoNote>Formulario de demostración: no se envía ni se guarda ningún dato.</DemoNote>
              <button type="submit" className="btn btn--primary" disabled={status === "sending"}>
                {status === "sending" ? <><span className="spinner" aria-hidden="true" /> Enviando…</> : "Enviar mensaje"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
