import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// `vite build --mode single` genera una versión en un solo archivo HTML
// (con rutas por hash) para abrirla sin servidor; ver scripts/inline.mjs.
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build:
    mode === "single"
      ? {
          outDir: "dist-single",
          assetsInlineLimit: Number.MAX_SAFE_INTEGER,
          cssCodeSplit: false,
          rollupOptions: { output: { inlineDynamicImports: true } },
        }
      : undefined,
  test: {
    include: ["src/**/*.test.ts"],
  },
}));
