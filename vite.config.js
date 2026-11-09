import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' => funziona su GitHub Pages in qualsiasi sottocartella.
// target safari14 => compatibile con iPad Air 2 (iPadOS 15).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { target: 'safari14', cssTarget: 'safari14' },
})
