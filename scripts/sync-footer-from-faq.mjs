/*
  Sync footer expandable content from Landing Page FAQ

  Usage:
    SANITY_PROJECT_ID=ojsvc60h SANITY_DATASET=production \
    SANITY_WRITE_TOKEN=YOUR_WRITE_TOKEN \
    node scripts/sync-footer-from-faq.mjs
*/

import { createClient } from '@sanity/client'

const PROJECT_ID = process.env.SANITY_PROJECT_ID || 'ojsvc60h'
const DATASET = process.env.SANITY_DATASET || 'production'
const API_VERSION = '2021-10-21'
const TOKEN = process.env.SANITY_WRITE_TOKEN

if (!TOKEN) {
  console.error('Missing SANITY_WRITE_TOKEN')
  process.exit(1)
}

const client = createClient({ projectId: PROJECT_ID, dataset: DATASET, apiVersion: API_VERSION, token: TOKEN, useCdn: false })

const LP_Q = `*[_type=="landingPage"]|order(_updatedAt desc)[0]{
  _id,
  faq{sections[]{sectionTitle, questions[]{question, answer, "slug": slug.current}}}
}`

function findQuestion(sections, predicate) {
  for (const sec of sections) {
    for (const q of (sec.questions || [])) {
      if (predicate(q, sec)) return q
    }
  }
  return null
}

function buildQA(title, body) {
  return `**${title}**\n\n${body}`
}

function buildParagraphs(...blocks) {
  return blocks.filter(Boolean).join('\n\n')
}

async function run() {
  const lp = await client.fetch(LP_Q)
  const sections = lp?.faq?.sections || []

  // Map the expected entries
  const qWhereShip = findQuestion(sections, q => /where do you ship from/i.test(q.question))
  const qHowQuick = findQuestion(sections, q => /how quickly .* ship/i.test(q.question))
  const qProtection = findQuestion(sections, q => /shipping protection/i.test(q.question))
  const qStorage = findQuestion(sections, q => /refrigerate peptides/i.test(q.question))
  const qTested = findQuestion(sections, q => /are your peptides tested/i.test(q.question))
  const qTerms = findQuestion(sections, q => /terms of service/i.test(q.question))
  const qPrivacy = findQuestion(sections, q => /privacy policy/i.test(q.question))

  const shippingBody = buildParagraphs(
    qWhereShip && buildQA(qWhereShip.question, qWhereShip.answer),
    qHowQuick && buildQA(qHowQuick.question, qHowQuick.answer),
    qProtection && buildQA(qProtection.question, qProtection.answer)
  )

  const storageBody = qStorage ? buildQA(qStorage.question, qStorage.answer) : ''
  const testedBody = qTested ? buildQA(qTested.question, qTested.answer) : ''
  const termsBody = qTerms ? buildQA(qTerms.question, qTerms.answer) : ''
  const privacyBody = qPrivacy ? buildQA(qPrivacy.question, qPrivacy.answer) : ''

  // Fetch footer
  const footer = await client.fetch(`*[_type=='footer'][0]{ _id, sections }`)
  const id = footer?._id || 'drafts.footer-singleton'
  const sectionsFooter = footer?.sections || {}

  function updateLink(list, title, body) {
    if (!Array.isArray(list)) return list
    const idx = list.findIndex(l => (l?.title || '').trim().toLowerCase() === title.toLowerCase())
    if (idx === -1) return list
    const next = { ...list[idx] }
    if (body) {
      next.hasExpandableContent = true
      next.expandableContent = body
    }
    list[idx] = next
    return list
  }

  const nextSections = { ...sectionsFooter }
  if (nextSections.support?.links) nextSections.support.links = updateLink(nextSections.support.links, 'Shipping', shippingBody)
  if (nextSections.learn?.links) {
    nextSections.learn.links = updateLink(nextSections.learn.links, 'Storage Guide', storageBody)
    nextSections.learn.links = updateLink(nextSections.learn.links, 'Quality & Testing', testedBody)
  }
  if (nextSections.company?.links) {
    nextSections.company.links = updateLink(nextSections.company.links, 'Terms of Service', termsBody)
    nextSections.company.links = updateLink(nextSections.company.links, 'Privacy Policy', privacyBody)
  }

  const res = await client.patch(id).set({ sections: nextSections }).commit()
  console.log('Synced footer expandable content from FAQ →', res._id)
}

run().catch(e => { console.error(e); process.exit(1) })


