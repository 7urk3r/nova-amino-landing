import { createClient } from '@sanity/client'

const PROJECT_ID = import.meta.env.SANITY_PROJECT_ID || 'ojsvc60h'
const DATASET = import.meta.env.SANITY_DATASET || 'production'
const API_VERSION = '2021-10-21'
const TOKEN = import.meta.env.SANITY_READ_TOKEN

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token: TOKEN,
  useCdn: false,
})

export async function q<T = any>(query: string, params?: Record<string, any>): Promise<T> {
  return client.fetch(query, params)
}

