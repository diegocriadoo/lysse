import { useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Icon } from "../components/Icon";
import { ProductArt } from "../components/ProductArt";
import { DemoNote, EmptyState, Field, describe } from "../components/ui";
import { commerce, store, type ShippingMethodId } from "../data/store";
import { usePageMeta } from "../hooks/usePageMeta";
import { formatPrice } from "../lib/format";
import { computeTotals } from "../services/cart";
import { placeDemoOrder } from "../services/orders";
import { email, minLength, phoneES, postalCodeES, required, validate } from "../services/validation";
import { useAccount } from "../state/AccountContext";
import { useCart } from "../state/CartContext";

const STEPS = ["Contacto", "Entrega", "Pago"] as const;

const PAYMENTS = [
  { id: "card", label: "Tarjeta (simulada)", text: "En producción, pasarela de pago (Redsys, Stripe…). Aquí no se piden datos de tarjeta." },
  { id: "bizum", label: "Bizum (simulado)", text: "Método habitual en España; requiere integrarlo con la entidad bancaria." },
  { id: "store", label: "Pagar al recoger en tienda", text: "Sólo disponible con recogida en tienda. Condición por confirmar con CartoonCorp.", pickupOnly: true },
];

type Values = {
  email: string;
  name: string;
  phone: string;
  street: string;
  postalCode: string;
  city: string;
  province: string;
  notes: string;
};

