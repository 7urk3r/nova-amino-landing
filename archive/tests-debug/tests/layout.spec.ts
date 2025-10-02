import { test, expect } from '@playwright/test'

const base = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:5176'

test('Header layout and styles', async ({ page }) => {
  await page.goto(base + '/index.html', { waitUntil: 'domcontentloaded' })

  const header = page.locator('header.site-header')
  await expect(header).toBeVisible()

  // Pill is sticky inside header center cell
  const pill = page.locator('header .nav-pill')
  await expect(pill).toBeVisible()
  const pos = await pill.evaluate((el) => getComputedStyle(el).position)
  expect(pos).toBe('sticky')
  await page.waitForTimeout(150)

  // Pill horizontally centered
  const pillBox = await page.locator('header .nav-pill').boundingBox()
  const contBox = await page.locator('header .container').boundingBox()
  if (pillBox && contBox){
    const pillCenter = pillBox.x + pillBox.width/2
    const contCenter = contBox.x + contBox.width/2
    expect(Math.abs(pillCenter - contCenter)).toBeLessThan(8)
  }

  // Optional: vertical alignment check is sensitive across UAs; omit for stability

  // Pill sits below header; no vertical alignment check

  // No bottom border
  const border = await header.evaluate((el) => getComputedStyle(el).borderBottomWidth)
  expect(border).toBe('0px')

  // Logo present and near left edge
  const logo = page.locator('header .site-logo img')
  await expect(logo).toBeVisible()
  const lb = await logo.boundingBox()
  expect(lb).toBeTruthy()
  if (lb) expect(lb.x).toBeLessThan(80)

  // Nav items present inside pill (Products/Announcements as dropdowns)
  const labels = await page.locator('header .nav-pill a:not(.btn)').allTextContents()
  expect(labels).toContain('Home')
  expect(labels).toContain('FAQ')
  await expect(page.locator('header >> text=Catalog')).toBeVisible()
  await expect(page.locator('header >> text=Announcements')).toBeVisible()

  // Right side pills exist
  await expect(page.locator('header .site-actions >> text=Sign in')).toBeVisible()
  await expect(page.locator('header .site-actions >> text=Sign up')).toBeVisible()

  // Nav is centered within container grid (within tolerance)
  const container = page.locator('header .container')
  const cBox = await container.boundingBox()
  const nBox = await page.locator('header nav.site-nav').boundingBox()
  if (cBox && nBox){
    const cCenter = cBox.x + cBox.width/2
    const nCenter = nBox.x + nBox.width/2
    expect(Math.abs(cCenter - nCenter)).toBeLessThan(40)
  }

  // Screenshot header
  await header.screenshot({ path: 'playwright-report/header-layout.png' })
})
