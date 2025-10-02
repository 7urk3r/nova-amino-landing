import {test, expect} from '@playwright/test'

const STUDIO_URL = 'http://127.0.0.1:3012/studio'

const NAV_TEST_ID = 'structure-root-list'

const SANITY_ERROR_OVERLAY = '[data-testid="sanity-ui-loader"]'

const SANITY_TOOLBAR_BUTTON = '[data-testid="structure-menu-button"]'

const CONSOLE_ERROR_TYPES = new Set(['error', 'assert'])

test.describe('Sanity Studio smoke check', () => {
  test('loads the desk sidebar without console errors', async ({page}) => {
    const consoleMessages: string[] = []

    page.on('console', (msg) => {
      if (CONSOLE_ERROR_TYPES.has(msg.type())) {
        consoleMessages.push(`[${msg.type()}] ${msg.text()}`)
      }
    })

    await page.goto(STUDIO_URL)

    // Wait for Sanity loader to disappear if present
    const loader = page.locator(SANITY_ERROR_OVERLAY)
    if (await loader.isVisible({timeout: 5_000}).catch(() => false)) {
      await loader.waitFor({state: 'detached', timeout: 15_000})
    }

    // In narrow viewports the navigation is behind the “Menu” button, click it if needed
    const menuButton = page.locator(SANITY_TOOLBAR_BUTTON)
    if (await menuButton.isVisible({timeout: 1_000}).catch(() => false)) {
      await menuButton.click()
    }

    const deskNav = page.locator(`[data-testid="${NAV_TEST_ID}"]`)
    await expect(deskNav).toBeVisible({timeout: 20_000})

    if (consoleMessages.length) {
      throw new Error(`Console errors detected:\n${consoleMessages.join('\n')}`)
    }
  })
})
