/*
  Landing Page migration: populate inline sections from nested/legacy content

  - Reads the newest landingPage document
  - If heroInline/whyUsInline/marqueeInline are empty, copies content from:
    sections[] blocks, content.{hero,whyUs,marquee}, or referenced hero/whyUs/marquee docs
  - Non-destructive: leaves legacy fields in place

  Usage:
    SANITY_PROJECT_ID=ojsvc60h SANITY_DATASET=production \
    SANITY_WRITE_TOKEN=YOUR_WRITE_TOKEN \
    node scripts/migrate-landing.mjs --dry   # dry run

    node scripts/migrate-landing.mjs         # apply patches
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

const LP_Q = `*[_type=="landingPage"]|order(_updatedAt desc)[0]{
  _id,
  heroInline,
  hero->{headline, subheadline, ctaText, ctaHref},
  whyUsInline[]{title, body, order, icon},
  whyUs->{features[]-> { title, body, order, icon }},
  marqueeInline{title, subtitle, quotes[]},
  marquee->{title, subtitle, quotes[]->{compound, quote, scientist, organization, source}},
  sections[]{
    _type,
    ...select(
      _type == 'hero' => { headline, subheadline, ctaText, ctaHref },
      _type == 'whyUs' => { features[]-> { title, body, order, icon } },
      _type == 'marqueeSection' => { title, subtitle, quotes[]->{compound, quote, scientist, organization, source} }
    )
  },
  content{
    hero->{headline, subheadline, ctaText, ctaHref},
    whyUs->{features[]-> { title, body, order, icon }},
    marquee->{title, subtitle, quotes[]->{compound, quote, scientist, organization, source}}
  }
}`

function firstHero(lp){
  return lp?.heroInline
    || lp?.hero
    || (lp?.sections||[]).find(s=>s?._type==='hero')
    || lp?.content?.hero
}

function firstWhyUsFeatures(lp){
  if (Array.isArray(lp?.whyUsInline) && lp.whyUsInline.length) return lp.whyUsInline
  if (lp?.whyUs?.features) return lp.whyUs.features
  const sec = (lp?.sections||[]).find(s=>s?._type==='whyUs')
  if (sec?.features) return sec.features
  return lp?.content?.whyUs?.features
}

function firstMarquee(lp){
  return lp?.marqueeInline
    || lp?.marquee
    || (lp?.sections||[]).find(s=>s?._type==='marqueeSection')
    || lp?.content?.marquee
}

function asImageRef(img){
  if (img && img.asset && img.asset._ref) return img
  return undefined
}

async function run(){
  const lp = await client.fetch(LP_Q)
  if(!lp){ console.log('No landingPage found.'); return }

  const set = {}

  // Hero inline if missing
  if(!lp.heroInline){
    const h = firstHero(lp)
    if(h){ set.heroInline = { headline:h.headline, subheadline:h.subheadline, ctaText:h.ctaText, ctaHref:h.ctaHref } }
  }

  // WhyUs inline if missing
  if(!(Array.isArray(lp.whyUsInline) && lp.whyUsInline.length)){
    const feats = firstWhyUsFeatures(lp)
    if(Array.isArray(feats) && feats.length){
      set.whyUsInline = feats.map(f=>({
        _type: 'featureCardInline',
        title: f?.title,
        body: f?.body,
        order: typeof f?.order==='number' ? f.order : undefined,
        icon: asImageRef(f?.icon)
      }))
    }
  }

  // Marquee inline if missing
  if(!lp.marqueeInline){
    const m = firstMarquee(lp)
    if(m){
      set.marqueeInline = {
        _type:'marqueeInline',
        title: m.title || 'The Science Speaks',
        subtitle: m.subtitle,
        quotes: Array.isArray(m.quotes) ? m.quotes.map(q=>({ _type:'quoteInline', compound:q.compound, quote:q.quote, scientist:q.scientist, organization:q.organization, source:q.source })) : []
      }
    }
  }

  Object.keys(set).forEach(k => set[k]===undefined && delete set[k])
  if(Object.keys(set).length===0){ console.log('Nothing to migrate. Inline fields already populated.'); return }

  console.log((DRY? '[DRY] Would patch ' : 'Patching ') + lp._id, set)
  if(!DRY){
    const res = await client.patch(lp._id).set(set).commit()
    console.log('Patched', res._id)
  }
}

run().catch(e => { console.error(e); process.exit(1) })

