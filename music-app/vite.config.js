import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path for portfolio integration on GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/portfolio/static/projects/music-app/',
})
