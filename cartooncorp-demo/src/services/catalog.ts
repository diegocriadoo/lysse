/**
 * Servicio de catálogo.
 *
 * Toda la interfaz pasa por aquí. Hoy lee los ficheros locales de `src/data`;
 * para conectar un backend real basta con reimplementar estas funciones contra
 * la API (PrestaShop Webservice, Shopify Storefront, un CMS…) manteniendo las
 * firmas.
 */
import { categories, getCategoryTree } from "../data/categories";
import { products } from "../data/products";
import type { Availability, Product } from "../data/types";

export type SortKey = "relevance" | "newest" | "price-asc" | "price-desc" | "name-asc";

export const sortLabels: Record<SortKey, string> = {
  relevance: "Relevancia",
  newest: "Novedades",
  "price-asc": "Precio: menor a mayor",
  "price-desc": "Precio: mayor a menor",
  "name-asc": "Nombre: A–Z",
};

export interface CatalogQuery {
  category?: string;
  q?: string;
  brands?: string[];
  franchises?: string[];
  availability?: Availability[];
  onSale?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortKey;
  page?: number;
  pageSize?: number;
}

export interface Facet {
  value: string;
  count: number;
}

export interface CatalogResult {
  items: Product[];
  total: number;
  page: number;
  pageCount: number;
  facets: { brands: Facet[]; franchises: Facet[]; availability: Facet[]; priceRange: [number, number] };
}

export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ñ]+/g, " ")
    .trim();
}

function haystack(p: Product) {
  const cat = categories.find((c) => c.slug === p.category);
  return normalize([p.name, p.brand, p.franchise, cat?.name, ...p.tags].filter(Boolean).join(" "));
}

/** Puntuación de búsqueda: todas las palabras deben aparecer; el nombre puntúa más. */
export function searchScore(p: Product, q: string): number {
  const terms = normalize(q).split(" ").filter(Boolean);
  if (!terms.length) return 1;
  const name = normalize(p.name);
  const text = haystack(p);
  let score = 0;
  for (const term of terms) {
    if (name.includes(term)) score += name.startsWith(term) ? 3 : 2;
    else if (text.includes(term)) score += 1;
    else return 0;
  }
  return score;
}

export const isOnSale = (p: Product) => p.compareAtPrice !== undefined && p.compareAtPrice > p.price;

export function discountPercent(p: Product) {
  return isOnSale(p) ? Math.round((1 - p.price / p.compareAtPrice!) * 100) : 0;
}

function countBy(list: Product[], key: (p: Product) => string | undefined): Facet[] {
  const map = new Map<string, number>();
  for (const p of list) {
    const v = key(p);
    if (v) map.set(v, (map.get(v) ?? 0) + 1);
  }
  return [...map.entries()].map(([value, count]) => ({ value, count })).sort((a, b) => a.value.localeCompare(b.value, "es"));
}

const collator = new Intl.Collator("es", { sensitivity: "base", numeric: true });

export function queryCatalog(query: CatalogQuery, source: Product[] = products): CatalogResult {
  const { sort = query.q ? "relevance" : "newest", page = 1, pageSize = 12 } = query;

  // 1. Ámbito: categoría + búsqueda. Las facetas se calculan sobre este ámbito.
  let scope = source;
  if (query.category) {
    const tree = new Set(getCategoryTree(query.category));
    scope = scope.filter((p) => tree.has(p.category));
  }
  const scores = new Map<string, number>();
  if (query.q?.trim()) {
    scope = scope.filter((p) => {
      const s = searchScore(p, query.q!);
      if (s > 0) scores.set(p.id, s);
      return s > 0;
    });
  }

  const prices = scope.map((p) => p.price);
  const facets = {
    brands: countBy(scope, (p) => p.brand),
    franchises: countBy(scope, (p) => p.franchise),
    availability: countBy(scope, (p) => p.availability),
    priceRange: [prices.length ? Math.floor(Math.min(...prices)) : 0, prices.length ? Math.ceil(Math.max(...prices)) : 0] as [number, number],
  };

  // 2. Filtros.
  let items = scope.filter((p) => {
    if (query.brands?.length && !query.brands.includes(p.brand ?? "")) return false;
    if (query.franchises?.length && !query.franchises.includes(p.franchise ?? "")) return false;
    if (query.availability?.length && !query.availability.includes(p.availability)) return false;
    if (query.onSale && !isOnSale(p)) return false;
    if (query.minPrice !== undefined && p.price < query.minPrice) return false;
    if (query.maxPrice !== undefined && p.price > query.maxPrice) return false;
    return true;
  });

  // 3. Orden. Los agotados siempre al final salvo orden por nombre.
  const byStock = (a: Product, b: Product) => Number(a.availability === "out_of_stock") - Number(b.availability === "out_of_stock");
  const comparators: Record<SortKey, (a: Product, b: Product) => number> = {
    relevance: (a, b) => (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0) || b.addedAt.localeCompare(a.addedAt),
    newest: (a, b) => b.addedAt.localeCompare(a.addedAt),
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    "name-asc": (a, b) => collator.compare(a.name, b.name),
  };
  items = [...items].sort((a, b) => (sort === "name-asc" ? 0 : byStock(a, b)) || comparators[sort](a, b) || collator.compare(a.name, b.name));

  // 4. Paginación.
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), pageCount);
  return { items: items.slice((current - 1) * pageSize, current * pageSize), total, page: current, pageCount, facets };
}

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export function getRelated(product: Product, limit = 4) {
  const sameFranchise = products.filter((p) => p.id !== product.id && p.franchise && p.franchise === product.franchise);
  const sameCategory = products.filter((p) => p.id !== product.id && p.category === product.category);
  const unique = [...new Map([...sameFranchise, ...sameCategory].map((p) => [p.id, p])).values()];
  return unique.filter((p) => p.availability !== "out_of_stock").slice(0, limit);
}

export function getFeatured(limit = 8) {
  return products.filter((p) => p.featured && p.availability !== "out_of_stock").slice(0, limit);
}

export function getNewest(limit = 8) {
  return queryCatalog({ sort: "newest", pageSize: limit }).items;
}

export function getOnSale(limit = 8) {
  return queryCatalog({ onSale: true, sort: "newest", pageSize: limit }).items;
}

export function getPreorders(limit = 8) {
  return queryCatalog({ availability: ["preorder"], pageSize: limit }).items;
}

export function suggest(q: string, limit = 6) {
  if (normalize(q).length < 2) return [];
  return queryCatalog({ q, pageSize: limit }).items;
}

/** Simula la latencia de una API para mostrar estados de carga reales. */
export function withLatency<T>(fn: () => T, ms = 280): Promise<T> {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      try {
        resolve(fn());
      } catch (e) {
        reject(e);
      }
    }, ms),
  );
}
