const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Listen for font loading issues
  page.on('response', response => {
    const url = response.url();
    if (url.includes('font') || url.includes('.woff') || url.includes('.ttf')) {
      console.log(`Font request: ${url} - Status: ${response.status()}`);
    }
  });
  
  page.on('console', msg => {
    if (msg.text().includes('font') || msg.text().includes('Failed to decode')) {
      console.log('CONSOLE:', msg.text());
    }
  });
  
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(3000);
  
  // Check if fonts are actually loaded
  const fontStatus = await page.evaluate(() => {
    // Check if TT Commons Pro is available
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    ctx.font = '12px "TT Commons Pro"';
    const ttWidth = ctx.measureText('Test').width;
    
    ctx.font = '12px serif';
    const serifWidth = ctx.measureText('Test').width;
    
    const ttLoaded = ttWidth !== serifWidth;
    
    // Check font face loading
    const fontFaceLoaded = document.fonts ? document.fonts.check('12px "TT Commons Pro"') : 'unknown';
    
    return {
      ttCommonsAvailable: ttLoaded,
      fontFaceCheck: fontFaceLoaded,
      allFonts: Array.from(document.fonts || []).map(f => f.family)
    };
  });
  
  console.log('Font Loading Status:', fontStatus);
  
  await browser.close();
})();