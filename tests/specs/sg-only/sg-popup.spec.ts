/**
 * TC-SG-POPUP-* : SG-specific popup/banner tests
 * Geolocation prompt, cookie banner (OneTrust) — chỉ có trên SG.
 * @sg-only @regression @p2
 */

import { test, expect } from '@playwright/test';

test.describe('SG – Regional Popups @sg-only @regression @p2', () => {

  test('TC-SG-POPUP-001: cookie banner (OneTrust) có thể accept', async ({ page }) => {
    await page.goto('/');
    const acceptBtn = page.locator([
      '#onetrust-accept-btn-handler',
      'button:has-text("Accept All")',
      'button:has-text("Accept")',
      '[data-testid="cookie-accept"]',
    ].join(', ')).first();

    if (await acceptBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await acceptBtn.click();
      await expect(acceptBtn).not.toBeVisible({ timeout: 2000 });
    }
  });

  test('TC-SG-POPUP-002: geolocation prompt không block navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Dismiss geolocation popup nếu có
    const geoBtn = page.locator([
      '[data-testid="geo-popup-close"]',
      'button:has-text("Stay on Singapore")',
      '.country-selector .close',
    ].join(', ')).first();

    if (await geoBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await geoBtn.click();
    }

    // Navigation phải hoạt động sau khi dismiss
    await expect(page.locator('nav, [role="navigation"]').first()).toBeVisible();
  });

  test('TC-SG-POPUP-003: VN promo popup KHÔNG xuất hiện trên SG', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Đảm bảo SG không show popup campaign của VN
    const vnPromoPopup = page.locator([
      '[data-testid="promo-popup-close"]',
      '.promo-modal',
      '.campaign-modal',
    ].join(', ')).first();

    const isVisible = await vnPromoPopup.isVisible({ timeout: 2000 }).catch(() => false);
    expect(isVisible, 'VN promo popup không nên xuất hiện trên SG').toBe(false);
  });

});
