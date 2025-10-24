// tests/student-view.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Student View Tests (B1–B9)', () => {

  // -------------------------------
  // B1: Verify homepage loads for student
  // -------------------------------
  test('B1 - Homepage loads fully for student', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page.locator('[data-testid="student-homepage"]')).toBeVisible();
    await expect(page.locator('text=Patterns of a Graduate Course on Quality Management')).toBeVisible();
  });

  // -------------------------------
  // B2: Verify six modules displayed
  // -------------------------------
  test('B2 - Six modules visible on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    const modules = await page.locator('[data-testid^="module-card-"]').count();
    expect(modules).toBe(6);
  });

  // -------------------------------
  // B3: Verify each module link opens correct section
  // -------------------------------
  test('B3 - Each module link opens correct section', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.click('[data-testid="module-link-1"]');
    await expect(page.locator('[data-testid="module-detail"]')).toContainText('Module 1');
  });

  // -------------------------------
  // B4: Verify professor info visible
  // -------------------------------
  test('B4 - Professor contact info is visible', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.locator('[data-testid="footer-section"]').scrollIntoViewIfNeeded();
    await expect(page.locator('[data-testid="professor-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="professor-email"]')).toBeVisible();
  });

  // -------------------------------
  // B5: Verify page responsiveness
  // -------------------------------
  test('B5 - Layout adapts correctly on resize', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.setViewportSize({ width: 375, height: 812 }); // mobile
    await expect(page.locator('[data-testid="hamburger-menu"]')).toBeVisible();

    await page.setViewportSize({ width: 1440, height: 900 }); // desktop
    await expect(page.locator('[data-testid="main-nav"]')).toBeVisible();
  });

  // -------------------------------
  // B6: Verify broken link handling
  // -------------------------------
  test('B6 - Broken link handled gracefully', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    // Intercept network requests to simulate broken link
    await page.route('**/module/7', route => route.abort('failed'));

    await page.click('[data-testid="module-link-7"]');
    await expect(page.locator('[data-testid="error-message"]'))
      .toHaveText(/unable to load module/i);
  });

  // -------------------------------
  // B7: Verify favicon and title display
  // -------------------------------
  test('B7 - Favicon and title visible', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    const title = await page.title();
    expect(title).toContain('Patterns of a Graduate Course on Quality Management');

    const favicon = await page.locator('link[rel="icon"]');
    await expect(favicon).toBeVisible();
  });

  // -------------------------------
  // B8: Verify text area content (About section)
  // -------------------------------
  test('B8 - About text content visible and persisted', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page.locator('[data-testid="about-section"]')).toBeVisible();
    const text = await page.locator('[data-testid="about-section"]').textContent();
    expect(text.length).toBeGreaterThan(0);
  });

  // -------------------------------
  // B9: Verify header items
  // -------------------------------
  test('B9 - Header contains all navigation items', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    const header = page.locator('[data-testid="header-nav"]');
    await expect(header).toContainText('About');
    await expect(header).toContainText('Student View');
    await expect(header).toContainText('Admin');
  });

});
