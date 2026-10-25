import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { formatPrice } from "../lib/format";
import { suggest } from "../services/catalog";
import { Icon } from "./Icon";
import { ProductMedia } from "./ProductMedia";

const POPULAR = ["Magic", "One Piece", "Dragon Ball", "Gunpla", "Chainsaw Man", "Funko"];

/** Buscador con sugerencias (patrón combobox de WAI-ARIA). */
export function SearchBox({ autoFocus, onNavigate }: { autoFocus?: boolean; onNavigate?: () => void }) {
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const navigate = useNavigate();
  const listId = useId();
  const wrap = useRef<HTMLFormElement>(null);
  const results = suggest(q);
  const showPopular = open && q.trim().length < 2;
  const optionCount = results.length ? results.length + 1 : 0;

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const go = (to: string) => {
    setOpen(false);
    setActive(-1);
    onNavigate?.();
    navigate(to);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (active >= 0 && active < results.length) return go(`/producto/${results[active].slug}`);
    const term = q.trim();
    go(term ? `/buscar?q=${encodeURIComponent(term)}` : "/buscar");
  };

  return (
    <form
      ref={wrap}
      className="search"
      role="search"
      onSubmit={submit}
      onBlur={(e) => {
        if (!wrap.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <label htmlFor={`${listId}-input`} className="sr-only">
        Buscar productos
      </label>
      <Icon name="search" className="search__icon" />
      <input
        id={`${listId}-input`}
        type="search"
        autoComplete="off"
        placeholder="Busca manga, Funko, Magic, Gunpla…"
        value={q}
        autoFocus={autoFocus}
        role="combobox"
        aria-expanded={open && (results.length > 0 || showPopular)}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${listId}-opt-${active}` : undefined}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && optionCount) {
            e.preventDefault();
            setOpen(true);
            setActive((a) => (a + 1) % optionCount);
          } else if (e.key === "ArrowUp" && optionCount) {
            e.preventDefault();
            setActive((a) => (a <= 0 ? optionCount - 1 : a - 1));
          } else if (e.key === "Escape") {
            if (open) {
              e.stopPropagation();
              setOpen(false);
              setActive(-1);
            }
          }
        }}
      />
      {q && (
        <button type="button" className="search__clear" aria-label="Borrar búsqueda" onClick={() => { setQ(""); setActive(-1); }}>
          <Icon name="close" />
        </button>
      )}
      <button type="submit" className="search__submit">
        Buscar
      </button>

      {open && results.length > 0 && (
        <ul id={listId} role="listbox" className="search__panel" aria-label="Sugerencias">
          {results.map((p, i) => (
            <li
              key={p.id}
              id={`${listId}-opt-${i}`}
              role="option"
              aria-selected={active === i}
              className={`search__opt ${active === i ? "is-active" : ""}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => go(`/producto/${p.slug}`)}
              onMouseEnter={() => setActive(i)}
            >
              <span className="search__thumb">
                <ProductMedia product={p} compact sizes="44px" />
              </span>
              <span className="search__name">{p.name}</span>
              <span className="search__price">{formatPrice(p.price)}</span>
            </li>
          ))}
          <li
            id={`${listId}-opt-${results.length}`}
            role="option"
            aria-selected={active === results.length}
            className={`search__opt search__all ${active === results.length ? "is-active" : ""}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => go(`/buscar?q=${encodeURIComponent(q.trim())}`)}
            onMouseEnter={() => setActive(results.length)}
          >
            Ver todos los resultados de «{q.trim()}» <Icon name="arrow-right" />
          </li>
        </ul>
      )}
      {open && q.trim().length >= 2 && results.length === 0 && (
        <div className="search__panel search__none" id={listId} role="status">
          Sin coincidencias para «{q.trim()}». Prueba con otra palabra.
        </div>
      )}
      {showPopular && (
        <div className="search__panel search__popular" id={listId}>
          <p className="eyebrow">Búsquedas populares en la demo</p>
          <div className="chips">
            {POPULAR.map((term) => (
              <button key={term} type="button" className="chip" onMouseDown={(e) => e.preventDefault()} onClick={() => { setQ(term); go(`/buscar?q=${encodeURIComponent(term)}`); }}>
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
