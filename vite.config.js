import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5183,
    // Para reenviar cualquier solicitud que empiece por /api
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8001', // URL del backend
        changeOrigin: true,
      },
    },
  },
})
