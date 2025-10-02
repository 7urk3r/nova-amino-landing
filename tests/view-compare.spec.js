const { test } = require('@playwright/test')

const VIEW1 = process.env.VIEW1 || 'http://localhost:3333'
const VIEW2 = process.env.VIEW2 || 'http://127.0.0.1:3012/studio'
const SITE = process.env.SITE || 'http://127.0.0.1:3012'

async function snap(page, url, name){
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(800) // give Studio UI a beat to render
  await page.screenshot({ path: `test-results/${name}.png`, fullPage: true })
}

test('Capture Studio View 1 (landingPage & product)', async ({ page }) => {
  await snap(page, `${VIEW1}/structure/landingPage`, 'view1-landingPage')
  await snap(page, `${VIEW1}/structure/product`, 'view1-product`')
})

test('Capture Studio View 2 (landingPage & product)', async ({ page }) => {
  await snap(page, `${VIEW2}/structure/landingPage`, 'view2-landingPage')
  await snap(page, `${VIEW2}/structure/product`, 'view2-product')
})

test('Capture site pages for comparison', async ({ page }) => {
  await snap(page, `${SITE}/`, 'site-home')
  await snap(page, `${SITE}/products`, 'site-products')
  // Dump landing JSON if endpoint exists
  try{
    await page.goto(`${SITE}/debug/landing.json`, { waitUntil: 'domcontentloaded' })
    const json = await page.evaluate(() => document.body.innerText)
    require('fs').writeFileSync('test-results/landing.json', json)
  }catch(e){ /* ignore */ }
})

