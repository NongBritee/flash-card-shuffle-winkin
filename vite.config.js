import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' + hash routing → the build works from any folder (GitHub Pages project URL, Cloudflare Pages, a USB stick…)
export default defineConfig({
  base: './',
  plugins: [react()],
});
