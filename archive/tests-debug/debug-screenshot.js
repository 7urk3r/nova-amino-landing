const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000); // Wait for React to load
  
  await page.screenshot({ 
    path: 'landing-page-screenshot.png', 
    fullPage: true 
  });
  
  console.log('Screenshot saved as landing-page-screenshot.png');
  
  await browser.close();
})();