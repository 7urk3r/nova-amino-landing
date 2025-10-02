import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Enable console logging
  page.on('console', msg => console.log('CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  try {
    console.log('Navigating to studio...');
    await page.goto('http://127.0.0.1:3012/studio', { waitUntil: 'networkidle' });

    // Wait a bit for React to render
    await page.waitForTimeout(3000);

    // Check if the page is blank
    const bodyText = await page.textContent('body');
    console.log('Body text length:', bodyText.length);
    console.log('Body text preview:', bodyText.substring(0, 200));

    // Check for common Sanity Studio elements
    const studioElements = await page.$$('[data-sanity], .sanity, [class*="sanity"]');
    console.log('Sanity elements found:', studioElements.length);

    // Check for error messages
    const errorElements = await page.$$('*:has-text("error"), *:has-text("Error"), *:has-text("failed")');
    console.log('Error elements found:', errorElements.length);

    // Check network requests
    const responses = [];
    page.on('response', response => {
      if (response.url().includes('studio') || response.url().includes('sanity')) {
        responses.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        });
      }
    });

    await page.reload({ waitUntil: 'networkidle' });
    console.log('Studio-related network requests:', responses);

    // Check for JavaScript errors
    const jsErrors = [];
    page.on('pageerror', error => jsErrors.push(error.message));

    await page.waitForTimeout(2000);
    console.log('JavaScript errors:', jsErrors);

    // Take a screenshot for debugging
    await page.screenshot({ path: 'studio-debug.png', fullPage: true });
    console.log('Screenshot saved as studio-debug.png');

  } catch (error) {
    console.error('Debug script error:', error);
  } finally {
    await browser.close();
  }
})();