import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: '.', // raiz do projeto
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client')
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html') // index.html fora do client
    }
  }
});
