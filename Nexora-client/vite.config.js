import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/main': 'http://localhost:8000',
      '/auth': 'http://localhost:8000',
      '/genai': 'http://localhost:8000',
    },
  },
})