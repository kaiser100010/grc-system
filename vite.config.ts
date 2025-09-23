// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './frontend/src'),
      '@components': path.resolve(__dirname, './frontend/src/components'),
      '@services': path.resolve(__dirname, './frontend/src/services'),
      '@hooks': path.resolve(__dirname, './frontend/src/hooks'),
      '@utils': path.resolve(__dirname, './frontend/src/utils'),
      '@types': path.resolve(__dirname, './frontend/src/types'),
      '@store': path.resolve(__dirname, './frontend/src/store'),
      '@styles': path.resolve(__dirname, './frontend/src/styles')
    }
  },
  root: './frontend',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
});