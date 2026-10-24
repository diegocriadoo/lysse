import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./styles/global.css";
import { App } from "./App";
import { AccountProvider } from "./state/AccountContext";
import { CartProvider } from "./state/CartContext";
import { ToastProvider } from "./state/ToastContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AccountProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AccountProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
