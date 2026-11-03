import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The app is served from the portfolio at /blend/ (GitHub Pages project site), so dev uses the same base.
export default defineConfig({
  base: '/blend/',
  plugins: [react()],
})
