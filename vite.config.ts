import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

declare const process: { env: Record<string, string | undefined> }

// This build's id: the commit on GitHub Actions (GITHUB_SHA), else the build time. The app compares it with the live
// /blend/version.json to pick up a new deploy (src/lib/update.ts).
const BUILD = process.env.GITHUB_SHA?.slice(0, 7) ?? `local-${new Date().toISOString().slice(0, 16)}`

// The app is served from the portfolio at /blend/ (GitHub Pages project site), so dev uses the same base.
export default defineConfig({
  base: '/blend/',
  define: { __BUILD__: JSON.stringify(BUILD) },
  plugins: [
    react(),
    {
      name: 'version-file',
      apply: 'build',
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ build: BUILD }) })
      },
    },
  ],
})
