import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3010,
    proxy: {
      '/api/sanity': {
        target: 'https://ojsvc60h.api.sanity.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/sanity/, '')
      }
    }
  },
  esbuild: {
    loader: 'tsx',
    include: /src\/.*\.[tj]sx?$/,
    exclude: []
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})