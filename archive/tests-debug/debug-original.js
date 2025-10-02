const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5174');
  await page.waitForTimeout(2000); // Wait for React to load
  
  await page.screenshot({ 
    path: 'original-component-screenshot.png', 
    fullPage: true 
  });
  
  console.log('Original component screenshot saved as original-component-screenshot.png');
  
  await browser.close();
})();