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

test.describe('recipes', () => {
  test('create and delete recipe', async ({ page }) => {
    test.setTimeout(60_000);
    test.skip(!baseUrl || !serviceRoleKey, 'Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL');

    const runId = Date.now();
    const email = `e2e_recipe_${runId}@example.com`;
    const password = `E2E!${runId}a`;
    const recipeName = `E2E Recipe ${runId}`;

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

    let recipeId = '';

    await test.step('create recipe', async () => {
      await page.goto('/recipes');
      await page.locator('[data-testid="create-recipe-button"]').click();
      await page.waitForURL('**/recipes/create');

      await page.locator('[data-testid="recipe-title-input"]').fill(recipeName);
      await page.locator('[data-testid="recipe-tab-ingredients"]').click();
      await page.locator('[data-testid="recipe-ingredient-f1"]').click();

      await page.locator('[data-testid="recipe-tab-steps"]').click();
      await page.locator('[data-testid="recipe-step-input"]').fill('Pas 1: Barreja tots els ingredients.');
      await page.locator('[data-testid="recipe-step-save"]').click();

      await page.locator('[data-testid="recipe-save-button"]').click();
      await page.waitForURL(/\/recipes\/[0-9a-f-]{36}$/);

      const url = new URL(page.url());
      const parts = url.pathname.split('/').filter(Boolean);
      recipeId = parts[1] || '';

      await expect(page.getByRole('heading', { name: recipeName })).toBeVisible();
    });

    await test.step('delete recipe', async () => {
      page.on('dialog', (dialog) => dialog.accept());
      await page.goto(`/recipes/${recipeId}/edit`);
      await page.waitForURL(/\/recipes\/[0-9a-f-]{36}\/edit$/);
      await page.locator('[data-testid="recipe-delete-button"]').click();
      await page.waitForURL('**/recipes');
    });

    await test.step('cleanup', async () => {
      if (recipeId) {
        await admin.from('community_recipes').delete().eq('id', recipeId);
      }
      const userId = await findUserIdByEmail(email);
      if (userId) {
        await admin.from('preference_profiles').delete().eq('user_id', userId);
        await admin.auth.admin.deleteUser(userId);
      }
    });
  });

  test('filter and search community recipes', async ({ page }) => {
    test.setTimeout(90_000);
    test.skip(!baseUrl || !serviceRoleKey, 'Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL');

    const runId = Date.now();
    const email = `e2e_recipe_filter_${runId}@example.com`;
    const password = `E2E!${runId}a`;
    const recipeName = `E2E Recipe Filter ${runId}`;

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

    let recipeId = '';

    await test.step('create recipe', async () => {
      await page.goto('/recipes');
      await page.locator('[data-testid="create-recipe-button"]').click();
      await page.waitForURL('**/recipes/create');

      await page.locator('[data-testid="recipe-title-input"]').fill(recipeName);
      await page.locator('[data-testid="recipe-tab-ingredients"]').click();
      await page.locator('[data-testid="recipe-ingredient-f1"]').click();

      await page.locator('[data-testid="recipe-tab-steps"]').click();
      await page.locator('[data-testid="recipe-step-input"]').fill('Pas 1: Barreja tots els ingredients.');
      await page.locator('[data-testid="recipe-step-save"]').click();

      await page.locator('[data-testid="recipe-save-button"]').click();
      await page.waitForURL(/\/recipes\/[0-9a-f-]{36}$/);

      const url = new URL(page.url());
      const parts = url.pathname.split('/').filter(Boolean);
      recipeId = parts[1] || '';
    });

    await test.step('make recipe public for search', async () => {
      if (!recipeId) return;
      const { error } = await admin
        .from('saved_recipes')
        .update({ is_public: true })
        .eq('id', recipeId);
      if (error) throw error;
    });

    await test.step('filter and search', async () => {
      await page.goto('/recipes');
      await page.locator('[data-testid="recipe-mode-all"]').click();
      await page.locator('[data-testid="recipe-search-input"]').fill(recipeName);

      const card = page.locator(`[data-testid="recipe-card-${recipeId}"]`);
      await expect(card).toBeVisible();
    });

    await test.step('cleanup', async () => {
      if (recipeId) {
        await admin.from('community_recipes').delete().eq('id', recipeId);
      }
      const userId = await findUserIdByEmail(email);
      if (userId) {
        await admin.from('preference_profiles').delete().eq('user_id', userId);
        await admin.auth.admin.deleteUser(userId);
      }
    });
  });
});
