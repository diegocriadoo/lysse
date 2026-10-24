import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * Cuenta de DEMOSTRACIÓN. No hay contraseñas ni servidor: sólo se guarda un
 * nombre y un email en el navegador para personalizar la experiencia.
 */
export interface DemoUser {
  name: string;
  email: string;
}

const KEY = "cc-demo-user-v1";

function load(): DemoUser | null {
  try {
    const u = JSON.parse(localStorage.getItem(KEY) ?? "null");
    return u && typeof u.name === "string" && typeof u.email === "string" ? u : null;
  } catch {
    return null;
  }
}

const AccountContext = createContext<{ user: DemoUser | null; signIn: (u: DemoUser) => void; signOut: () => void } | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(load);
  const value = useMemo(
    () => ({
      user,
      signIn: (u: DemoUser) => {
        setUser(u);
        try {
          localStorage.setItem(KEY, JSON.stringify(u));
        } catch {
          /* sin almacenamiento */
        }
      },
      signOut: () => {
        setUser(null);
        try {
          localStorage.removeItem(KEY);
        } catch {
          /* sin almacenamiento */
        }
      },
    }),
    [user],
  );
  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount debe usarse dentro de <AccountProvider>");
  return ctx;
}
