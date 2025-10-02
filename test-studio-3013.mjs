import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Track console messages and errors
  const consoleMessages = [];
  const jsErrors = [];

  page.on('console', msg => {
    consoleMessages.push(msg.text());
    console.log('CONSOLE:', msg.text());
  });

  page.on('pageerror', error => {
    jsErrors.push(error.message);
    console.log('JS ERROR:', error.message);
  });

  try {
    console.log('🚀 Testing studio on port 3013...');
    await page.goto('http://127.0.0.1:3013/studio', { waitUntil: 'networkidle' });

    // Wait for React to potentially render
    await page.waitForTimeout(5000);

    // Check for specific errors
    const hasTsBrandError = consoleMessages.some(msg =>
      msg.includes('ts-brand') && msg.includes('does not provide an export named')
    );
    const hasLodashError = consoleMessages.some(msg =>
      msg.includes('lodash') && msg.includes('does not provide an export named')
    );

    console.log('❌ ts-brand error present:', hasTsBrandError);
    console.log('❌ lodash error present:', hasLodashError);

    // Check for Sanity Studio elements
    const studioElements = await page.$$('[data-sanity], .sanity, [class*="sanity"], [class*="Structure"], [data-ui]');
    console.log('🎯 Sanity/UI elements found:', studioElements.length);

    // Check for Studio content
    const studioInterface = await page.evaluate(() => {
      const body = document.body;
      const hasStudioContent = body.innerText.includes('Content') ||
                               body.innerText.includes('Structure') ||
                               body.innerText.includes('Nova Amino Studio') ||
                               document.querySelector('[data-ui]') !== null;
      return {
        bodyLength: body.innerText.length,
        hasStudioContent,
        hasDataUi: document.querySelector('[data-ui]') !== null,
        bodyText: body.innerText.substring(0, 500)
      };
    });

    console.log('📊 Studio interface check:', studioInterface);

    // Check for any hydration errors in console
    const hasHydrationErrors = consoleMessages.some(msg =>
      msg.includes('hydration') || msg.includes('astro-island')
    );

    console.log('🔥 Hydration errors present:', hasHydrationErrors);
    console.log('🐛 JavaScript errors:', jsErrors);

    // Final verdict
    const isWorking = !hasTsBrandError && !hasLodashError && studioInterface.hasStudioContent && jsErrors.length === 0;
    console.log('✅ Studio is working:', isWorking);

    if (isWorking) {
      console.log('🎉 SUCCESS: Sanity Studio is now functioning properly!');
    } else {
      console.log('❌ STILL BROKEN: Studio needs more fixes');
      if (hasTsBrandError || hasLodashError) {
        console.log('💡 Next step: Fix remaining module import errors');
      }
    }

    // Take screenshot
    await page.screenshot({ path: 'studio-test-3013.png', fullPage: true });

  } catch (error) {
    console.error('🔥 Test script error:', error);
  } finally {
    await browser.close();
  }
})();