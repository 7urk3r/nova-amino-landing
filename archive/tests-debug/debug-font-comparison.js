const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000);
  
  // Compare fonts between existing elements and marquee elements
  const fontComparison = await page.evaluate(() => {
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
    
    return {
      // Existing page elements
      mainTitle: getComputedFont(document.querySelector('.hero-card__title')),
      cardTitle: getComputedFont(document.querySelector('.card-title, .heading')),
      cardText: getComputedFont(document.querySelector('.card-text, p')),
      
      // Marquee elements  
      marqueeTitle: getComputedFont(document.querySelector('#peptide-marquee-mount h2')),
      marqueeCardTitle: getComputedFont(document.querySelector('#peptide-marquee-mount h3')),
      marqueeText: getComputedFont(document.querySelector('#peptide-marquee-mount blockquote')),
      marqueeSubtitle: getComputedFont(document.querySelector('#peptide-marquee-mount p'))
    };
  });
  
  console.log('FONT COMPARISON:');
  console.log('================');
  console.log('EXISTING PAGE:');
  console.log('Main Title:', fontComparison.mainTitle);
  console.log('Card Title:', fontComparison.cardTitle);
  console.log('Card Text:', fontComparison.cardText);
  console.log('');
  console.log('MARQUEE COMPONENT:');
  console.log('Marquee Title:', fontComparison.marqueeTitle);
  console.log('Card Title:', fontComparison.marqueeCardTitle);
  console.log('Quote Text:', fontComparison.marqueeText);
  console.log('Subtitle:', fontComparison.marqueeSubtitle);
  
  await browser.close();
})();