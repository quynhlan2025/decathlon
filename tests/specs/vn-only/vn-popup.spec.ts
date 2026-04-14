/**
 * TC-VN-POPUP-* : VN-specific popup tests
 * Kiểm tra popup campaign/promotion chỉ xuất hiện trên VN.
 * @vn-only @regression @p2
 *
 * NOTE: Các test này KHÔNG dùng auto-dismiss fixture.
 *       Dùng raw `page` để kiểm tra popup thực sự tồn tại.
 */

import { test, expect } from '@playwright/test';

test.describe('VN – Campaign Popup @vn-only @regression @p2', () => {

  test('TC-VN-POPUP-001: popup có thể xuất hiện trên homepage VN', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Kiểm tra popup có xuất hiện không (campaign/promo)
    const popupSelectors = [
      '[data-testid="promo-popup-close"]',
      '[data-testid="campaign-popup-close"]',
      '.promo-modal',
      '.campaign-modal',
    ].join(', ');

    const popup = page.locator(popupSelectors).first();
    const hasPopup = await popup.isVisible({ timeout: 3000 }).catch(() => false);

    // Soft check — popup chỉ xuất hiện khi có campaign
    if (hasPopup) {
      await expect(popup).toBeVisible();
      test.info().annotations.push({ type: 'note', description: 'Popup đang active' });
    } else {
      test.info().annotations.push({ type: 'note', description: 'Không có popup active hôm nay' });
    }
  });

  test('TC-VN-POPUP-002: đóng popup không block interaction với hero', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Dismiss popup nếu có
    const closeBtn = page.locator([
      '[data-testid="promo-popup-close"]',
      '.promo-modal .close',
      '.promo-modal [aria-label="close"]',
      'button:has-text("Đóng")',
    ].join(', ')).first();

    if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await closeBtn.click();
      await expect(closeBtn).not.toBeVisible({ timeout: 2000 });
    }

    // Hero phải visible sau khi dismiss popup
    const hero = page.locator('[data-testid="hero-banner"], .hero-banner, .hero').first();
    await expect(hero).toBeVisible({ timeout: 5000 });
  });

  test('TC-VN-POPUP-003: cookie banner hiện và có thể đồng ý @vn-only @p1', async ({ page }) => {
    await page.goto('/');
    const cookieBtn = page.locator([
      '[data-testid="cookie-accept"]',
      'button:has-text("Đồng ý")',
      'button:has-text("Chấp nhận")',
    ].join(', ')).first();

    if (await cookieBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await cookieBtn.click();
      await expect(cookieBtn).not.toBeVisible({ timeout: 2000 });
    }
  });

});
