import { test, expect } from '@playwright/test';

test.describe('Paste Management', () => {
  test('Create a new paste', async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.goto('/dashboard/pastes');
    await page.click('button#create-paste');
    await page.fill('textarea#paste-content', 'This is a test paste.');
    await page.selectOption('select#visibility', 'public');
    await page.click('button#save-paste');

    const pasteList = await page.locator('.paste-list');
    await expect(pasteList).toContainText('This is a test paste.');
  });

  test('Edit an existing paste', async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.goto('/dashboard/pastes');
    await page.click('button#edit-paste-1'); // Assuming the first paste has this ID
    await page.fill('textarea#paste-content', 'This is an edited test paste.');
    await page.click('button#save-paste');

    const pasteList = await page.locator('.paste-list');
    await expect(pasteList).toContainText('This is an edited test paste.');
  });

  test('Delete a paste', async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.goto('/dashboard/pastes');
    await page.click('button#delete-paste-1'); // Assuming the first paste has this ID
    await page.click('button#confirm-delete');

    const pasteList = await page.locator('.paste-list');
    await expect(pasteList).not.toContainText('This is an edited test paste.');
  });
});