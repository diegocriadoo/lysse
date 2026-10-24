import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { Icon } from "../components/Icon";
import { Breadcrumbs, DemoNote, EmptyState, Field, describe } from "../components/ui";
import { usePageMeta } from "../hooks/usePageMeta";
import { formatPrice } from "../lib/format";
import { listOrders } from "../services/orders";
import { email, minLength, required, validate } from "../services/validation";
import { useAccount } from "../state/AccountContext";
import { useToast } from "../state/ToastContext";

export default function AccountPage() {
  usePageMeta("Mi cuenta", "Acceso de demostración a la cuenta de cliente.", undefined, { noindex: true });
  const { user } = useAccount();
  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: "Mi cuenta" }]} />
      {user ? <Dashboard /> : <SignIn />}
    </div>
  );
}

function SignIn() {
  const { signIn } = useAccount();
  const toast = useToast();
  const [values, setValues] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState<Partial<Record<"name" | "email", string>>>({});

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(values, { name: [required(), minLength(2)], email: [required(), email] });
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    signIn({ name: values.name.trim(), email: values.email.trim() });
    toast.show({ tone: "success", title: "Sesión de demostración iniciada" });
  };

  return (
    <div className="auth">
      <div className="auth__intro">
        <p className="eyebrow">Cuenta de cliente</p>
        <h1 className="page-title">Entra en tu cuenta</h1>
        <p>Consulta tus pedidos, guarda tus datos de envío y sigue tus reservas en un solo sitio.</p>
        <ul className="ticks">
          <li><Icon name="check" /> Historial de pedidos y reservas</li>
          <li><Icon name="check" /> Checkout más rápido</li>
          <li><Icon name="check" /> Avisos de reposición y preventas</li>
        </ul>
      </div>
      <form className="auth__form card-panel" onSubmit={submit} noValidate>
        <DemoNote>Modo demostración: no hay contraseña ni servidor. Sólo se guardan nombre y email en este navegador.</DemoNote>
        <Field id="acc-name" label="Nombre" error={errors.name}>
          <input type="text" autoComplete="name" value={values.name} onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))} {...describe("acc-name", errors.name)} />
        </Field>
        <Field id="acc-email" label="Email" error={errors.email}>
          <input type="email" spellCheck={false} autoComplete="email" value={values.email} onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))} {...describe("acc-email", errors.email)} />
        </Field>
        <button type="submit" className="btn btn--primary btn--block">Entrar en modo demo</button>
      </form>
    </div>
  );
}

function Dashboard() {
  const { user, signOut } = useAccount();
  const orders = listOrders();
  return (
    <div className="account">
      <div className="account__head">
        <div>
          <p className="eyebrow">Cuenta de demostración</p>
          <h1 className="page-title">Hola, {user!.name.split(" ")[0]}</h1>
          <p className="muted">{user!.email}</p>
        </div>
        <button type="button" className="btn btn--ghost" onClick={signOut}>Cerrar sesión</button>
      </div>

      <section aria-labelledby="orders-title">
        <h2 id="orders-title" className="section-title section-title--sm">Pedidos de prueba</h2>
        {orders.length === 0 ? (
          <EmptyState icon="box" title="Aún no has hecho ningún pedido de prueba" action={<Link to="/tienda" className="btn btn--primary">Ir a la tienda</Link>}>
            Completa el checkout de demostración y aparecerá aquí.
          </EmptyState>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <caption className="sr-only">Pedidos de prueba realizados en este navegador</caption>
              <thead>
                <tr><th scope="col">Pedido</th><th scope="col">Fecha</th><th scope="col">Artículos</th><th scope="col">Total</th><th scope="col"><span className="sr-only">Acciones</span></th></tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <th scope="row">{o.id}</th>
                    <td>{new Date(o.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td>{o.totals.itemCount}</td>
                    <td>{formatPrice(o.totals.total)}</td>
                    <td><Link to={`/pedido/${o.id}`}>Ver</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
