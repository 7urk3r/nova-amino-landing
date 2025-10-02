import { test, expect } from '@playwright/test'

test.describe('Full page screenshot', () => {
  test('capture complete landing page screenshot', async ({ page }) => {
    // Navigate to the page
    await page.goto('http://localhost:5173/')
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle')
    
    // Wait for any images to load
    await page.waitForSelector('.hero-card img', { state: 'visible' })
    
    // Take a full page screenshot
    await page.screenshot({ 
      path: 'nova-amino-landing-page-full.png', 
      fullPage: true,
      animations: 'disabled'
    })
    
    // Also take a viewport screenshot for comparison
    await page.screenshot({ 
      path: 'nova-amino-landing-page-viewport.png',
      animations: 'disabled'
    })
    
    console.log('Screenshots saved:')
    console.log('- nova-amino-landing-page-full.png (full page)')
    console.log('- nova-amino-landing-page-viewport.png (viewport)')
  })
})