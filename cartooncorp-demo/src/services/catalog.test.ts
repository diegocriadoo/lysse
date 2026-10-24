import { describe, expect, it } from "vitest";
import { categories } from "../data/categories";
import { products } from "../data/products";
import { getRelated, queryCatalog, searchScore } from "./catalog";

describe("datos", () => {
  it("cada producto apunta a una categoría existente y tiene slug único", () => {
    const slugs = new Set(categories.map((c) => c.slug));
    for (const p of products) expect(slugs.has(p.category), p.name).toBe(true);
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
  });

  it("sólo hay precio anterior en productos con precio observado", () => {
    for (const p of products.filter((p) => p.compareAtPrice)) {
      expect(p.source.price, p.name).toBe("observed");
      expect(p.compareAtPrice!).toBeGreaterThan(p.price);
    }
  });
});

describe("búsqueda", () => {
  it("ignora mayúsculas y tildes", () => {
    const r = queryCatalog({ q: "POKEMON" });
    expect(r.items.some((p) => p.name.includes("Bulbasaur"))).toBe(true);
  });

  it("exige todas las palabras", () => {
    expect(queryCatalog({ q: "dragon ball ichibansho" }).total).toBe(1);
    expect(queryCatalog({ q: "xyzzy" }).total).toBe(0);
  });

  it("puntúa más el nombre que las etiquetas", () => {
    const p = products.find((x) => x.id === "38490")!;
    expect(searchScore(p, "chainsaw")).toBeGreaterThan(searchScore(p, "shonen"));
  });
});

describe("filtros y orden", () => {
  it("la categoría incluye subcategorías", () => {
    const r = queryCatalog({ category: "cartas", pageSize: 100 });
    expect(r.items.some((p) => p.category === "magic")).toBe(true);
    expect(r.items.every((p) => ["cartas", "magic", "pokemon-tcg", "one-piece-tcg", "accesorios-cartas"].includes(p.category))).toBe(true);
  });

  it("ordena por precio ascendente (agotados al final)", () => {
    const r = queryCatalog({ category: "magic", sort: "price-asc", pageSize: 100 });
    const inStock = r.items.filter((p) => p.availability !== "out_of_stock").map((p) => p.price);
    expect(inStock).toEqual([...inStock].sort((a, b) => a - b));
    expect(r.items.at(-1)!.availability).toBe("out_of_stock");
  });

  it("ordena por nombre", () => {
    const names = queryCatalog({ category: "manga", sort: "name-asc", pageSize: 100 }).items.map((p) => p.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, "es", { numeric: true, sensitivity: "base" })));
  });

  it("filtra por ofertas, marca y rango de precio", () => {
    expect(queryCatalog({ onSale: true }).items.every((p) => p.compareAtPrice)).toBe(true);
    expect(queryCatalog({ brands: ["Norma Editorial"], pageSize: 100 }).items.every((p) => p.brand === "Norma Editorial")).toBe(true);
    expect(queryCatalog({ minPrice: 15, maxPrice: 30, pageSize: 100 }).items.every((p) => p.price >= 15 && p.price <= 30)).toBe(true);
  });

  it("calcula facetas sobre el ámbito sin filtros", () => {
    const r = queryCatalog({ category: "manga", brands: ["Norma Editorial"] });
    expect(r.facets.brands.map((b) => b.value)).toContain("Planeta Cómic");
  });

  it("pagina y acota la página pedida", () => {
    const r = queryCatalog({ pageSize: 5, page: 99 });
    expect(r.page).toBe(r.pageCount);
    expect(r.items.length).toBeGreaterThan(0);
    expect(queryCatalog({ pageSize: 5 }).items).toHaveLength(5);
  });

  it("relacionados no incluyen el propio producto ni agotados", () => {
    const p = products.find((x) => x.id === "40349")!;
    const rel = getRelated(p);
    expect(rel.find((x) => x.id === p.id)).toBeUndefined();
    expect(rel.every((x) => x.availability !== "out_of_stock")).toBe(true);
  });
});
