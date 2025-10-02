import React from 'react';

// TOP 12 MARKETING-POSITIVE & BENEFICIAL PEPTIDE QUOTES - Curated for maximum impact
const scientificQuotes = [
  {
    compound: "Semaglutide",
    quote: "Semaglutide promotes weight loss, improves metabolic health, and offers benefits across related conditions, with a favorable clinical profile in type 2 diabetes and obesity.",
    scientist: "Dr. Mesk Alkhatib",
    organization: "Peer-reviewed Journal",
    source: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12413075/"
  },
  {
    compound: "Tirzepatide",
    quote: "In adults with obesity or overweight, tirzepatide was associated with body weight reduction and improvements in insulin sensitivity and β‑cell function.",
    scientist: "SURMOUNT‑1 investigators",
    organization: "Peer-reviewed clinical study",
    source: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12368374/"
  },
  {
    compound: "Oxytocin",
    quote: "We previously reported that oxytocin can induce pain relief and described the possibility how oxytocin in the dorsal horn and/or the dorsal root ganglion relieves joint and muscle pain.",
    scientist: "Dr. Eiji Ito",
    organization: "Tokyo Women's Medical University",
    source: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6784812/"
  },
  {
    compound: "Semaglutide",
    quote: "Clinicians should consider semaglutide's benefits including improved quality of life and reduced hospitalizations alongside its safety profile and side effects.",
    scientist: "Dr. Rui Wu",
    organization: "Systematic Review & Meta-analysis",
    source: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12403603/"
  },
  {
    compound: "Oxytocin",
    quote: "Oxytocin has taken the lead as the most investigated neurohormone that modulates social cognition, influences parenting behaviors, facilitates bonding, and biologically buffers against stressors.",
    scientist: "Dr. Suma Jacob",
    organization: "University of Minnesota",
    source: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10966149/"
  },
  {
    compound: "Cagrilintide",
    quote: "Overall, the current evidence suggests that both pramlintide and cagrilintide are safe, effective, and promising drugs that successfully reduce body weight in patients with T2DM and consequently regulate glucose homeostasis.",
    scientist: "Dr. Stjepan Eržen",
    organization: "Peer-reviewed Review",
    source: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10855385/"
  }
];

const ScientificQuoteCard = ({ compound, quote, scientist, organization, source }: any) => {
  return (
    <figure style={{
      position: 'relative',
      width: '450px',
      cursor: 'pointer',
      overflow: 'hidden',
      padding: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(8px)',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      marginRight: '32px'
    }}>
      <div style={{ marginBottom: '8px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#1d4ed8',
          textAlign: 'center',
          margin: 0,
          fontFamily: 'var(--font-heading)'
        }}>{compound}</h3>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '12px',
        textAlign: 'left'
      }}>
        <figcaption style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#1f2937',
          margin: 0,
          fontFamily: 'var(--font-heading)'
        }}>
          {scientist}
        </figcaption>
        <p style={{
          fontSize: '14px',
          fontWeight: '500',
          color: '#6b7280',
          margin: 0,
          fontFamily: 'ibm-plex-mono, monospace'
        }}>{organization}</p>
      </div>
      <blockquote style={{
        fontSize: '14px',
        color: '#374151',
        lineHeight: '1.4',
        fontStyle: 'normal',
        fontWeight: '300',
        textAlign: 'left',
        flexGrow: 1,
        margin: 0,
        fontFamily: 'ibm-plex-mono, monospace'
      }}>
        "{quote}"
      </blockquote>
      <a 
        href={source} 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          marginTop: '12px',
          marginBottom: '4px',
          fontSize: '12px',
          color: '#6b7280',
          textDecoration: 'underline',
          fontFamily: 'ibm-plex-mono, monospace'
        }}
      >
        View Source
      </a>
    </figure>
  );
};

const SimpleMarquee = ({ children, speed = 50 }: { children: React.ReactNode, speed?: number }) => {
  const uniqueId = React.useRef(Math.random().toString(36).substr(2, 9)).current;
  
  return (
    <div style={{
      overflow: 'hidden',
      padding: '8px',
      userSelect: 'none',
      width: '100%'
    }}>
      <style>
        {`
          @keyframes marquee-${uniqueId} {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-50%, 0, 0); }
          }
          .marquee-wrapper-${uniqueId} {
            display: flex;
            animation: marquee-${uniqueId} ${speed}s linear infinite;
            width: max-content;
            gap: 32px;
            will-change: transform;
          }
          .marquee-wrapper-${uniqueId}:hover {
            animation-play-state: paused;
          }
        `}
      </style>
      <div className={`marquee-wrapper-${uniqueId}`}>
        {children}
        {children}
      </div>
    </div>
  );
};

export default function PeptideMarqueeInline() {
  const firstRow = scientificQuotes.slice(0, Math.ceil(scientificQuotes.length / 2));
  const secondRow = scientificQuotes.slice(Math.ceil(scientificQuotes.length / 2));

  return (
    <section className="container" style={{ paddingBlock: 'var(--space-8)' }}>
      {/* Hero Card - Same width as other hero cards */}
      <div style={{
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
        backgroundImage: 'url(/aurora-gradient-1757550328842.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '400px'
      }}>
        <div style={{ padding: '48px' }}>
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '48px'
          }}>
            <h2 style={{
              fontSize: '51.2px',
              fontWeight: 'bold',
              color: '#000000',
              marginBottom: '32px',
              margin: '0 0 32px 0',
              lineHeight: '61.44px',
              fontFamily: 'var(--font-heading)'
            }}>The Science Speaks</h2>
            <p style={{
              fontSize: '18px',
              lineHeight: '27px',
              color: '#000000',
              maxWidth: '768px',
              margin: '0 auto',
              fontFamily: 'ibm-plex-mono, monospace'
            }}>
              Across the world, scientists and institutions are uncovering the potential of peptides. Their findings reveal both the science and the promise these compounds hold.
            </p>
          </div>

          {/* Two Rows of Staggered Wide Cards */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '600px',
            overflow: 'hidden'
          }}>
            {/* First Row */}
            <div style={{
              position: 'absolute',
              top: '0',
              width: '100%'
            }}>
              <SimpleMarquee speed={50}>
                {firstRow.map((quote, index) => (
                  <ScientificQuoteCard key={`row1-${index}`} {...quote} />
                ))}
              </SimpleMarquee>
            </div>
            
            {/* Second Row */}
            <div style={{
              position: 'absolute',
              top: '288px',
              width: '100%'
            }}>
              <SimpleMarquee speed={45}>
                {secondRow.map((quote, index) => (
                  <ScientificQuoteCard key={`row2-${index}`} {...quote} />
                ))}
              </SimpleMarquee>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}