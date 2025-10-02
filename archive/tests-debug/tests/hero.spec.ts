import { test, expect } from '@playwright/test'

test.describe('Hero layout', () => {
  test('matches reference at desktop', async ({ page }) => {
    await page.goto('http://localhost:5173/')
    const hero = page.locator('.hero-card')
    await expect(hero).toBeVisible()
    // Capture hero area only; first run will create baseline
    await expect(hero).toHaveScreenshot('hero-desktop.png', {
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
      scale: 'css'
    })
  })
})

