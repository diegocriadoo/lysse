/** Validadores de formularios. Devuelven el mensaje de error o `undefined`. */
export type Validator = (value: string) => string | undefined;

export const required =
  (msg = "Este campo es obligatorio."): Validator =>
  (v) =>
    v.trim() ? undefined : msg;

export const email: Validator = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? undefined : "Introduce un email válido, por ejemplo nombre@dominio.com.";

/** Teléfono español: 9 dígitos que empiezan por 6, 7, 8 o 9, con prefijo +34 opcional. */
export const phoneES: Validator = (v) =>
  /^(\+34|0034)?[6789]\d{8}$/.test(v.replace(/[\s.-]/g, "")) ? undefined : "Introduce un teléfono de 9 cifras.";

export const postalCodeES: Validator = (v) => {
  const t = v.trim();
  if (!/^\d{5}$/.test(t)) return "El código postal debe tener 5 cifras.";
  const province = Number(t.slice(0, 2));
  return province >= 1 && province <= 52 ? undefined : "Ese código postal no corresponde a ninguna provincia.";
};

export const minLength =
  (n: number, msg?: string): Validator =>
  (v) =>
    v.trim().length >= n ? undefined : (msg ?? `Escribe al menos ${n} caracteres.`);

export function validate<T extends Record<string, string>>(values: T, rules: Partial<Record<keyof T, Validator[]>>) {
  const errors: Partial<Record<keyof T, string>> = {};
  for (const key in rules) {
    for (const rule of rules[key] ?? []) {
      const msg = rule(values[key] ?? "");
      if (msg) {
        errors[key] = msg;
        break;
      }
    }
  }
  return errors;
}
