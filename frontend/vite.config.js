import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all network interfaces for mobile access
    proxy: {
      '/api': 'http://127.0.0.1:5001'
    }
  }
})
