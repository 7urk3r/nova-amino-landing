import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Track all console messages and errors
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
    console.log('🚀 Testing fixed studio...');
    await page.goto('http://127.0.0.1:3012/studio', { waitUntil: 'networkidle' });

    // Wait for React to potentially render
    await page.waitForTimeout(5000);

    // Check for the specific lodash error
    const hasLodashError = consoleMessages.some(msg =>
      msg.includes('lodash/partition') && msg.includes('does not provide an export named')
    );

    console.log('❌ Lodash partition error present:', hasLodashError);

    // Check for Sanity Studio elements
    const studioElements = await page.$$('[data-sanity], .sanity, [class*="sanity"], [class*="Structure"], [data-ui]');
    console.log('🎯 Sanity/UI elements found:', studioElements.length);

    // Check for specific Studio interface elements
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
        hasStructure: body.innerText.includes('Structure'),
        hasContent: body.innerText.includes('Content')
      };
    });

    console.log('📊 Studio interface check:', studioInterface);

    // Check network requests for errors
    const failedRequests = [];
    page.on('response', response => {
      if (response.status() >= 400) {
        failedRequests.push({
          url: response.url(),
          status: response.status()
        });
      }
    });

    await page.reload({ waitUntil: 'networkidle' });

    console.log('🌐 Failed requests:', failedRequests);
    console.log('🐛 JavaScript errors:', jsErrors);

    // Final verdict
    const isWorking = !hasLodashError && studioInterface.hasStudioContent && jsErrors.length === 0;
    console.log('✅ Studio is working:', isWorking);

    if (isWorking) {
      console.log('🎉 SUCCESS: Sanity Studio is now functioning properly!');
    } else {
      console.log('❌ STILL BROKEN: Studio needs more fixes');
    }

    // Take screenshot
    await page.screenshot({ path: 'studio-test-result.png', fullPage: true });

  } catch (error) {
    console.error('🔥 Test script error:', error);
  } finally {
    await browser.close();
  }
})();