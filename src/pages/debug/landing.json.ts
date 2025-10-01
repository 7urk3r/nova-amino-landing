import type { APIContext } from 'astro'
import { q } from '../../lib/sanityServer'

const landingQ = `*[_type=="landingPage"]|order(_updatedAt desc)[0]{
  heroInline,
  hero->{headline, subheadline, ctaText, ctaHref},
  missionStatement->{content},
  whyUsInline[]{title, body, order, "iconUrl": icon.asset->url},
  whyUs->{features[]-> { title, body, order, "iconUrl": coalesce(icon.asset->url, icon) }},
  marqueeInline{title, subtitle, quotes[]},
  marquee->{title, subtitle, quotes[]->{compound, quote, scientist, organization, source}}
}`

export async function get({ request }: APIContext) {
  try{
    const data = await q(landingQ)
    return new Response(JSON.stringify({ ok:true, data }, null, 2), { headers: { 'content-type':'application/json' } })
  }catch(e:any){
    return new Response(JSON.stringify({ ok:false, error: String(e) }, null, 2), { status: 500, headers: { 'content-type':'application/json' } })
  }
}

