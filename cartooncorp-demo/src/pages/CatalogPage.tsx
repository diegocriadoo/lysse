import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { Drawer } from "../components/Drawer";
import { Icon } from "../components/Icon";
import { CardSkeleton, ProductGrid } from "../components/ProductCard";
import { Breadcrumbs, EmptyState, type Crumb } from "../components/ui";
import { getCategory, getChildren } from "../data/categories";
import type { Availability, Category } from "../data/types";
import { usePageMeta } from "../hooks/usePageMeta";
import { availabilityLabel, plural } from "../lib/format";
import { queryCatalog, sortLabels, withLatency, type CatalogQuery, type CatalogResult, type SortKey } from "../services/catalog";
import { NotFoundPage } from "./NotFoundPage";

type Mode = "all" | "category" | "search" | "new" | "sale" | "preorder";

const PRICE_RANGES = [
  { id: "0-15", label: "Hasta 15 €", min: 0, max: 15 },
  { id: "15-30", label: "15 € – 30 €", min: 15, max: 30 },
  { id: "30-100", label: "30 € – 100 €", min: 30, max: 100 },
  { id: "100-", label: "Más de 100 €", min: 100, max: undefined },
];

const PAGE_SIZE = 12;

const MODE_INFO: Record<Exclude<Mode, "category">, { title: string; description: string; eyebrow: string }> = {
  all: { title: "Todo el catálogo", eyebrow: "Tienda", description: "Todos los productos de la demo en un solo lugar." },
  search: { title: "Buscar", eyebrow: "Resultados", description: "Busca por título, licencia, editorial o fabricante." },
  new: { title: "Novedades", eyebrow: "Recién llegado", description: "Lo último que ha entrado en el catálogo (orden de demostración)." },
  sale: { title: "Ofertas", eyebrow: "Precio rebajado", description: "Sólo se muestran descuentos observados en la web actual de CartoonCorp." },
  preorder: { title: "Pre-pedidos", eyebrow: "Reserva", description: "Asegura tu unidad antes de que llegue a tienda." },
};

const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);

