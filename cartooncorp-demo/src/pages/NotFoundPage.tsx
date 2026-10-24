import { Link } from "react-router";
import { SearchBox } from "../components/SearchBox";
import { EmptyState } from "../components/ui";
import { usePageMeta } from "../hooks/usePageMeta";

export function NotFoundPage({ what = "página" }: { what?: "página" | "producto" | "artículo" }) {
  usePageMeta("No encontrado", undefined, undefined, { noindex: true });
  return (
    <div className="container page">
      <EmptyState
        as="h1"
        icon="search"
        title={what === "producto" ? "Este producto ya no está en el catálogo" : `No encontramos esta ${what}`}
        action={
          <Link to="/" className="btn btn--primary">
            Volver al inicio
          </Link>
        }
      >
        <p>Puede que el enlace sea antiguo o que se haya escrito mal. Prueba a buscarlo:</p>
        <div className="notfound__search">
          <SearchBox />
        </div>
      </EmptyState>
    </div>
  );
}
