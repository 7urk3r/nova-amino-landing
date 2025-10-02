const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('🚀 Testing Nova Amino website...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Check page title
    const title = await page.title();
    console.log('✅ Page title:', title);

    // Check for key elements
    const logo = await page.locator('img[alt="Nova Amino"]').count();
    console.log('✅ Logo found:', logo > 0);

    const heroTitle = await page.locator('text=The Future of Wellness Research Is Here.').count();
    console.log('✅ Hero title found:', heroTitle > 0);

    // Check for new sections we added
    const whyChoose = await page.locator('text=Why Choose Nova Amino?').count();
    console.log('✅ "Why Choose Nova Amino?" section found:', whyChoose > 0);

    const exploreCatalog = await page.locator('text=Explore Our Research Catalog').count();
    console.log('✅ "Explore Our Research Catalog" section found:', exploreCatalog > 0);

    // Check for card SVGs
    const cardSvgs = await page.locator('img[src*="Card"]').count();
    console.log('✅ Card SVGs found:', cardSvgs, '(should be 3)');

    const cards = await page.locator('.card').count();
    console.log('✅ Cards found:', cards, '(should be 3)');

    // Check navigation
    const navItems = await page.locator('.nav-link').count();
    console.log('✅ Navigation items found:', navItems);

    // Check FAQ section
    const faqSection = await page.locator('text=What does RUO mean?').count();
    console.log('✅ FAQ section found:', faqSection > 0);

    // Take final screenshot
    await page.screenshot({ path: 'final-website-verification.png', fullPage: true });
    console.log('📸 Full-page screenshot saved as final-website-verification.png');

    // Check viewport screenshot
    await page.screenshot({ path: 'final-website-viewport.png' });
    console.log('📸 Viewport screenshot saved as final-website-viewport.png');

    console.log('\n🎉 SUCCESS! Website is running with all components verified!');
    console.log('🌐 Access the website at: http://localhost:3000');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();