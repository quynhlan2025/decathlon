/**
 * TC-SMOKE-HOME-* : Homepage smoke tests
 * Kiểm tra cơ bản: site sống, navbar hiện, search bar có.
 * Không cần login — chạy trên guest projects (VN, SG).
 * @smoke @p0
 */

import test, { expect } from '@fixtures/test.fixture';

test.describe('Smoke – Homepage @smoke @p0', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-SMOKE-HOME-001: homepage loads and has title', async ({ page }) => {
    await expect(page).toHaveTitle(/.+/);
  });

  test('TC-SMOKE-HOME-002: navbar is visible', async ({ page }) => {
    await expect(page.locator('nav, [role="navigation"]').first()).toBeVisible();
  });

  test('TC-SMOKE-HOME-003: search input is present', async ({ page }) => {
    await expect(
      page.locator('input[type="search"], input[placeholder*="search" i], input[placeholder*="tìm" i], [data-testid*="search"] input').first()
    ).toBeVisible();
  });

});
