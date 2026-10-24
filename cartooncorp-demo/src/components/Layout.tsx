import { Component, useEffect, useRef, type ReactNode } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { CartDrawer } from "./CartDrawer";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { EmptyState } from "./ui";

export function Layout() {
  const { pathname } = useLocation();
  const main = useRef<HTMLElement>(null);
  const first = useRef(true);

  // Al cambiar de página: arriba del todo y foco en el contenido (lectores de pantalla).
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
    main.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      <a href="#main" className="skip-link">
        Saltar al contenido
      </a>
      <Header />
      <main id="main" ref={main} tabIndex={-1}>
        <ErrorBoundary key={pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error) {
    console.error("Error de interfaz:", error);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="container page">
          <EmptyState as="h1" icon="alert" title="Algo ha fallado al cargar esta página" action={<Link to="/" className="btn btn--primary">Volver al inicio</Link>}>
            Recarga la página o vuelve a intentarlo en unos segundos.
          </EmptyState>
        </div>
      );
    }
    return this.props.children;
  }
}
