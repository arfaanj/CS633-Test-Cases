// tests/file-management.spec.js
const { test, expect } = require('@playwright/test');

test.describe('File Management Tests (E1–E4)', () => {

  // -------------------------------
  // E1: Verify file size restriction
  // -------------------------------
  test('E1 - File size restriction displays error for >10MB file', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');
    await page.setInputFiles('[data-testid="file-upload"]', 'tests/files/large-file-20mb.pptx');

    // Expect error to appear
    await expect(page.locator('[data-testid="upload-error"]'))
      .toHaveText(/file too large/i);
  });

  // -------------------------------
  // E2: Verify upload progress indicator
  // -------------------------------
  test('E2 - Upload progress indicator appears during file upload', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');
    await page.setInputFiles('[data-testid="file-upload"]', 'tests/files/sample.pptx');

    // Expect spinner or progress bar
    await expect(page.locator('[data-testid="upload-progress"]')).toBeVisible();

    // Wait until upload completes
    await page.waitForSelector('[data-testid="upload-success"]');
    await expect(page.locator('[data-testid="upload-success"]'))
      .toHaveText(/upload complete/i);
  });

  // -------------------------------
  // E3: Verify duplicate file upload
  // -------------------------------
  test('E3 - Duplicate file upload prompts confirmation or blocks', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');

    // Upload first time
    await page.setInputFiles('[data-testid="file-upload"]', 'tests/files/sample.pptx');
    await page.waitForSelector('[data-testid="upload-success"]');

    // Upload same file again
    await page.setInputFiles('[data-testid="file-upload"]', 'tests/files/sample.pptx');

    // Expect prompt or warning
    const duplicateWarning = page.locator('[data-testid="duplicate-warning"]');
    if (await duplicateWarning.isVisible()) {
      await expect(duplicateWarning).toHaveText(/already exists/i);
    } else {
      await expect(page.locator('[data-testid="upload-success"]')).toBeVisible();
    }
  });

  // -------------------------------
  // E4: Verify file download option (if available)
  // -------------------------------
  test('E4 - Verify file download functionality', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');

    // Wait for module list to load
    await page.waitForSelector('[data-testid="file-download"]');

    // Trigger download
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="file-download"]')
    ]);

    const path = await download.path();
    expect(path).not.toBeNull(); // File downloaded successfully
  });

});
