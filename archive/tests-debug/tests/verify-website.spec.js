const { test, expect } = require('@playwright/test');

test.describe('Nova Amino Website Verification', () => {
  test('should load the homepage and match reference design', async ({ page }) => {
    // Navigate to the local server
    await page.goto('http://localhost:8080');

    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');

    // Verify the page title
    await expect(page).toHaveTitle('Nova Amino');

    // Verify the main logo is present
    const logo = page.locator('img[alt="Nova Amino"]');
    await expect(logo).toBeVisible();

    // Verify navigation elements
    await expect(page.locator('text=Home')).toBeVisible();
    await expect(page.locator('text=Catalog')).toBeVisible();
    await expect(page.locator('text=FAQ')).toBeVisible();
    await expect(page.locator('text=Announcements')).toBeVisible();

    // Verify the hero section
    await expect(page.locator('text=The Future of Wellness Research Is Here.')).toBeVisible();
    await expect(page.locator('text=Compare products, review research studies')).toBeVisible();
    await expect(page.locator('text=View Catalog')).toBeVisible();

    // Verify the hero image is present
    const heroImage = page.locator('img[alt="Hero view"]');
    await expect(heroImage).toBeVisible();

    // Verify the three feature cards
    await expect(page.locator('text=Shipped Within 24 Hours')).toBeVisible();
    await expect(page.locator('text=Purity You Can Trust')).toBeVisible();
    await expect(page.locator('text=Schedule Your Supply')).toBeVisible();

    // Verify card descriptions
    await expect(page.locator('text=Most orders are processed and out the door')).toBeVisible();
    await expect(page.locator('text=Every compound is tested for identity and purity')).toBeVisible();

    // Take a full page screenshot for visual comparison
    await page.screenshot({
      path: 'playwright-report/homepage-full.png',
      fullPage: true
    });

    // Take a viewport screenshot
    await page.screenshot({
      path: 'playwright-report/homepage-viewport.png'
    });
  });

  test('should have proper layout structure matching reference images', async ({ page }) => {
    await page.goto('http://localhost:8080');
    await page.waitForLoadState('networkidle');

    // Verify the header structure
    const header = page.locator('header.site-header');
    await expect(header).toBeVisible();

    // Verify navigation pillbar
    const navPillbar = page.locator('#nav-pillbar');
    await expect(navPillbar).toBeVisible();

    // Verify hero section layout
    const heroSection = page.locator('.hero-section');
    await expect(heroSection).toBeVisible();

    const heroCard = page.locator('.hero-card');
    await expect(heroCard).toBeVisible();

    // Verify three-card grid section
    const threeCardGrid = page.locator('.grid').filter({ hasText: 'Shipped Within 24 Hours' });
    await expect(threeCardGrid).toBeVisible();

    // Count the cards in the grid
    const cards = page.locator('.card');
    await expect(cards).toHaveCount(3);

    // Verify each card has the correct background image
    for (let i = 0; i < 3; i++) {
      const card = cards.nth(i);
      const backgroundImage = await card.getAttribute('style');
      expect(backgroundImage).toContain('3CardBackground');
    }
  });

  test('should have proper fonts and typography', async ({ page }) => {
    await page.goto('http://localhost:8080');
    await page.waitForLoadState('networkidle');

    // Verify hero title uses heading font
    const heroTitle = page.locator('.hero-card__title');
    const titleFontFamily = await heroTitle.evaluate(el =>
      window.getComputedStyle(el).fontFamily
    );
    expect(titleFontFamily).toContain('TT Commons Pro');

    // Verify supporting text uses monospace font
    const supportingText = page.locator('#hero-supporting-text');
    const supportingFontFamily = await supportingText.evaluate(el =>
      window.getComputedStyle(el).fontFamily
    );
    expect(supportingFontFamily).toContain('ibm-plex-mono');

    // Verify card descriptions use monospace font
    const cardText = page.locator('.card p').first();
    const cardFontFamily = await cardText.evaluate(el =>
      window.getComputedStyle(el).fontFamily
    );
    expect(cardFontFamily).toContain('ibm-plex-mono');
  });

  test('should have proper color scheme and styling', async ({ page }) => {
    await page.goto('http://localhost:8080');
    await page.waitForLoadState('networkidle');

    // Verify hero background image
    const heroCard = page.locator('.hero-card');
    const heroBackground = await heroCard.getAttribute('style');
    expect(heroBackground).toContain('hero-bg-desktop.webp');

    // Verify sign up button styling
    const signUpButton = page.locator('text=Sign up');
    await expect(signUpButton).toBeVisible();
    await expect(signUpButton).toHaveClass(/btn--black/);

    // Verify primary CTA button
    const viewCatalogButton = page.locator('text=View Catalog');
    await expect(viewCatalogButton).toBeVisible();
    await expect(viewCatalogButton).toHaveClass(/btn--primary/);
  });
});