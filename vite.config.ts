import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Verhindert, dass Vite PGlite und pgvector falsch bündelt
    exclude: ["@electric-sql/pglite", "@electric-sql/pglite/vector"],
  },
  server: {
    // Stellt sicher, dass SharedArrayBuffer / OPFS im Browser erlaubt sind
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
});