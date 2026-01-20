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

test.describe('inventory', () => {
  test('enable shared inventory and add item', async ({ page }) => {
    test.setTimeout(60_000);
    test.skip(!baseUrl || !serviceRoleKey, 'Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL');

    const runId = Date.now();
    const email = `e2e_inventory_${runId}@example.com`;
    const password = `E2E!${runId}a`;
    const roomName = `E2E Inventory Room ${runId}`;
    const productName = `E2E Inventory Item ${runId}`;
    const productId = crypto.randomUUID();
    const externalId = `e2e-inv-${runId}`;

    const admin = getAdminClient();
    if (!admin) throw new Error('Admin client not configured');

    await test.step('seed product catalog', async () => {
      const { error } = await admin
        .from('product_catalog')
        .upsert({
          id: productId,
          external_id: externalId,
          source: 'E2E',
          name: productName,
          price: 1.25,
          image_url: null,
          tags: ['e2e'],
          emoji: '??',
          last_fetched_at: new Date().toISOString(),
          quantity_amount: 1,
          quantity_unit: 'ut',
        });
      if (error) throw error;
    });

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

    await test.step('enable inventory for room', async () => {
      await page.locator('[data-testid="room-feature-inventory-enable"]').click();
      await expect(page.locator('[data-testid="room-feature-inventory-open"]')).toBeVisible();
    });

    await test.step('add item in shared inventory', async () => {
      await page.goto('/inventory');
      await page.locator('[data-testid="inventory-scope-select"]').selectOption(roomId);

      await page.locator('[data-testid="inventory-add-button"]').click();
      await page.locator('[data-testid="product-search-input"]').fill(productName);
      await page.locator(`[data-testid="product-card-${productId}"]`).click();
      await page.getByRole('button', { name: 'Afegir' }).click();

      await expect(page.locator('[data-testid="product-search-input"]')).toHaveCount(0);
      await expect(page.getByText(productName)).toBeVisible();
    });

    await test.step('cleanup', async () => {
      if (roomId) {
        await admin.from('decision_rooms').delete().eq('id', roomId);
      }
      await admin.from('product_catalog').delete().eq('id', productId);
      const userId = await findUserIdByEmail(email);
      if (userId) {
        await admin.from('preference_profiles').delete().eq('user_id', userId);
        await admin.auth.admin.deleteUser(userId);
      }
    });
  });
});
