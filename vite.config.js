import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: [
      'whale-app-3mhy8.ondigitalocean.app',
      'seashell-app-vgu3a.ondigitalocean.app'
    ]
  }
})
