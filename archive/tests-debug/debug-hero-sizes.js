const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000);
  
  // Check hero font sizes
  const heroSizes = await page.evaluate(() => {
    const getComputedFont = (element) => {
      if (!element) return 'element not found';
      const styles = window.getComputedStyle(element);
      return {
        fontSize: styles.fontSize,
        lineHeight: styles.lineHeight,
        marginBottom: styles.marginBottom
      };
    };
    
    const heroTitle = document.querySelector('.hero-card__title, h1');
    const heroText = document.querySelector('#hero-supporting-text, .hero-section p');
    
    return {
      heroTitle: getComputedFont(heroTitle),
      heroText: getComputedFont(heroText)
    };
  });
  
  console.log('HERO FONT SIZES:');
  console.log('Title:', heroSizes.heroTitle);
  console.log('Supporting Text:', heroSizes.heroText);
  
  await browser.close();
})();