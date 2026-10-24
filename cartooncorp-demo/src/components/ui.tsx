import type { ReactNode } from "react";
import { Link } from "react-router";
import type { Availability, Product } from "../data/types";
import { availabilityLabel, formatPrice } from "../lib/format";
import { discountPercent, isOnSale } from "../services/catalog";
import { MAX_QTY_PER_LINE } from "../services/cart";
import { Icon, type IconName } from "./Icon";

export function Price({ product, price = product.price, size = "md" }: { product: Product; price?: number; size?: "sm" | "md" | "lg" }) {
  const sale = isOnSale(product) && price === product.price;
  return (
    <div className={`price price--${size}`}>
      <span className={sale ? "price__now price__now--sale" : "price__now"}>
        {sale && <span className="sr-only">Precio actual: </span>}
        {formatPrice(price)}
      </span>
      {sale && (
        <>
          <s className="price__was">
            <span className="sr-only">Precio anterior: </span>
            {formatPrice(product.compareAtPrice!)}
          </s>
          <span className="price__off">−{discountPercent(product)}%</span>
        </>
      )}
    </div>
  );
}

export function AvailabilityBadge({ value, withDot = true }: { value: Availability; withDot?: boolean }) {
  return (
    <span className={`avail avail--${value}`}>
      {withDot && <span className="avail__dot" aria-hidden="true" />}
      {availabilityLabel[value]}
    </span>
  );
}

export function QuantityStepper({ value, onChange, label = "Cantidad", min = 1 }: { value: number; onChange: (v: number) => void; label?: string; min?: number }) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Restar una unidad">
        <Icon name="minus" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={MAX_QTY_PER_LINE}
        value={value}
        aria-label={label}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          if (!Number.isNaN(n)) onChange(Math.min(MAX_QTY_PER_LINE, Math.max(min, n)));
        }}
      />
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY_PER_LINE} aria-label="Sumar una unidad">
        <Icon name="plus" />
      </button>
    </div>
  );
}

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Ruta de navegación" className="crumbs">
      <ol>
        <li>
          <Link to="/">Inicio</Link>
        </li>
        {items.map((c, i) => (
          <li key={i}>
            <Icon name="chevron-right" />
            {c.to && i < items.length - 1 ? <Link to={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function EmptyState({ icon = "search", title, children, action, as: H = "h2" }: { icon?: IconName; title: string; children?: ReactNode; action?: ReactNode; as?: "h1" | "h2" }) {
  return (
    <div className="empty">
      <div className="empty__icon">
        <Icon name={icon} />
      </div>
      <H className="empty__title">{title}</H>
      {children && <div className="empty__text">{children}</div>}
      {action && <div className="empty__action">{action}</div>}
    </div>
  );
}

export function SectionHead({ eyebrow, title, to, linkLabel = "Ver todo", id }: { eyebrow?: string; title: string; to?: string; linkLabel?: string; id?: string }) {
  return (
    <div className="section-head">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="section-title" id={id}>{title}</h2>
      </div>
      {to && (
        <Link to={to} className="link-arrow">
          {linkLabel} <Icon name="arrow-right" />
        </Link>
      )}
    </div>
  );
}

export function DemoNote({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "warn" }) {
  return (
    <p className={`demo-note demo-note--${tone}`}>
      <Icon name="info" />
      <span>{children}</span>
    </p>
  );
}

export function Field({
  id,
  label,
  error,
  hint,
  children,
  optional,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  optional?: boolean;
}) {
  return (
    <div className={`field ${error ? "field--error" : ""}`}>
      <label htmlFor={id}>
        {label}
        {optional && <span className="field__opt"> (opcional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="field__error" id={`${id}-error`} role="alert">
          <Icon name="alert" /> {error}
        </p>
      )}
    </div>
  );
}

/** Atributos ARIA para enlazar un input con su error/ayuda. */
export const describe = (id: string, error?: string, hint?: string) => ({
  id,
  name: id,
  "aria-invalid": error ? true : undefined,
  "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
});
