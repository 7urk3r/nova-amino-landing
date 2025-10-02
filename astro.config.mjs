import {defineConfig} from 'astro/config'
import sanity from '@sanity/astro'
import react from '@astrojs/react'
import {fileURLToPath} from 'node:url'
import {dirname, resolve} from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  server: { host: '127.0.0.1', port: 3012 },
  devToolbar: { enabled: true },
  vite: {
    optimizeDeps: {
      exclude: ['sanity', 'sanity/desk', '@sanity/vision', '@sanity/astro'],
      include: ['prop-types', 'void-elements', 'ts-brand', 'debug', 'arrify', 'semver', 'escape-string-regexp', 'camelcase', 'get-port', 'chalk'],
      force: true
    },
    ssr: {
      external: ['lodash', 'lodash/deburr', 'lodash/partition', 'lodash/debounce'],
      noExternal: ['@sanity/*', 'prop-types', 'void-elements', 'ts-brand', 'debug', 'arrify', 'semver', 'escape-string-regexp', 'camelcase', 'get-port', 'chalk'],
    },
    resolve: {
      alias: {
        'lodash': 'lodash-es',
        'lodash/deburr': 'lodash-es/deburr.js',
        'lodash/partition': 'lodash-es/partition.js',
        'lodash/debounce': 'lodash-es/debounce.js',
      },
    },
    esbuild: {
      target: 'node14'
    },
    define: {
      global: 'globalThis',
    },
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
