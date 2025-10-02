const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000);
  
  // Check what fonts are being used in the existing cards vs marquee cards
  const cardFontCheck = await page.evaluate(() => {
    const getComputedFont = (element) => {
      if (!element) return 'element not found';
      const styles = window.getComputedStyle(element);
      return {
        fontFamily: styles.fontFamily,
        fontWeight: styles.fontWeight,
        fontSize: styles.fontSize,
        actualFont: styles.fontFamily.split(',')[0].replace(/['"]/g, '')
      };
    };
    
    // Find existing card elements
    const existingCardTitle = document.querySelector('.card-title, .heading:not(#peptide-marquee-mount *)');
    const existingCardText = document.querySelector('p:not(#peptide-marquee-mount *)');
    
    // Find marquee card elements
    const marqueeCardCompound = document.querySelector('#peptide-marquee-mount h3');
    const marqueeCardScientist = document.querySelector('#peptide-marquee-mount figcaption');
    const marqueeCardOrg = document.querySelector('#peptide-marquee-mount figcaption + p');
    const marqueeCardQuote = document.querySelector('#peptide-marquee-mount blockquote');
    
    return {
      existingCard: {
        title: getComputedFont(existingCardTitle),
        text: getComputedFont(existingCardText)
      },
      marqueeCard: {
        compound: getComputedFont(marqueeCardCompound),
        scientist: getComputedFont(marqueeCardScientist),
        organization: getComputedFont(marqueeCardOrg),
        quote: getComputedFont(marqueeCardQuote)
      }
    };
  });
  
  console.log('CARD FONT COMPARISON:');
  console.log('====================');
  console.log('EXISTING CARDS:');
  console.log('Title:', cardFontCheck.existingCard.title);
  console.log('Text:', cardFontCheck.existingCard.text);
  console.log('');
  console.log('MARQUEE CARDS:');
  console.log('Compound:', cardFontCheck.marqueeCard.compound);
  console.log('Scientist:', cardFontCheck.marqueeCard.scientist);
  console.log('Organization:', cardFontCheck.marqueeCard.organization);
  console.log('Quote:', cardFontCheck.marqueeCard.quote);
  
  await browser.close();
})();