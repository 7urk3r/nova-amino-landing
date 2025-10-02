/*
  Product migration script

  - Reads all product documents
  - Copies/normalizes fields into the canonical schema used by the site
  - Leaves original fields in place (non-destructive)

  Usage:
    SANITY_PROJECT_ID=ojsvc60h SANITY_DATASET=production \
    SANITY_WRITE_TOKEN=YOUR_WRITE_TOKEN \
    node scripts/migrate-products.mjs --dry   # dry run (default)

    node scripts/migrate-products.mjs         # applies patches

  Notes:
    - Requires a token with write access to the dataset
    - If some images are only available as external URLs, the script uploads
      them as Sanity assets and links them to the new fields.
*/

import { createClient } from '@sanity/client'

const PROJECT_ID = process.env.SANITY_PROJECT_ID || 'ojsvc60h'
const DATASET = process.env.SANITY_DATASET || 'production'
const API_VERSION = '2021-10-21'
const TOKEN = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_READ_TOKEN
const DRY = process.argv.includes('--dry') || process.env.DRY_RUN === '1'

if (!TOKEN) {
  console.error('Missing SANITY_WRITE_TOKEN (or SANITY_READ_TOKEN). Aborting.')
  process.exit(1)
}

const client = createClient({ projectId: PROJECT_ID, dataset: DATASET, apiVersion: API_VERSION, token: TOKEN, useCdn: false })

function asImageRef(img) {
  if (!img) return null
  if (typeof img === 'object' && img.asset && img.asset._ref) return img
  return null
}

async function uploadFromUrl(url) {
  try {
    if (!url || typeof url !== 'string' || !/^https?:/.test(url)) return null
    const res = await fetch(url)
    if (!res.ok) return null
    const buf = Buffer.from(await res.arrayBuffer())
    const filename = url.split('/').pop()?.split('?')[0] || 'image.jpg'
    const asset = await client.assets.upload('image', buf, { filename })
    return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
  } catch {
    return null
  }
}

async function normalizeOneImage(doc, keys) {
  for (const k of keys) {
    const v = doc?.[k]
    const asRef = asImageRef(v)
    if (asRef) return asRef
    if (typeof v === 'string') {
      const up = await uploadFromUrl(v)
      if (up) return up
    }
    // nested paths like images.front or arrays
    if (k.includes('.')) {
      const [root, leaf] = k.split('.')
      const val = doc?.[root]?.[leaf]
      const ref = asImageRef(val)
      if (ref) return ref
    }
    if (Array.isArray(v) && v.length) {
      // array of images/urls
      const first = v[0]
      const ref = asImageRef(first)
      if (ref) return ref
      if (typeof first === 'string') {
        const up = await uploadFromUrl(first)
        if (up) return up
      }
    }
  }
  return null
}

async function normalizeGallery(doc, keys) {
  const urls = []
  for (const k of keys) {
    const v = doc?.[k]
    if (Array.isArray(v)) {
      for (const it of v) {
        if (typeof it === 'string') urls.push(it)
        else if (it?.asset?._ref) urls.push(it)
        else if (it?.asset?._id) urls.push({ _type: 'image', asset: { _type: 'reference', _ref: it.asset._id } })
      }
    }
  }
  const out = []
  for (const x of urls) {
    if (typeof x === 'string') {
      const up = await uploadFromUrl(x)
      if (up) out.push(up)
    } else if (x?.asset?._ref) {
      out.push(x)
    }
  }
  return out
}

function normText(...vals) {
  for (const v of vals) if (typeof v === 'string' && v.trim()) return v
  return undefined
}

function normArrayStrings(val) {
  if (!val) return undefined
  if (Array.isArray(val)) return val.map(String).filter(Boolean)
  if (typeof val === 'string') return [val]
  return undefined
}

function normDosages(list) {
  if (!Array.isArray(list)) return undefined
  return list.map((d) => ({
    _type: 'object',
    label: d?.label || d?.name || d?.title || (d?.amount ? String(d.amount) + (d?.unit || '') : undefined),
    amount: typeof d?.amount === 'number' ? d.amount : undefined,
    unit: d?.unit || undefined,
    price: typeof d?.price === 'number' ? d.price : undefined,
    sku: d?.sku || undefined,
  }))
}

async function run() {
  console.log('Fetching products…')
  const docs = await client.fetch('*[_type=="product"]')
  console.log(`Found ${docs.length} products`)

  let changed = 0
  for (const doc of docs) {
    const set = {}

    // description
    set.description = normText(doc.description, doc.body, doc.blurb)

    // images
    set.frontImage = (await normalizeOneImage(doc, ['frontImage', 'imageFront', 'images.front', 'images', 'gallery', 'pictures', 'photos', 'mainImage', 'image'])) || doc.frontImage || undefined
    set.backImage = (await normalizeOneImage(doc, ['backImage', 'imageBack', 'images.back', 'images', 'gallery', 'pictures', 'photos'])) || doc.backImage || undefined
    const gallery = await normalizeGallery(doc, ['gallery', 'images', 'pictures', 'photos', 'productImages'])
    if (gallery.length) set.gallery = gallery

    // pricing
    set.basePrice = (typeof doc.basePrice === 'number' ? doc.basePrice : undefined) ?? (typeof doc.price === 'number' ? doc.price : undefined) ?? (typeof doc.msrp === 'number' ? doc.msrp : undefined) ?? (typeof doc.defaultPrice === 'number' ? doc.defaultPrice : undefined)

    // variants
    const rawVariants = doc.dosages || doc.variants || doc.dosageOptions || doc.sizes || doc.options
    const normVariants = normDosages(rawVariants)
    if (normVariants && normVariants.length) set.dosages = normVariants

    // tags
    set.areaOfStudy = normArrayStrings(doc.areaOfStudy || doc.studies || doc.tags)
    set.benefits = normArrayStrings(doc.benefits || doc.benefitAssignments)

    // availability/order defaults
    if (typeof doc.available !== 'boolean') set.available = true
    if (typeof doc.order !== 'number' && typeof doc.sort !== 'undefined') set.order = Number(doc.sort) || undefined

    // Remove undefined keys
    Object.keys(set).forEach((k) => set[k] === undefined && delete set[k])

    if (Object.keys(set).length === 0) continue

    changed++
    if (DRY) {
      console.log(`[DRY] Would patch ${doc._id} with`, set)
    } else {
      await client.patch(doc._id).set(set).commit()
      console.log(`Patched ${doc._id}`)
    }
  }
  console.log(DRY ? `Dry run complete. ${changed} docs would be patched.` : `Done. Patched ${changed} docs.`)
}

run().catch((e) => { console.error(e); process.exit(1) })

