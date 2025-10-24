// tests/ui-ux-accessibility.spec.js
const { test, expect } = require('@playwright/test');

test.describe('UI/UX & Accessibility Tests (G1–G5)', () => {

  // -------------------------------
  // G1: Verify keyboard navigation works
  // -------------------------------
  test('G1 - Keyboard navigation moves focus sequentially', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    // Press Tab several times to move through focusable elements
    await page.keyboard.press('Tab');
    const firstFocus = await page.evaluate(() => document.activeElement.getAttribute('data-testid'));
    await page.keyboard.press('Tab');
    const secondFocus = await page.evaluate(() => document.activeElement.getAttribute('data-testid'));

    // Ensure focus has moved and elements are sequentially reachable
    expect(firstFocus).not.toBe(secondFocus);
  });

  // -------------------------------
  // G2: Verify text color contrast (WCAG 2.1 AA)
  // -------------------------------
  test('G2 - Text color contrast meets WCAG 2.1 AA', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    // Evaluate text color contrast ratio via JavaScript
    const contrastRatio = await page.evaluate(() => {
      function luminance(r, g, b) {
        const a = [r, g, b].map(v => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
      }
      function contrast(rgb1, rgb2) {
        const L1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
        const L2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
        return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
      }

      const bodyColor = getComputedStyle(document.body).color.match(/\d+/g).map(Number);
      const bgColor = getComputedStyle(document.body).backgroundColor.match(/\d+/g).map(Number);
      return contrast(bodyColor, bgColor);
    });

    expect(contrastRatio).toBeGreaterThanOrEqual(4.5); // WCAG AA standard
  });

  // -------------------------------
  // G3: Verify button hover states
  // -------------------------------
  test('G3 - Buttons change style on hover', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    const button = page.locator('[data-testid="primary-button"]').first();

    const colorBefore = await button.evaluate(el => getComputedStyle(el).backgroundColor);
    await button.hover();
    const colorAfter = await button.evaluate(el => getComputedStyle(el).backgroundColor);

    expect(colorBefore).not.toBe(colorAfter);
  });

  // -------------------------------
  // G4: Verify footer link works (e.g., LinkedIn)
  // -------------------------------
  test('G4 - Footer LinkedIn link redirects correctly', async ({ page, context }) => {
    await page.goto('http://localhost:3000/');
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.click('[data-testid="linkedin-link"]')
    ]);
    await newPage.waitForLoadState();
    const url = newPage.url();
    expect(url).toContain('linkedin.com');
  });

  // -------------------------------
  // G5: Verify header links work
  // -------------------------------
  test('G5 - Header navigation links redirect properly', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    // Example: click "About" and "Student View" links
    await page.click('[data-testid="nav-about"]');
    await expect(page).toHaveURL(/about/);

    await page.click('[data-testid="nav-student"]');
    await expect(page).toHaveURL(/student/);
  });

});
