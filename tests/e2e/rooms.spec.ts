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

test.describe('rooms', () => {
  test('create room and cleanup', async ({ page }) => {
    test.setTimeout(60_000);
    test.skip(!baseUrl || !serviceRoleKey, 'Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL');

    const runId = Date.now();
    const email = `e2e_room_${runId}@example.com`;
    const password = `E2E!${runId}a`;
    const roomName = `E2E Room ${runId}`;

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

    let roomId = '';

    await test.step('create room', async () => {
      await page.goto('/rooms');
      await page.waitForURL('**/rooms');
      await page.goto('/rooms/create');
      await page.waitForURL('**/rooms/create');
      await page.locator('input[name="roomName"]').fill(roomName);
      await page.locator('button[type="submit"]').click();
      await page.waitForURL(/\/rooms\/[0-9a-f-]{36}$/, { timeout: 60_000 });

      const url = new URL(page.url());
      const parts = url.pathname.split('/').filter(Boolean);
      roomId = parts[1] || '';
      const roomHeader = page.locator('header h1');
      await expect(roomHeader).toBeVisible();
      await expect(roomHeader).toContainText(roomName);
    });

    await test.step('cleanup room and user', async () => {
      const admin = getAdminClient();
      if (!admin) return;
      if (roomId) {
        await admin.from('decision_rooms').delete().eq('id', roomId);
      }

      const userId = await findUserIdByEmail(email);
      if (userId) {
        await admin.from('preference_profiles').delete().eq('user_id', userId);
        await admin.auth.admin.deleteUser(userId);
      }
    });
  });

  test('toggle room features', async ({ page }) => {
    test.setTimeout(90_000);
    test.skip(!baseUrl || !serviceRoleKey, 'Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL');

    const runId = Date.now();
    const email = `e2e_room_features_${runId}@example.com`;
    const password = `E2E!${runId}a`;
    const roomName = `E2E Room Features ${runId}`;

    const admin = getAdminClient();
    if (!admin) throw new Error('Admin client not configured');

    await test.step('register', async () => {
      await page.goto('/register');
      await page.locator('input[type="email"]').fill(email);
      await page.locator('input[type="password"]').fill(password);
      await page.locator('button[type="submit"]').click();
      await page.waitForURL('**/dashboard');
      await expect(page.locator('#tour-dash-header')).toBeVisible();
    });

    await test.step('confirm user (if needed)', async () => {
      const userId = await findUserIdByEmail(email);
      if (!userId) return;
      await admin.auth.admin.updateUserById(userId, { email_confirm: true });
    });

    let roomId = '';

    await test.step('create room', async () => {
      await page.goto('/rooms/create');
      await page.waitForURL('**/rooms/create');
      await page.locator('input[name="roomName"]').fill(roomName);
      await page.locator('button[type="submit"]').click();
      await page.waitForURL(/\/rooms\/[0-9a-f-]{36}$/, { timeout: 60_000 });

      const url = new URL(page.url());
      const parts = url.pathname.split('/').filter(Boolean);
      roomId = parts[1] || '';
      const roomHeader = page.locator('header h1');
      await expect(roomHeader).toContainText(roomName);
    });

    await test.step('toggle inventory feature', async () => {
      await page.locator('[data-testid="room-settings-open"]').click();
      const toggle = page.locator('[data-testid="room-feature-inventory-toggle"]');
      await expect(toggle).toBeVisible();
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-pressed', 'true');
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    });

    await test.step('toggle shopping list feature', async () => {
      const toggle = page.locator('[data-testid="room-feature-shopping-toggle"]');
      if (!(await toggle.isVisible())) {
        await page.locator('[data-testid="room-settings-open"]').click();
      }
      await expect(toggle).toBeVisible();
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-pressed', 'true');
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    });

    await test.step('cleanup room and user', async () => {
      if (roomId) {
        await admin.from('decision_rooms').delete().eq('id', roomId);
      }
      const userId = await findUserIdByEmail(email);
      if (userId) {
        await admin.from('preference_profiles').delete().eq('user_id', userId);
        await admin.auth.admin.deleteUser(userId);
      }
    });
  });
});
