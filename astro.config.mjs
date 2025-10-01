import { defineConfig } from 'astro/config'
import sanity from '@sanity/astro'
import react from '@astrojs/react'

export default defineConfig({
  server: { host: '127.0.0.1', port: 3012 },
  devToolbar: { enabled: true },
  vite: {
    optimizeDeps: {
      exclude: ['sanity', 'sanity/desk', '@sanity/vision', '@sanity/astro', '@sanity/*'],
      include: ['prop-types', 'void-elements', 'lodash']
    },
    ssr: {
      noExternal: ['prop-types', 'void-elements', 'lodash']
    },
    resolve: {
      alias: {
        'prop-types': 'prop-types/index.js',
        'void-elements': 'void-elements/index.js',
        'lodash/debounce': 'lodash/debounce.js'
      }
    }
  },
  integrations: [
    react(),
    sanity({
      projectId: process.env.SANITY_PROJECT_ID || 'ojsvc60h',
      dataset: process.env.SANITY_DATASET || 'production',
      apiVersion: '2021-10-21',
      useCdn: false,
      token: process.env.SANITY_WRITE_TOKEN || process.env.SANITY_READ_TOKEN,
      studioBasePath: '/studio'
    })
  ]
})
