import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'
import alias from '@rollup/plugin-alias'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Smart-Expense',
        short_name: 'Expense',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ],
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#16a34a',
      },
    }), 
    alias({ entries:[{ find:'@', replacement:path.resolve(__dirname,'src') }] })
  ],

  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000', // ✅ FIXED: Use IPv4 instead of localhost
        changeOrigin: true,
      },
    },
  },
});
