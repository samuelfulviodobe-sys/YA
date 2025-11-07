import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: "client",
  build: {
    outDir: "../dist/client",
    emptyOutDir: true, // ← Resolve o aviso "outDir não será esvaziado"
    rollupOptions: {
      // ← RESOLVE O ERRO "externalizar este módulo"
      external: (id) => {
        return (
          id.startsWith("virtual:") ||
          id.includes("\0") ||
          /^node:/.test(id) ||
          // Adicione aqui qualquer módulo que ainda falhar (ex: se for "lucide-react")
          // id === "lucide-react"
          false
        );
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
    },
  },
});