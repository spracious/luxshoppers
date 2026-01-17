import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3300, // Frontend port
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Backend URL
        changeOrigin: true, // Ensure CORS issues are avoided
        secure: false, // If your backend is running on HTTP instead of HTTPS
      },
    },
  },
});


