import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { 
    proxy: {
      '/api': {
        // GANTI 8000 jika port Laravel Anda berbeda
        target: 'http://127.0.0.1:8000', 
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''), // Tidak perlu rewrite karena Laravel Anda menggunakan /api
      },
    },
    host: '127.0.0.1', 
    port: 5173 },
});
