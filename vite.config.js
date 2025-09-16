import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  optimizeDeps: {
    include: ['buffer'],
  },
  preview: {
    allowedHosts: [
      'whale-app-3mhy8.ondigitalocean.app',
      'seashell-app-vgu3a.ondigitalocean.app',
'targetboard.schoolense.com'
    ]
  }
})
