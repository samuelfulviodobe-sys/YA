import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: "client",
  build: {
    outDir: "../dist/client",
    emptyOutDir: true, // Resolve o aviso de outDir
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