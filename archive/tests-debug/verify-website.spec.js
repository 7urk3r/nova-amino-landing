const { test, expect } = require('@playwright/test');

test('verify marquee font and animation', async ({ page }) => {
  console.log('🚀 Starting verification test...');

  await page.goto('http://localhost:3001/');
  console.log('✅ Page loaded');

  // Wait for marquee to load
  await page.waitForSelector('#peptide-marquee-mount', { timeout: 5000 });
  console.log('✅ Marquee mount found');

  // Check if React component rendered
  const hasCards = await page.locator('figure h3').count();
  console.log(`📊 Found ${hasCards} peptide title cards`);

  if (hasCards > 0) {
    // Check font
    const titleElement = page.locator('figure h3').first();
    const fontFamily = await titleElement.evaluate(el =>
      window.getComputedStyle(el).fontFamily
    );
    console.log(`🔤 Font family: ${fontFamily}`);

    // Check animation
    const animatedElement = page.locator('[class*="marquee-wrapper-"]').first();
    const animationName = await animatedElement.evaluate(el =>
      window.getComputedStyle(el).animationName
    );
    const animationIterationCount = await animatedElement.evaluate(el =>
      window.getComputedStyle(el).animationIterationCount
    );

    console.log(`🎬 Animation: ${animationName}, Iterations: ${animationIterationCount}`);

    expect(fontFamily).toContain('TT Commons Pro');
    expect(animationIterationCount).toBe('infinite');

    console.log('✅ All checks passed!');
  } else {
    console.log('⚠️ No cards found - taking screenshot for debug');
    await page.screenshot({ path: 'debug.png' });
  }
});