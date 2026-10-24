import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import type { Product } from "../data/types";
import { canPurchase, cartReducer, computeTotals, loadCart, resolveLines, resolveVariant, saveCart, type CartTotals, type ResolvedLine } from "../services/cart";
import { useToast } from "./ToastContext";

interface CartContextValue {
  lines: ResolvedLine[];
  totals: CartTotals;
  add: (product: Product, qty?: number, options?: Record<string, string>) => boolean;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, dispatch] = useReducer(cartReducer, undefined, loadCart);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toast = useToast();

  useEffect(() => saveCart(raw), [raw]);

  // Sincroniza el carrito entre pestañas.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "cc-demo-cart-v1") dispatch({ type: "replace", lines: loadCart() });
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const lines = useMemo(() => resolveLines(raw), [raw]);
  const totals = useMemo(() => computeTotals(lines), [lines]);

  const add = useCallback(
    (product: Product, qty = 1, options?: Record<string, string>) => {
      const { availability } = resolveVariant(product, options);
      if (!canPurchase(availability)) {
        toast.show({ tone: "error", title: "Producto agotado", message: "Esta opción no está disponible ahora mismo." });
        return false;
      }
      dispatch({ type: "add", productId: product.id, qty, options });
      toast.show({
        tone: "success",
        title: availability === "preorder" ? "Reserva añadida al carrito" : "Añadido al carrito",
        message: product.name,
        action: { label: "Ver carrito", onClick: () => setDrawerOpen(true) },
      });
      return true;
    },
    [toast],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      totals,
      add,
      setQty: (key, qty) => dispatch({ type: "setQty", key, qty }),
      remove: (key) => {
        const line = lines.find((l) => l.key === key);
        dispatch({ type: "remove", key });
        if (line) {
          toast.show({
            tone: "info",
            title: "Producto eliminado",
            message: line.product.name,
            action: { label: "Deshacer", onClick: () => dispatch({ type: "add", productId: line.productId, options: line.options, qty: line.qty }) },
          });
        }
      },
      clear: () => dispatch({ type: "clear" }),
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    }),
    [lines, totals, add, drawerOpen, toast],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
