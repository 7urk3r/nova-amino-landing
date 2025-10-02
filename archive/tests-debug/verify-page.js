const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('Navigating to localhost:5000...');
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });

    console.log('Taking screenshot...');
    await page.screenshot({ path: 'page-verification.png', fullPage: true });

    console.log('Getting page title...');
    const title = await page.title();
    console.log('Page title:', title);

    console.log('Checking for main heading...');
    const heading = await page.textContent('h1');
    console.log('Main heading:', heading);

    console.log('Page verification complete!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();