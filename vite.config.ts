import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // Relative base path ensures assets load properly on GitHub Pages and custom domains
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  }
});
