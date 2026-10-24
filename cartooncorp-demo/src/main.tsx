import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./styles/global.css";
import { App } from "./App";
import { AccountProvider } from "./state/AccountContext";
import { CartProvider } from "./state/CartContext";
import { ToastProvider } from "./state/ToastContext";

// La versión de un solo archivo se abre sin servidor: usa rutas con #.
const Router = import.meta.env.MODE === "single" ? HashRouter : BrowserRouter;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <ToastProvider>
        <AccountProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AccountProvider>
      </ToastProvider>
    </Router>
  </StrictMode>,
);
