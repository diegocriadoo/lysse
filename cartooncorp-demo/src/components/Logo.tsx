/**
 * Logotipo PROPUESTO para el rediseño (no es el logotipo oficial de CartoonCorp).
 * Sello cuadrado tipo "hanko" + logotipo condensado. Sustituible por el
 * logotipo real cuando el cliente lo facilite en vectorial.
 */
export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className={`logo ${inverted ? "logo--inv" : ""}`}>
      <svg className="logo__mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
        <rect x="1" y="1" width="38" height="38" rx="9" fill="var(--brand)" />
        <path d="M27.5 13.2A9.5 9.5 0 1 0 27.5 26.8" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
        <circle cx="28.5" cy="20" r="2.6" fill="#fff" />
      </svg>
      <span className="logo__word" translate="no">
        Cartoon<span>Corp</span>
      </span>
    </span>
  );
}