export function CatalogPage({ mode }: { mode: Mode }) {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const category = mode === "category" ? getCategory(slug ?? "") : undefined;
  const [filtersOpen, setFiltersOpen] = useState(false);
  // La navegación de React Router va en una transición: guardamos la URL
  // pedida para que los controles reflejen el cambio al instante.
  const [viewParams, setViewParams] = useState(params);
  useEffect(() => setViewParams(params), [params]);

  const q = params.get("q") ?? "";
  const sort = (params.get("orden") as SortKey | null) ?? undefined;
  const page = Number(params.get("pagina") ?? "1") || 1;
  const priceId = params.get("precio");
  const range = PRICE_RANGES.find((r) => r.id === priceId);

  const query: CatalogQuery = useMemo(
    () => ({
      category: category?.slug,
      q: mode === "search" ? q : undefined,
      brands: list(params.get("marca")),
      franchises: list(params.get("licencia")),
      availability: mode === "preorder" ? ["preorder"] : (list(params.get("disponibilidad")) as Availability[]),
      onSale: mode === "sale" || params.get("oferta") === "1",
      minPrice: range?.min,
      maxPrice: range?.max,
      sort: sort && sort in sortLabels ? sort : mode === "search" && q ? "relevance" : "newest",
      page,
      pageSize: PAGE_SIZE,
    }),
    [category?.slug, mode, q, params, range, sort, page],
  );

  const [state, setState] = useState<{ status: "loading" | "ready" | "error"; result?: CatalogResult }>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const key = JSON.stringify(query);

  // La consulta se serializa en `key` para no relanzarla en cada render.
  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ status: "loading", result: s.result }));
    withLatency(() => queryCatalog(query), 260)
      .then((result) => !cancelled && setState({ status: "ready", result }))
      .catch(() => !cancelled && setState({ status: "error" }));
    return () => {
      cancelled = true;
    };
  }, [key, attempt]);

  const info = category ? { title: category.name, description: category.description, eyebrow: category.parent ? getCategory(category.parent)?.name ?? "" : "Categoría" } : MODE_INFO[mode as Exclude<Mode, "category">];
  const title = mode === "search" && q ? `Resultados para «${q}»` : info.title;
  usePageMeta(title, info.description);

  if (mode === "category" && !category) return <NotFoundPage />;

  const update = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(viewParams);
    for (const [k, v] of Object.entries(changes)) {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    }
    next.delete("pagina");
    setViewParams(next);
    setParams(next, { preventScrollReset: true });
  };

  const toggle = (param: string, value: string) => {
    const current = list(viewParams.get(param));
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    update({ [param]: next.join(",") || null });
  };

  const result = state.result;
  const active = activeFilters(viewParams, mode);

  const crumbs: Crumb[] = category
    ? [...(category.parent ? [{ label: getCategory(category.parent)!.name, to: `/categoria/${category.parent}` }] : []), { label: category.name }]
    : [{ label: info.title }];

  const filters = result && (
    <Filters
      result={result}
      params={viewParams}
      mode={mode}
      category={category}
      onToggle={toggle}
      onPrice={(id) => update({ precio: id })}
      onSale={(on) => update({ oferta: on ? "1" : null })}
    />
  );

  return (
    <div className="container page catalog" style={{ ["--hue" as string]: category?.hue ?? 4 }}>
      <Breadcrumbs items={crumbs} />
      <header className="catalog__head">
        <p className="eyebrow">{info.eyebrow}</p>
        <h1 className="page-title">{title}</h1>
        <p className="catalog__desc">{info.description}</p>
        {category && <SubcategoryChips category={category} />}
      </header>

      {mode === "search" && !q && (
        <EmptyState icon="search" title="¿Qué estás buscando?">
          Usa el buscador de la cabecera. Prueba con «Magic», «Dragon Ball» o «Norma Editorial».
        </EmptyState>
      )}

      {(mode !== "search" || q) && (
        <div className="catalog__layout">
          <aside className="catalog__aside" aria-label="Filtros">
            {filters}
          </aside>

          <section className="catalog__main" aria-labelledby="results-count">
            <div className="toolbar">
              <p id="results-count" className="toolbar__count" aria-live="polite">
                {result ? plural(result.total, "producto", "productos") : "Cargando…"}
              </p>
              <button type="button" className="btn btn--ghost btn--sm toolbar__filters" onClick={() => setFiltersOpen(true)}>
                <Icon name="filter" /> Filtros {active.length > 0 && <span className="badge-count badge-count--inline">{active.length}</span>}
              </button>
              <label className="toolbar__sort">
                <span>Ordenar</span>
                <select value={viewParams.get("orden") ?? query.sort} onChange={(e) => update({ orden: e.target.value })}>
                  {(Object.keys(sortLabels) as SortKey[])
                    .filter((k) => k !== "relevance" || (mode === "search" && q))
                    .map((k) => (
                      <option key={k} value={k}>
                        {sortLabels[k]}
                      </option>
                    ))}
                </select>
              </label>
            </div>

            {active.length > 0 && (
              <ul className="active-filters" aria-label="Filtros activos">
                {active.map((f) => (
                  <li key={f.param + f.value}>
                    <button
                      type="button"
                      className="chip chip--removable"
                      onClick={() => (f.multi ? toggle(f.param, f.value) : update({ [f.param]: null }))}
                      aria-label={`Quitar filtro ${f.label}`}
                    >
                      {f.label} <Icon name="close" />
                    </button>
                  </li>
                ))}
                <li>
                  <button type="button" className="btn-text" onClick={() => update({ marca: null, licencia: null, disponibilidad: null, precio: null, oferta: null })}>
                    Limpiar filtros
                  </button>
                </li>
              </ul>
            )}

            {state.status === "error" && (
              <EmptyState icon="alert" title="No hemos podido cargar los productos" action={<button className="btn btn--primary" onClick={() => setAttempt((a) => a + 1)}>Reintentar</button>}>
                Comprueba tu conexión e inténtalo de nuevo.
              </EmptyState>
            )}

            {state.status === "loading" && !result && <CardSkeleton count={8} />}

            {result && state.status !== "error" && (
              <div className={state.status === "loading" ? "is-refreshing" : undefined} aria-busy={state.status === "loading"}>
                {result.total === 0 ? (
                  <EmptyState
                    icon="search"
                    title={mode === "search" ? `No encontramos nada para «${q}»` : "No hay productos con estos filtros"}
                    action={
                      active.length > 0 ? (
                        <button className="btn btn--primary" onClick={() => update({ marca: null, licencia: null, disponibilidad: null, precio: null, oferta: null })}>
                          Quitar filtros
                        </button>
                      ) : (
                        <Link to="/novedades" className="btn btn--primary">Ver novedades</Link>
                      )
                    }
                  >
                    {mode === "search" ? "Revisa la ortografía o prueba con términos más generales, como el nombre de la serie." : "Prueba a quitar algún filtro para ver más resultados."}
                  </EmptyState>
                ) : (
                  <>
                    <ProductGrid products={result.items} headingLevel={2} />
                    {result.pageCount > 1 && <Pagination page={result.page} count={result.pageCount} params={viewParams} />}
                  </>
                )}
              </div>
            )}
          </section>
        </div>
      )}

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        side="bottom"
        title="Filtros"
        labelledBy="filters-title"
        footer={
          <button type="button" className="btn btn--primary btn--block" onClick={() => setFiltersOpen(false)}>
            Ver {result ? plural(result.total, "producto", "productos") : "resultados"}
          </button>
        }
      >
        {filters ?? (
          <div role="status">
            <div className="loader" />
            <span className="sr-only">Cargando filtros…</span>
          </div>
        )}
      </Drawer>
    </div>
  );
}

