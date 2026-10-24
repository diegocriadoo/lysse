import { describe, expect, it } from "vitest";
import { email, phoneES, postalCodeES, required, validate } from "./validation";

describe("validadores", () => {
  it("email", () => {
    expect(email("ana@correo.es")).toBeUndefined();
    expect(email("ana@correo")).toBeDefined();
    expect(email("ana correo.es")).toBeDefined();
  });

  it("teléfono español", () => {
    expect(phoneES("963 28 83 85")).toBeUndefined();
    expect(phoneES("+34 612345678")).toBeUndefined();
    expect(phoneES("12345")).toBeDefined();
    expect(phoneES("512345678")).toBeDefined();
  });

  it("código postal", () => {
    expect(postalCodeES("46007")).toBeUndefined();
    expect(postalCodeES("4600")).toBeDefined();
    expect(postalCodeES("99000")).toBeDefined();
  });

  it("validate devuelve el primer error por campo", () => {
    const errs = validate({ a: "", b: "x@y.com" }, { a: [required(), email], b: [required(), email] });
    expect(errs.a).toBe("Este campo es obligatorio.");
    expect(errs.b).toBeUndefined();
  });
});
