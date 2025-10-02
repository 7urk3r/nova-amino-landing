import { test, expect } from '@playwright/test'

test('Header menu opens and renders', async ({ page }) => {
  const base = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:5176'
  await page.goto(base + '/index.html', { waitUntil: 'domcontentloaded' })
  // Ensure header is visible
  await expect(page.locator('header.site-header')).toBeVisible()

  // The Catalog nav item is a dropdown trigger inside the header pill
  const btn = page.locator('header >> text=Catalog').first()
  await expect(btn).toBeVisible()
  
  // Hover over the button to trigger dropdown
  await btn.hover()
  await page.waitForTimeout(200) // Wait for animation

  // Check that catalog menu items appear
  await expect(page.locator('text=All Products')).toBeVisible()
  await expect(page.locator('text=New')).toBeVisible() 
  await expect(page.locator('text=Popular')).toBeVisible()

  // Screenshot the header area for review
  const header = page.locator('header.site-header')
  await header.screenshot({ path: 'playwright-report/header-menu.png' })
})
