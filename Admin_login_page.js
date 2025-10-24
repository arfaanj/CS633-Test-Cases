// tests/admin-login.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Admin Login Page Tests (A1–A6)', () => {

  // -------------------------------
  // A1: Verify login page loads properly
  // -------------------------------
  test('A1 - Login page loads properly', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
    await expect(page.locator('[data-testid="username-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-btn"]')).toBeVisible();
  });

  // -------------------------------
  // A2: Verify login with valid credentials
  // -------------------------------
  test('A2 - Login with valid credentials redirects to dashboard', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');
    await page.fill('[data-testid="username-input"]', 'admin@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-btn"]');

    // Expect to reach dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
  });

  // -------------------------------
  // A3: Verify login with invalid credentials
  // -------------------------------
  test('A3 - Invalid login shows error', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');
    await page.fill('[data-testid="username-input"]', 'wrong@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpass');
    await page.click('[data-testid="login-btn"]');

    // Expect error message
    await expect(page.locator('[data-testid="login-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-error"]'))
      .toHaveText(/invalid credentials/i);
  });

  // -------------------------------
  // A4: Verify empty fields validation
  // -------------------------------
  test('A4 - Empty field validation', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');
    await page.click('[data-testid="login-btn"]');

    // Expect required field warnings
    await expect(page.locator('[data-testid="username-error"]'))
      .toHaveText(/required/i);
    await expect(page.locator('[data-testid="password-error"]'))
      .toHaveText(/required/i);
  });

  // -------------------------------
  // A5: Verify password is masked
  // -------------------------------
  test('A5 - Password field should be masked', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');
    const inputType = await page.getAttribute('[data-testid="password-input"]', 'type');
    expect(inputType).toBe('password');
  });

  // -------------------------------
  // A6: Verify password reset option visibility
  // -------------------------------
  test('A6 - Forgot password link visible', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');
    await expect(page.locator('[data-testid="forgot-password-link"]')).toBeVisible();
    await expect(page.locator('[data-testid="forgot-password-link"]')).toHaveText(/forgot password/i);
  });

});