function SubcategoryChips({ category }: { category: Category }) {
  const parentSlug = category.parent ?? category.slug;
  const siblings = getChildren(parentSlug);
  if (!siblings.length) return null;
  return (
    <nav aria-label="Subcategorías" className="subcats">
      <Link to={`/categoria/${parentSlug}`} className={`chip ${!category.parent ? "chip--active" : ""}`} aria-current={!category.parent ? "page" : undefined}>
        Todo
      </Link>
      {siblings.map((s) => (
        <Link key={s.slug} to={`/categoria/${s.slug}`} className={`chip ${s.slug === category.slug ? "chip--active" : ""}`} aria-current={s.slug === category.slug ? "page" : undefined}>
          {s.shortName ?? s.name}
        </Link>
      ))}
    </nav>
  );
}

function Filters({
  result,
  params,
  mode,
  category,
  onToggle,
  onPrice,
  onSale,
}: {
  result: CatalogResult;
  params: URLSearchParams;
  mode: Mode;
  category?: Category;
  onToggle: (param: string, value: string) => void;
  onPrice: (id: string | null) => void;
  onSale: (on: boolean) => void;
}) {
  const { facets } = result;
  const brands = list(params.get("marca"));
  const franchises = list(params.get("licencia"));
  const avail = list(params.get("disponibilidad"));
  const price = params.get("precio");

  return (
    <div className="filters">
      {category && !category.parent && getChildren(category.slug).length > 0 && (
        <fieldset className="filter">
          <legend>Categoría</legend>
          <ul className="filter__links">
            {getChildren(category.slug).map((c) => (
              <li key={c.slug}>
                <Link to={`/categoria/${c.slug}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </fieldset>
      )}

      {mode !== "preorder" && facets.availability.length > 0 && (
        <fieldset className="filter">
          <legend>Disponibilidad</legend>
          {facets.availability.map((f) => (
            <label key={f.value} className="check">
              <input type="checkbox" checked={avail.includes(f.value)} onChange={() => onToggle("disponibilidad", f.value)} />
              <span>{availabilityLabel[f.value as Availability]}</span>
              <span className="check__count">{f.count}</span>
            </label>
          ))}
        </fieldset>
      )}

      <fieldset className="filter">
        <legend>Precio</legend>
        {PRICE_RANGES.map((r) => (
          <label key={r.id} className="check">
            <input type="radio" name="precio" checked={price === r.id} onChange={() => onPrice(r.id)} />
            <span>{r.label}</span>
          </label>
        ))}
        {price && (
          <button type="button" className="btn-text" onClick={() => onPrice(null)}>
            Cualquier precio
          </button>
        )}
      </fieldset>

      {mode !== "sale" && (
        <fieldset className="filter">
          <legend>Promociones</legend>
          <label className="check">
            <input type="checkbox" checked={params.get("oferta") === "1"} onChange={(e) => onSale(e.target.checked)} />
            <span>Sólo ofertas</span>
          </label>
        </fieldset>
      )}

      {facets.franchises.length > 1 && (
        <fieldset className="filter">
          <legend>Licencia</legend>
          {facets.franchises.map((f) => (
            <label key={f.value} className="check">
              <input type="checkbox" checked={franchises.includes(f.value)} onChange={() => onToggle("licencia", f.value)} />
              <span>{f.value}</span>
              <span className="check__count">{f.count}</span>
            </label>
          ))}
        </fieldset>
      )}

      {facets.brands.length > 1 && (
        <fieldset className="filter">
          <legend>Editorial / fabricante</legend>
          {facets.brands.map((f) => (
            <label key={f.value} className="check">
              <input type="checkbox" checked={brands.includes(f.value)} onChange={() => onToggle("marca", f.value)} />
              <span>{f.value}</span>
              <span className="check__count">{f.count}</span>
            </label>
          ))}
        </fieldset>
      )}
    </div>
  );
}

function activeFilters(params: URLSearchParams, mode: Mode) {
  const out: { param: string; value: string; label: string; multi: boolean }[] = [];
  for (const v of list(params.get("marca"))) out.push({ param: "marca", value: v, label: v, multi: true });
  for (const v of list(params.get("licencia"))) out.push({ param: "licencia", value: v, label: v, multi: true });
  if (mode !== "preorder") for (const v of list(params.get("disponibilidad"))) out.push({ param: "disponibilidad", value: v, label: availabilityLabel[v as Availability] ?? v, multi: true });
  const range = PRICE_RANGES.find((r) => r.id === params.get("precio"));
  if (range) out.push({ param: "precio", value: range.id, label: range.label, multi: false });
  if (params.get("oferta") === "1" && mode !== "sale") out.push({ param: "oferta", value: "1", label: "Ofertas", multi: false });
  return out;
}

function Pagination({ page, count, params }: { page: number; count: number; params: URLSearchParams }) {
  // Enlaces reales: admiten abrir en pestaña nueva y compartir la URL.
  const href = (p: number) => {
    const next = new URLSearchParams(params);
    if (p === 1) next.delete("pagina");
    else next.set("pagina", String(p));
    const qs = next.toString();
    return qs ? `?${qs}` : "?";
  };
  const scroll = () => document.getElementById("results-count")?.scrollIntoView({ behavior: "smooth", block: "center" });
  return (
    <nav className="pagination" aria-label="Paginación">
      <Link to={href(page - 1)} className="icon-btn" aria-disabled={page <= 1} tabIndex={page <= 1 ? -1 : undefined} onClick={scroll} aria-label="Página anterior">
        <Icon name="chevron-left" />
      </Link>
      <ol>
        {Array.from({ length: count }, (_, i) => i + 1).map((p) => (
          <li key={p}>
            <Link to={href(p)} className={`pagination__page ${p === page ? "is-current" : ""}`} aria-current={p === page ? "page" : undefined} onClick={scroll} aria-label={`Página ${p}`} preventScrollReset>
              {p}
            </Link>
          </li>
        ))}
      </ol>
      <Link to={href(page + 1)} className="icon-btn" aria-disabled={page >= count} tabIndex={page >= count ? -1 : undefined} onClick={scroll} aria-label="Página siguiente" preventScrollReset>
        <Icon name="chevron-right" />
      </Link>
    </nav>
  );
}
