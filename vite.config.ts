import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: "client",
  build: {
    outDir: "../dist/client",
    rollupOptions: {
      // Evita erros de módulos não resolvidos (comuns no Render)
      external: (id) => {
        // Ignora módulos do Node.js (node:fs, etc) e caminhos estranhos
        return /^node:/.test(id) || id.includes("\0") || id.startsWith("virtual:");
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
    },
  },
});