import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('shows login form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('link', { name: /MediQueue/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test('shows validation errors on empty login', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText(/invalid email/i)).toBeVisible();
  });

  test('shows registration form', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByLabel(/clinic name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });
});

test.describe('Public Queue Page', () => {
  test('shows not-found for invalid entry ID', async ({ page }) => {
    await page.goto('/q/invalid-id');
    await expect(page.getByText(/unavailable/i)).toBeVisible();
  });
});
