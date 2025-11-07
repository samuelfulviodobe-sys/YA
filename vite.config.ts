import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: "client",

  plugins: [react()],

  server: {
    host: true,
    allowedHosts: ['.onrender.com'], // Permite subdomínios do Render
  },

  preview: {
    allowedHosts: ['.onrender.com'], // Permite preview no Render
  },

  build: {
    outDir: "../dist/client",
    emptyOutDir: true,
    rollupOptions: {
      external: (id) => {
        return id.startsWith("virtual:") || id.includes("\0") || /^node:/.test(id);
      },
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
    },
  },
});
