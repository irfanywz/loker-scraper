import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'
import tailwindConfig from './tailwind.config.js'
import tailwindcss from '@tailwindcss/vite'

import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss({ config: tailwindConfig }),
  ],
  base: '',
  build: {
    // Output harus satu tingkat di atas folder proyek Vue, di folder 'static'
    outDir: '../resources/static/dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Pisahkan library besar dari node_modules ke dalam chunk terpisah
          // untuk caching yang lebih baik oleh browser.
          if (id.includes('node_modules')) {        
            return 'vendor'; // Kelompokkan sisa node_modules
          }
          // pisahkan component
          if (id.includes('components')) {
            return 'components';
          }
          // pisahkan lainnya
          if (id.includes('views')) {
            return 'views';
          }
          if (id.includes('stores')) {
            return 'stores';
          }
          if (id.includes('utils')) {
            return 'utils';
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      // String shorthand: '/foo' -> 'http://localhost:4567/foo'
      // '/api' adalah path yang ingin Anda proxy-kan
      '/api': {
        target: 'http://localhost:8888', // Ganti dengan URL backend Tornado Anda
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '') // Gunakan ini jika backend Anda tidak memiliki prefix /api
      },
      '/storage': {
        target: 'http://localhost:8888',
        changeOrigin: true,
      },
    }
  }
})
