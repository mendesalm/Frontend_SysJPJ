import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy para as chamadas de API (ex: /api/membros)
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      // Proxy para a pasta de uploads (áudios, imagens, etc.)
      "/uploads": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
