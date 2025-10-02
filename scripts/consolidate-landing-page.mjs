/*
  Consolidate Landing Page: Move all separate section documents into one landing page

  - Fetches all separate documents (hero, copyBlock, card, marquee, studyFeed, faq)
  - Creates or updates a single landingPage document with all sections embedded
  - Preserves all content, images, and field data

  Usage:
    SANITY_WRITE_TOKEN=YOUR_WRITE_TOKEN \
    node scripts/consolidate-landing-page.mjs --dry   # dry run

    node scripts/consolidate-landing-page.mjs         # apply changes
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

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token: TOKEN,
  useCdn: false
})

// Query to get all separate section documents
const SECTIONS_Q = `{
  "hero": *[_type=="hero"][0]{headline, subheadline, ctaButtonCopy, heroImage},
  "copyBlock": *[_type=="copyBlock"][0]{content},
  "whyUsCards": *[_type=="card"][0]{cards[]},
  "marquee": *[_type=="marquee"][0]{title, subtitle, headline, subheadline, quotes[], cards[]},
  "studyFeed": *[_type=="studyFeed"][0],
  "faq": *[_type=="faq"][0],
  "existingLandingPage": *[_type=="landingPage"][0]
}`

async function consolidateLandingPage() {
  console.log('Fetching all section documents...')

  const sections = await client.fetch(SECTIONS_Q)

  console.log('Found sections:', {
    hero: !!sections.hero,
    copyBlock: !!sections.copyBlock,
    whyUsCards: !!sections.whyUsCards?.cards?.length,
    marquee: !!sections.marquee,
    studyFeed: !!sections.studyFeed,
    faq: !!sections.faq,
    existingLandingPage: !!sections.existingLandingPage
  })

  // Build the consolidated landing page document
  const landingPageDoc = {
    _type: 'landingPage',
    title: 'Nova Amino Landing Page',
    slug: {
      _type: 'slug',
      current: 'home'
    },

    // Hero Section
    hero: sections.hero ? {
      heroImage: sections.hero.heroImage,
      headline: sections.hero.headline,
      subheadline: sections.hero.subheadline,
      ctaButtonCopy: sections.hero.ctaButtonCopy,
    } : undefined,

    // Mission Statement
    missionStatement: sections.copyBlock ? {
      content: sections.copyBlock.content,
    } : undefined,

    // Why Us Section
    whyUs: sections.whyUsCards?.cards ? {
      cards: sections.whyUsCards.cards.map(card => ({
        image: card.image,
        headline: card.headline,
        subheadline: card.subheadline,
      }))
    } : undefined,

    // Marquee Section
    marquee: sections.marquee ? {
      title: sections.marquee.title || sections.marquee.headline || 'The Science Speaks',
      subtitle: sections.marquee.subtitle || sections.marquee.subheadline,
      quotes: (sections.marquee.quotes || sections.marquee.cards || []).map(item => ({
        compound: item.compound || item.title,
        quote: item.quote,
        scientist: item.scientist || item.personQuoted,
        source: item.source,
        sourceLink: item.sourceLink,
      }))
    } : undefined,

    // Study Feed Section
    studyFeed: sections.studyFeed ? {
      enabled: sections.studyFeed.enabled !== false,
      numberOfStudies: sections.studyFeed.numberOfStudies || 6,
      manualOverride: sections.studyFeed.manualOverride || []
    } : undefined,

    // FAQ Section
    faq: sections.faq ? {
      enabled: sections.faq.enabled !== false,
      title: sections.faq.title || 'Frequently Asked Questions',
      questions: sections.faq.questions?.map(q => ({
        question: q.question,
        answer: q.answer,
      })) || []
    } : undefined,

    // SEO Metadata
    seoMetadata: {
      metaTitle: 'Nova Amino - Research Use Peptides',
      metaDescription: 'Premium research peptides and compounds for scientific use.',
    }
  }

  // Remove undefined fields
  Object.keys(landingPageDoc).forEach(key => {
    if (landingPageDoc[key] === undefined) {
      delete landingPageDoc[key]
    }
  })

  console.log((DRY ? '[DRY] Would create/update' : 'Creating/updating'), 'consolidated landing page with sections:',
    Object.keys(landingPageDoc).filter(k => !['_type', 'title', 'slug', 'seoMetadata'].includes(k)))

  if (DRY) {
    console.log('Marquee data:', JSON.stringify(landingPageDoc.marquee, null, 2))
  }

  if (!DRY) {
    let result
    if (sections.existingLandingPage) {
      // Update existing
      result = await client.patch(sections.existingLandingPage._id).set(landingPageDoc).commit()
      console.log('Updated existing landing page:', result._id)
    } else {
      // Create new
      result = await client.create(landingPageDoc)
      console.log('Created new landing page:', result._id)
    }
  }

  console.log('Consolidation complete!')
}

consolidateLandingPage().catch(e => {
  console.error('Error:', e)
  process.exit(1)
})