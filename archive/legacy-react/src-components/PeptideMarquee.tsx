import React from 'react';
import Marquee from './Marquee';

// TOP 12 MARKETING-POSITIVE & BENEFICIAL PEPTIDE QUOTES - Curated for maximum impact
const scientificQuotes = [
  {
    compound: "Semaglutide",
    quote: "Semaglutide promotes weight loss, improves metabolic health, and offers benefits across related conditions, with a favorable clinical profile in type 2 diabetes and obesity.",
    scientist: "Dr. Mesk Alkhatib",
    organization: "Peer-reviewed Journal",
    logo: "/logos/medical.svg",
    source: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12413075/"
  },
  {
    compound: "Tirzepatide",
    quote: "In adults with obesity or overweight, tirzepatide was associated with body weight reduction and improvements in insulin sensitivity and β‑cell function.",
    scientist: "SURMOUNT‑1 investigators",
    organization: "Peer-reviewed clinical study",
    logo: "/logos/medical.svg",
    source: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12368374/"
  },
  {
    compound: "Oxytocin",
    quote: "We previously reported that oxytocin can induce pain relief and described the possibility how oxytocin in the dorsal horn and/or the dorsal root ganglion relieves joint and muscle pain.",
    scientist: "Dr. Eiji Ito",
    organization: "Tokyo Women's Medical University",
    logo: "/logos/medical.svg",
    source: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6784812/"
  },
  {
    compound: "Semaglutide",
    quote: "Clinicians should consider semaglutide's benefits including improved quality of life and reduced hospitalizations alongside its safety profile and side effects.",
    scientist: "Dr. Rui Wu",
    organization: "Systematic Review & Meta-analysis",
    logo: "/logos/medical.svg",
    source: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12403603/"
  },
  {
    compound: "Oxytocin",
    quote: "Oxytocin has taken the lead as the most investigated neurohormone that modulates social cognition, influences parenting behaviors, facilitates bonding, and biologically buffers against stressors.",
    scientist: "Dr. Suma Jacob",
    organization: "University of Minnesota",
    logo: "/logos/medical.svg",
    source: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10966149/"
  },
  {
    compound: "Cagrilintide",
    quote: "Overall, the current evidence suggests that both pramlintide and cagrilintide are safe, effective, and promising drugs that successfully reduce body weight in patients with T2DM and consequently regulate glucose homeostasis.",
    scientist: "Dr. Stjepan Eržen",
    organization: "Peer-reviewed Review",
    logo: "/logos/medical.svg",
    source: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10855385/"
  },
  {
    compound: "GHK-Cu",
    quote: "GHK-Cu alleviated weight loss, improved the disease activity index, reduced colonic edema and shortening, attenuated inflammatory damage, increased goblet cell numbers, suppressed inflammatory cytokines such as TNF-α, IL-6, and IL-1β, and promoted mucosal repair.",
    scientist: "Dr. Mao S",
    organization: "Peer-reviewed Journal",
    logo: "/logos/medical.svg",
    source: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12263609/"
  },
  {
    compound: "Tesamorelin",
    quote: "Tesamorelin, a growth hormone-releasing hormone analog, has previously demonstrated significant reductions in visceral adipose fat in two phase 3 randomized controlled trials in people with HIV.",
    scientist: "Dr. Steven K Grinspoon",
    organization: "Clinical Research",
    logo: "/logos/medical.svg",
    source: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11778490/"
  },
  {
    compound: "Ipamorelin",
    quote: "Ipamorelin is a new and potent synthetic pentapeptide which has distinct and specific growth hormone (GH)-releasing properties.",
    scientist: "Dr. P. B. Johansen",
    organization: "European Journal of Endocrinology",
    logo: "/logos/medical.svg",
    source: "https://pubmed.ncbi.nlm.nih.gov/10373343/"
  },
  {
    compound: "Survodutide",
    quote: "This systematic review and meta-analysis holistically analyzed the body weight lowering, glycemic efficacy, and safety of survodutide.",
    scientist: "Dr. Dutta D",
    organization: "Systematic Review & Meta-Analysis",
    logo: "/logos/medical.svg",
    source: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12274044/"
  },
  {
    compound: "Thymosin Beta-4",
    quote: "Thymosin beta-4 was shown to possess a beneficial impact regarding myocardial cell survival, coronary re-growth and progenitor cell activation following myocardial infarction.",
    scientist: "Dr. Maar K",
    organization: "Cardiac Remodeling Research",
    logo: "/logos/medical.svg",
    source: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12072014/"
  },
  {
    compound: "LL-37",
    quote: "LL-37 demonstrates potent antimicrobial activity across a broad spectrum of pathogens, with engineered analogs improving stability while maintaining efficacy.",
    scientist: "Dr. Olga Evgenevna Voronko",
    organization: "Peer-reviewed Review",
    logo: "/logos/medical.svg",
    source: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12386566/"
  }
];

const ScientificQuoteCard = ({ compound, quote, scientist, organization, source }: Omit<typeof scientificQuotes[number], 'logo'>) => {
  return (
    <figure className="relative w-[450px] cursor-pointer overflow-hidden p-5 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white/95 transition-all duration-300 flex flex-col">
      <div className="mb-2">
        <h3 className="text-lg font-bold text-blue-700 text-center">{compound}</h3>
      </div>
      <div className="flex flex-col mb-3 text-left">
        <figcaption className="text-base font-semibold text-gray-800">
          {scientist}
        </figcaption>
        <p className="text-sm font-medium text-gray-600">{organization}</p>
      </div>
      <blockquote className="text-sm text-gray-700 leading-snug italic text-left flex-grow">
        "{quote}"
      </blockquote>
      <a 
        href={source} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-block mt-3 mb-1 text-xs text-gray-600 hover:text-gray-800 underline"
      >
        View Source
      </a>
    </figure>
  );
};

export default function PeptideMarquee() {
  const firstRow = scientificQuotes.slice(0, Math.ceil(scientificQuotes.length / 2));
  const secondRow = scientificQuotes.slice(Math.ceil(scientificQuotes.length / 2));

  return (
    <section className="container" style={{ paddingBlock: 'var(--space-8)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Hero Card */}
        <div 
          className="rounded-3xl shadow-xl overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/aurora-gradient-1757550328842.png)'
          }}
        >
          <div className="p-12">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">The Science Speaks</h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Quotes from respected scientists and institutions highlight the breakthrough potential of peptides.
              </p>
            </div>

            {/* Two Rows of Staggered Wide Cards */}
            <div className="relative w-full h-[600px] overflow-hidden">
          {/* First Row - Right to Left */}
          <div className="absolute top-0 w-full">
            <Marquee pauseOnHover className="[--duration:60s] [--gap:2rem]">
              {firstRow.map((quote, index) => (
                <ScientificQuoteCard key={`row1-${index}`} {...quote} />
              ))}
            </Marquee>
          </div>
          
          {/* Second Row - Right to Left, Staggered Offset */}
          <div className="absolute top-72 w-full" style={{animationDelay: '-30s'}}>
            <Marquee pauseOnHover className="[--duration:60s] [--gap:2rem]">
              {secondRow.map((quote, index) => (
                <ScientificQuoteCard key={`row2-${index}`} {...quote} />
              ))}
            </Marquee>
          </div>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
