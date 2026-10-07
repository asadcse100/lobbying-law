import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  esbuild: {
    jsx: 'transform',
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
