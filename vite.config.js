import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Adicione esta secção:
  server: {
    proxy: {
      // Redireciona requisições que começam com /api para o seu backend
      '/api': {
        target: 'http://localhost:3001', // A porta do seu backend
        changeOrigin: true,
      }
    }
  }
})