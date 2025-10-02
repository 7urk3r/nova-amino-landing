const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Check page title
    const title = await page.title();
    console.log('Page title:', title);

    // Check for key elements
    const logo = await page.locator('img[alt="Nova Amino"]').count();
    console.log('Logo found:', logo > 0);

    const heroTitle = await page.locator('text=The Future of Wellness Research Is Here.').count();
    console.log('Hero title found:', heroTitle > 0);

    const cards = await page.locator('.card').count();
    console.log('Cards found:', cards);

    // Take screenshot
    await page.screenshot({ path: 'website-verification.png', fullPage: true });
    console.log('Screenshot saved as website-verification.png');

    console.log('✅ Website is running and key elements are present!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();