export default function CheckoutPage() {
  usePageMeta("Checkout de demostración", "Simulación del proceso de compra. No se generan pedidos ni cargos reales.", undefined, { noindex: true });
  const { lines, clear } = useCart();
  const { user } = useAccount();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>({ email: user?.email ?? "", name: user?.name ?? "", phone: "", street: "", postalCode: "", city: "", province: "", notes: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Values | "terms" | "payment", string>>>({});
  const [method, setMethod] = useState<ShippingMethodId>("standard");
  const [payment, setPayment] = useState("card");
  const [terms, setTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const totals = useMemo(() => computeTotals(lines, method), [lines, method]);
  const hasPreorder = lines.some((l) => l.availability === "preorder");

  if (lines.length === 0 && !submitting) {
    return (
      <div className="container page">
        <EmptyState as="h1" icon="cart" title="No hay nada que pagar todavía" action={<Link to="/tienda" className="btn btn--primary">Ir a la tienda</Link>}>
          Añade algún producto al carrito para probar el checkout de demostración.
        </EmptyState>
      </div>
    );
  }

  const set = (k: keyof Values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const focusFirstError = () =>
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], .field--error input')?.focus());

  const validateStep = (s: number) => {
    let errs: typeof errors = {};
    if (s === 0) errs = validate(values, { email: [required(), email], name: [required(), minLength(2)], phone: [required(), phoneES] });
    if (s === 1 && method === "standard")
      errs = validate(values, { street: [required(), minLength(5, "Indica calle y número.")], postalCode: [required(), postalCodeES], city: [required()], province: [required("Elige una provincia.")] });
    if (s === 2) {
      if (!terms) errs.terms = "Debes aceptar las condiciones para continuar.";
      const p = PAYMENTS.find((x) => x.id === payment);
      if (p?.pickupOnly && method !== "pickup") errs.payment = "Este método sólo está disponible con recogida en tienda.";
    }
    setErrors(errs);
    if (Object.keys(errs).length) focusFirstError();
    return Object.keys(errs).length === 0;
  };

  const next = (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      requestAnimationFrame(() => document.getElementById("checkout-step-title")?.focus());
      return;
    }
    submit();
  };

  const submit = async () => {
    setSubmitting(true);
    const order = await placeDemoOrder({
      email: values.email.trim(),
      name: values.name.trim(),
      shippingMethod: method,
      address: method === "standard" ? `${values.street}, ${values.postalCode} ${values.city} (${values.province})` : `${store.address.street}, ${store.address.city}`,
      paymentMethod: PAYMENTS.find((p) => p.id === payment)!.label,
      lines,
      totals,
    });
    clear();
    navigate(`/pedido/${order.id}`, { replace: true, state: { order } });
  };

  return (
    <div className="container page checkout">
      <div className="checkout__banner" role="note">
        <Icon name="info" />
        <p>
          <strong>Checkout de demostración.</strong> No se procesa ningún pago, no se genera ningún pedido real y no se envía ningún dato a CartoonCorp ni a terceros.
        </p>
      </div>

      <ol className="stepper-nav" aria-label="Pasos del pedido">
        {STEPS.map((s, i) => (
          <li key={s} className={i === step ? "is-current" : i < step ? "is-done" : ""} aria-current={i === step ? "step" : undefined}>
            {i < step ? (
              <button type="button" onClick={() => setStep(i)}>
                <span className="stepper-nav__n"><Icon name="check" /></span> {s}
              </button>
            ) : (
              <span>
                <span className="stepper-nav__n">{i + 1}</span> {s}
              </span>
            )}
          </li>
        ))}
      </ol>

      <div className="checkout__grid">
        <form ref={formRef} className="checkout__form" onSubmit={next} noValidate>
          <h1 id="checkout-step-title" className="page-title page-title--sm" tabIndex={-1}>
            {step === 0 && "¿Cómo te contactamos?"}
            {step === 1 && "¿Cómo quieres recibirlo?"}
            {step === 2 && "Revisa y confirma"}
          </h1>

          {step === 0 && (
            <div className="form-grid">
              <Field id="email" label="Email" error={errors.email} hint="Te enviaríamos aquí la confirmación del pedido.">
                <input type="email" spellCheck={false} autoComplete="email" value={values.email} onChange={set("email")} {...describe("email", errors.email, "x")} />
              </Field>
              <Field id="name" label="Nombre y apellidos" error={errors.name}>
                <input type="text" autoComplete="name" value={values.name} onChange={set("name")} {...describe("name", errors.name)} />
              </Field>
              <Field id="phone" label="Teléfono" error={errors.phone} hint="Para avisarte de la entrega o recogida.">
                <input type="tel" autoComplete="tel" inputMode="tel" value={values.phone} onChange={set("phone")} {...describe("phone", errors.phone, "x")} />
              </Field>
              <DemoNote>Usa datos inventados: esta demo no guarda tu información fuera de este navegador.</DemoNote>
            </div>
          )}

          {step === 1 && (
            <>
              <fieldset className="radio-cards">
                <legend className="sr-only">Método de entrega</legend>
                {commerce.shippingMethods.map((m) => {
                  const free = m.price === 0 || totals.qualifiesForFreeShipping;
                  return (
                    <label key={m.id} className={`radio-card ${method === m.id ? "is-checked" : ""}`}>
                      <input type="radio" name="shipping" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} />
                      <Icon name={m.id === "pickup" ? "store" : "truck"} />
                      <span className="radio-card__body">
                        <strong>{m.label}</strong>
                        <span>{m.description}</span>
                      </span>
                      <span className="radio-card__price">{free ? "Gratis" : formatPrice(m.price)}</span>
                    </label>
                  );
                })}
              </fieldset>

              {method === "standard" ? (
                <div className="form-grid form-grid--2">
                  <Field id="street" label="Dirección" error={errors.street}>
                    <input type="text" autoComplete="street-address" value={values.street} onChange={set("street")} {...describe("street", errors.street)} />
                  </Field>
                  <Field id="postalCode" label="Código postal" error={errors.postalCode}>
                    <input type="text" autoComplete="postal-code" inputMode="numeric" maxLength={5} value={values.postalCode} onChange={set("postalCode")} {...describe("postalCode", errors.postalCode)} />
                  </Field>
                  <Field id="city" label="Población" error={errors.city}>
                    <input type="text" autoComplete="address-level2" value={values.city} onChange={set("city")} {...describe("city", errors.city)} />
                  </Field>
                  <Field id="province" label="Provincia" error={errors.province}>
                    <select value={values.province} onChange={set("province")} {...describe("province", errors.province)}>
                      <option value="">Elige…</option>
                      {PROVINCES.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </Field>
                  <Field id="notes" label="Indicaciones para el repartidor" optional>
                    <textarea rows={2} value={values.notes} onChange={set("notes")} id="notes" name="notes" />
                  </Field>
                </div>
              ) : (
                <div className="pickup-card">
                  <Icon name="pin" />
                  <div>
                    <strong>{store.name}</strong>
                    <p>{store.address.street}, {store.address.postalCode} {store.address.city}</p>
                    <p className="muted small">En producción, se avisaría por email cuando el pedido esté listo. Horario por confirmar.</p>
                  </div>
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <dl className="review">
                <div>
                  <dt>Contacto</dt>
                  <dd>{values.name} · {values.email} · {values.phone}</dd>
                  <dd><button type="button" className="btn-text" onClick={() => setStep(0)}>Cambiar</button></dd>
                </div>
                <div>
                  <dt>Entrega</dt>
                  <dd>{method === "pickup" ? `Recogida en tienda · ${store.address.street}` : `${values.street}, ${values.postalCode} ${values.city} (${values.province})`}</dd>
                  <dd><button type="button" className="btn-text" onClick={() => setStep(1)}>Cambiar</button></dd>
                </div>
              </dl>

              <fieldset className="radio-cards" aria-describedby={errors.payment ? "payment-error" : undefined}>
                <legend className="form-legend">Método de pago (simulado)</legend>
                {PAYMENTS.map((p) => {
                  const disabled = p.pickupOnly && method !== "pickup";
                  return (
                    <label key={p.id} className={`radio-card ${payment === p.id ? "is-checked" : ""} ${disabled ? "is-disabled" : ""}`}>
                      <input type="radio" name="payment" value={p.id} checked={payment === p.id} disabled={disabled} onChange={() => { setPayment(p.id); setErrors((e) => ({ ...e, payment: undefined })); }} />
                      <Icon name={p.id === "store" ? "store" : "lock"} />
                      <span className="radio-card__body">
                        <strong>{p.label}</strong>
                        <span>{p.text}</span>
                      </span>
                    </label>
                  );
                })}
                {errors.payment && <p id="payment-error" className="field__error" role="alert"><Icon name="alert" /> {errors.payment}</p>}
              </fieldset>

              {hasPreorder && <DemoNote>Tu pedido incluye productos en pre-pedido. En producción habría que definir si se envía todo junto o por separado.</DemoNote>}

              <div className={`field ${errors.terms ? "field--error" : ""}`}>
                <label className="check check--block">
                  <input type="checkbox" checked={terms} onChange={(e) => { setTerms(e.target.checked); setErrors((er) => ({ ...er, terms: undefined })); }} aria-invalid={errors.terms ? true : undefined} aria-describedby={errors.terms ? "terms-error" : undefined} />
                  <span>
                    He leído y acepto las <Link to="/legal/condiciones" target="_blank">condiciones de venta</Link> y la <Link to="/legal/privacidad" target="_blank">política de privacidad</Link> (textos de ejemplo).
                  </span>
                </label>
                {errors.terms && <p id="terms-error" className="field__error" role="alert"><Icon name="alert" /> {errors.terms}</p>}
              </div>
            </>
          )}

          <div className="checkout__actions">
            {step > 0 ? (
              <button type="button" className="btn btn--ghost" onClick={() => setStep(step - 1)} disabled={submitting}>
                <Icon name="chevron-left" /> Atrás
              </button>
            ) : (
              <Link to="/carrito" className="btn btn--ghost"><Icon name="chevron-left" /> Carrito</Link>
            )}
            <button type="submit" className="btn btn--primary btn--lg" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner" aria-hidden="true" /> Simulando pedido…
                </>
              ) : step < STEPS.length - 1 ? (
                <>Continuar <Icon name="arrow-right" /></>
              ) : (
                <>Confirmar pedido de prueba · {formatPrice(totals.total)}</>
              )}
            </button>
          </div>
        </form>

        <aside className="summary summary--sticky" aria-labelledby="co-summary">
          <h2 id="co-summary" className="summary__title">Tu pedido</h2>
          <ul className="summary__lines">
            {lines.map((l) => (
              <li key={l.key}>
                <span className="summary__thumb">
                  <ProductArt product={l.product} />
                  <span className="summary__qty">{l.qty}</span>
                </span>
                <span className="summary__name">
                  {l.product.name}
                  {l.optionLabels.length > 0 && <small>{l.optionLabels.join(" · ")}</small>}
                </span>
                <span>{formatPrice(l.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <div className="sum-row"><span>Subtotal</span><span>{formatPrice(totals.subtotal)}</span></div>
          <div className="sum-row"><span>Envío</span><span>{totals.shipping === 0 ? "Gratis" : formatPrice(totals.shipping)}</span></div>
          <div className="sum-row sum-row--total"><span>Total</span><strong>{formatPrice(totals.total)}</strong></div>
          <p className="muted small">IVA incluido. Tarifa de envío de demostración.</p>
        </aside>
      </div>
    </div>
  );
}

const PROVINCES = [
  "A Coruña", "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila", "Badajoz", "Baleares", "Barcelona", "Burgos", "Cáceres", "Cádiz", "Cantabria", "Castellón", "Ceuta", "Ciudad Real", "Córdoba", "Cuenca", "Girona", "Granada", "Guadalajara", "Guipúzcoa", "Huelva", "Huesca", "Jaén", "La Rioja", "Las Palmas", "León", "Lleida", "Lugo", "Madrid", "Málaga", "Melilla", "Murcia", "Navarra", "Ourense", "Palencia", "Pontevedra", "Salamanca", "Santa Cruz de Tenerife", "Segovia", "Sevilla", "Soria", "Tarragona", "Teruel", "Toledo", "Valencia", "Valladolid", "Vizcaya", "Zamora", "Zaragoza",
];
