import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { CatalogPage } from "./pages/CatalogPage";
import { ProductPage } from "./pages/ProductPage";
import { CartPage } from "./pages/CartPage";
import { NotFoundPage } from "./pages/NotFoundPage";

// Páginas menos visitadas: se cargan bajo demanda.
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderPage = lazy(() => import("./pages/OrderPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const StorePage = lazy(() => import("./pages/StorePage"));
const FaqPage = lazy(() => import("./pages/FaqPage"));
const InfoPage = lazy(() => import("./pages/InfoPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const AboutDemoPage = lazy(() => import("./pages/AboutDemoPage"));
const ProposalPage = lazy(() => import("./pages/ProposalPage"));

function PageLoader() {
  return (
    <div className="container page" role="status" aria-live="polite">
      <div className="loader" />
      <span className="sr-only">Cargando…</span>
    </div>
  );
}

export function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="tienda" element={<CatalogPage mode="all" />} />
          <Route path="categoria/:slug" element={<CatalogPage mode="category" />} />
          <Route path="buscar" element={<CatalogPage mode="search" />} />
          <Route path="novedades" element={<CatalogPage mode="new" />} />
          <Route path="ofertas" element={<CatalogPage mode="sale" />} />
          <Route path="preventas" element={<CatalogPage mode="preorder" />} />
          <Route path="producto/:slug" element={<ProductPage />} />
          <Route path="carrito" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="pedido/:id" element={<OrderPage />} />
          <Route path="cuenta" element={<AccountPage />} />
          <Route path="contacto" element={<ContactPage />} />
          <Route path="tienda-fisica" element={<StorePage />} />
          <Route path="ayuda" element={<FaqPage />} />
          <Route path="envios" element={<InfoPage page="envios" />} />
          <Route path="devoluciones" element={<InfoPage page="devoluciones" />} />
          <Route path="legal/:slug" element={<InfoPage />} />
          <Route path="noticias" element={<BlogPage />} />
          <Route path="noticias/:slug" element={<ArticlePage />} />
          <Route path="sobre-la-demo" element={<AboutDemoPage />} />
          <Route path="propuesta" element={<ProposalPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
