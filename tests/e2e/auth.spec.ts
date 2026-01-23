import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getAdminClient() {
  if (!baseUrl || !serviceRoleKey) return null;
  return createClient(baseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function findUserIdByEmail(email: string) {
  const admin = getAdminClient();
  if (!admin) return null;

  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) throw error;

  const user = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  return user?.id ?? null;
}

test.describe('auth', () => {
  test('redirects unauthenticated user to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('register -> logout -> login -> delete account', async ({ page }) => {
    test.skip(!baseUrl || !serviceRoleKey, 'Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL');

    const runId = Date.now();
    const email = `e2e_${runId}@example.com`;
    const password = `E2E!${runId}a`;

    await test.step('register', async () => {
      await page.goto('/register');
      await page.locator('input[type="email"]').fill(email);
      await page.locator('input[type="password"]').fill(password);
      await page.locator('button[type="submit"]').click();
      await page.waitForURL('**/dashboard');
      await expect(page.locator('#tour-dash-header')).toBeVisible();
    });

    await test.step('confirm user (if needed)', async () => {
      const admin = getAdminClient();
      if (!admin) return;
      const userId = await findUserIdByEmail(email);
      if (!userId) return;
      await admin.auth.admin.updateUserById(userId, { email_confirm: true });
    });

    await test.step('logout', async () => {
      const logoutButton = page.locator('[data-testid="logout-button"]');
      await expect(logoutButton).toBeVisible();
      await logoutButton.click();
      await page.waitForURL('**/');
    });

    await test.step('login', async () => {
      await page.goto('/login');
      await page.locator('input[type="email"]').fill(email);
      await page.locator('input[type="password"]').fill(password);
      await page.locator('button[type="submit"]').click();
      await page.waitForURL('**/dashboard');
      await expect(page.locator('#tour-dash-header')).toBeVisible();
    });

    await test.step('cleanup user', async () => {
      const admin = getAdminClient();
      if (!admin) return;
      const userId = await findUserIdByEmail(email);
      if (!userId) return;
      await admin.from('preference_profiles').delete().eq('user_id', userId);
      await admin.auth.admin.deleteUser(userId);
    });
  });
});
