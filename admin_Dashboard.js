// tests/admin-dashboard.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Admin Dashboard Tests (C1–C8)', () => {

  // -------------------------------
  // C1: Verify dashboard loads after login
  // -------------------------------
  test('C1 - Dashboard loads after valid login', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');
    await page.fill('[data-testid="username-input"]', 'admin@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-btn"]');

    // Expect dashboard to load
    await expect(page.locator('[data-testid="dashboard-page"]')).toBeVisible();
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
  });

  // -------------------------------
  // C2: Verify upload file functionality
  // -------------------------------
  test('C2 - Upload valid file successfully', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/dashboard');
    const filePath = 'tests/fixtures/sample.pptx'; // example path

    await page.setInputFiles('[data-testid="file-upload-input"]', filePath);
    await page.click('[data-testid="upload-btn"]');

    await expect(page.locator('text=Upload successful')).toBeVisible();
    await expect(page.locator('[data-testid="uploaded-file-list"]')).toContainText('sample.pptx');
  });

  // -------------------------------
  // C3: Verify invalid file upload format
  // -------------------------------
  test('C3 - Invalid file format shows error', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/dashboard');
    const invalidFilePath = 'tests/fixtures/sample.txt';

    await page.setInputFiles('[data-testid="file-upload-input"]', invalidFilePath);
    await page.click('[data-testid="upload-btn"]');

    await expect(page.locator('[data-testid="upload-error"]'))
      .toHaveText(/Invalid file format/i);
  });

  // -------------------------------
  // C4: Verify delete module content
  // -------------------------------
  test('C4 - Delete module successfully', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/dashboard');
    await page.click('[data-testid="delete-module-3"]');
    await page.click('[data-testid="confirm-delete-btn"]');

    await expect(page.locator('text=Module deleted successfully')).toBeVisible();
  });

  // -------------------------------
  // C5: Verify update text area saves
  // -------------------------------
  test('C5 - Update About text and save', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/dashboard');
    await page.fill('[data-testid="about-text"]', 'Updated About section content');
    await page.click('[data-testid="save-about-btn"]');

    await expect(page.locator('text=Saved successfully')).toBeVisible();
  });

  // -------------------------------
  // C6: Verify reset clears unsaved text
  // -------------------------------
  test('C6 - Reset button clears unsaved changes', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/dashboard');
    const aboutField = page.locator('[data-testid="about-text"]');

    await aboutField.fill('Temporary change');
    await page.click('[data-testid="reset-about-btn"]');

    await expect(aboutField).not.toHaveValue('Temporary change');
  });

  // -------------------------------
  // C7: Verify file overwrite confirmation
  // -------------------------------
  test('C7 - Overwrite confirmation appears when reuploading file', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/dashboard');
    const filePath = 'tests/fixtures/sample.pptx';

    await page.setInputFiles('[data-testid="file-upload-input"]', filePath);
    await page.click('[data-testid="upload-btn"]');

    // Reupload same file
    await page.setInputFiles('[data-testid="file-upload-input"]', filePath);
    await page.click('[data-testid="upload-btn"]');

    await expect(page.locator('[data-testid="overwrite-dialog"]')).toBeVisible();
    await expect(page.locator('text=Do you want to overwrite?')).toBeVisible();
  });

  // -------------------------------
  // C8: Verify sequence of files
  // -------------------------------
  test('C8 - Uploaded files appear in correct sequence', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/dashboard');
    const files = ['module1.pptx', 'module2.pptx', 'module3.pptx'];

    for (const file of files) {
      await page.setInputFiles('[data-testid="file-upload-input"]', `tests/fixtures/${file}`);
      await page.click('[data-testid="upload-btn"]');
    }

    const list = await page.locator('[data-testid="uploaded-file-list"] li').allTextContents();
    expect(list).toEqual(files);
  });

});
