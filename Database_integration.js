// tests/database-integration.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Database & Integration Tests (D1–D4)', () => {

  // -------------------------------
  // D1: Verify new uploads stored in database
  // -------------------------------
  test('D1 - New uploads stored in DB and visible on Student view', async ({ page }) => {
    await page.goto('http://localhost:3000/student');

    // Simulate viewing recently uploaded module file
    await page.waitForSelector('[data-testid="module-list"]');
    const moduleList = await page.locator('[data-testid="module-list"]').allTextContents();

    // Expect file from admin upload to appear
    await expect(moduleList.some(item => item.includes('sample.pptx'))).toBeTruthy();
  });

  // -------------------------------
  // D2: Verify updated About text persists
  // -------------------------------
  test('D2 - About text updated by admin persists on Student view', async ({ page }) => {
    await page.goto('http://localhost:3000/student');

    const aboutText = await page.locator('[data-testid="about-section"]').textContent();
    await expect(aboutText).toContain('Updated About section content');
  });

  // -------------------------------
  // D3: Verify deleted module removed from Student view
  // -------------------------------
  test('D3 - Deleted module is no longer visible', async ({ page }) => {
    await page.goto('http://localhost:3000/student');

    const moduleList = await page.locator('[data-testid="module-list"]').allTextContents();
    await expect(moduleList.some(item => item.includes('Module 3'))).toBeFalsy();
  });

  // -------------------------------
  // D4: Verify sync delay handling
  // -------------------------------
  test('D4 - Sync delay handled and updated data visible after refresh', async ({ page }) => {
    await page.goto('http://localhost:3000/student');

    // Simulate page load before sync completes
    await expect(page.locator('[data-testid="loading-indicator"]')).toBeVisible();

    // Wait and refresh to simulate data sync
    await page.waitForTimeout(3000);
    await page.reload();

    // After refresh, latest data should be visible
    await expect(page.locator('[data-testid="module-list"]')).toBeVisible();
    await expect(page.locator('text=Updated About section content')).toBeVisible();
  });

});
