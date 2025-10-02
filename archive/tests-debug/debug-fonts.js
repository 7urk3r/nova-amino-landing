const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000);
  
  // Check what fonts are actually being used
  const fontCheck = await page.evaluate(() => {
    // Check the main heading font
    const mainHeading = document.querySelector('h1');
    const marqueeHeading = document.querySelector('#peptide-marquee-mount h2');
    const marqueeCard = document.querySelector('#peptide-marquee-mount h3');
    const marqueeText = document.querySelector('#peptide-marquee-mount blockquote');
    
    const getComputedFont = (element) => {
      if (!element) return 'element not found';
      const styles = window.getComputedStyle(element);
      return {
        fontFamily: styles.fontFamily,
        fontWeight: styles.fontWeight,
        fontSize: styles.fontSize
      };
    };
    
    return {
      mainHeading: getComputedFont(mainHeading),
      marqueeHeading: getComputedFont(marqueeHeading),
      marqueeCard: getComputedFont(marqueeCard),
      marqueeText: getComputedFont(marqueeText)
    };
  });
  
  console.log('Font Analysis:');
  console.log('Main Heading:', fontCheck.mainHeading);
  console.log('Marquee Heading:', fontCheck.marqueeHeading);
  console.log('Marquee Card Title:', fontCheck.marqueeCard);
  console.log('Marquee Text:', fontCheck.marqueeText);
  
  await browser.close();
})();