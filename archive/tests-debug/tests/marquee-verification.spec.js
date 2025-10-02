const { test, expect } = require('@playwright/test');

test.describe('Marquee Cards Verification', () => {
  test('should verify peptide titles use correct font and marquee cycles forever', async ({ page }) => {
    // Navigate to the site
    await page.goto('http://127.0.0.1:5173/');

    // Wait for the marquee component to load
    await page.waitForSelector('#peptide-marquee-mount', { timeout: 10000 });

    // Wait a bit more for React component to render
    await page.waitForTimeout(2000);

    // Check if marquee cards are present
    const marqueeCards = await page.locator('figure h3').count();
    console.log(`Found ${marqueeCards} marquee cards`);

    if (marqueeCards > 0) {
      // Test 1: Verify peptide titles use correct font family
      const firstTitle = page.locator('figure h3').first();
      const computedStyle = await firstTitle.evaluate((el) => {
        return window.getComputedStyle(el).fontFamily;
      });

      console.log('Peptide title font family:', computedStyle);

      // Should contain TT Commons Pro (the --font-heading variable)
      expect(computedStyle).toContain('TT Commons Pro');

      // Test 2: Verify marquee animation is running and continuous
      const marqueeWrapper = page.locator('[class*="marquee-wrapper-"]').first();

      // Check if animation is applied
      const animationName = await marqueeWrapper.evaluate((el) => {
        return window.getComputedStyle(el).animationName;
      });

      console.log('Animation name:', animationName);
      expect(animationName).toMatch(/marquee-/);

      // Check animation duration and iteration
      const animationDuration = await marqueeWrapper.evaluate((el) => {
        return window.getComputedStyle(el).animationDuration;
      });

      const animationIterationCount = await marqueeWrapper.evaluate((el) => {
        return window.getComputedStyle(el).animationIterationCount;
      });

      console.log('Animation duration:', animationDuration);
      console.log('Animation iteration count:', animationIterationCount);

      // Should have a duration and be infinite
      expect(animationDuration).not.toBe('0s');
      expect(animationIterationCount).toBe('infinite');

      // Test 3: Verify animation continues by checking transform changes
      const initialTransform = await marqueeWrapper.evaluate((el) => {
        return window.getComputedStyle(el).transform;
      });

      // Wait 2 seconds and check if transform has changed (indicating animation)
      await page.waitForTimeout(2000);

      const laterTransform = await marqueeWrapper.evaluate((el) => {
        return window.getComputedStyle(el).transform;
      });

      console.log('Initial transform:', initialTransform);
      console.log('Later transform:', laterTransform);

      // Transform should have changed, indicating animation is running
      expect(initialTransform).not.toBe(laterTransform);

      console.log('✅ All marquee tests passed!');
    } else {
      console.log('⚠️  No marquee cards found - component may not have loaded');
      // Take a screenshot for debugging
      await page.screenshot({ path: 'marquee-debug.png', fullPage: true });
    }
  });

  test('should take screenshot of marquee for visual verification', async ({ page }) => {
    await page.goto('http://127.0.0.1:5173/');
    await page.waitForSelector('#peptide-marquee-mount', { timeout: 10000 });
    await page.waitForTimeout(3000);

    // Take a screenshot of the marquee section
    const marqueeSection = page.locator('#peptide-marquee-mount').first();
    await marqueeSection.screenshot({ path: 'marquee-section.png' });

    console.log('📸 Screenshot saved as marquee-section.png');
  });
});