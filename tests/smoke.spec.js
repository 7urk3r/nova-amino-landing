const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3010';

test('home loads and marquee renders cards', async ({ page }) => {
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  // Hero section present
  await expect(page.locator('.hero-card')).toBeVisible();
  // Marquee should inject cards
  await page.waitForSelector('.quote-card', { timeout: 10000 });
  const count = await page.locator('.quote-card').count();
  expect(count).toBeGreaterThanOrEqual(2);
});
