import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), cloudflare()],
  base: '/',
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    // 本地开发时的配置
    hmr: process.env.NODE_ENV === 'development',
    allowedHosts: [
      'gjbkstcx.help',
      'app.gjbkstcx.help',
      '.gjbkstcx.help',
    ],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
  },
})