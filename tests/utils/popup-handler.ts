/**
 * PopupHandler — Auto-dismiss regional popups
 *
 * Được inject vào page fixture — tất cả tests tự động được bảo vệ.
 * Tests KHÔNG cần biết popup tồn tại hay không.
 *
 * Thêm popup mới: chỉ sửa tests/constants/popups.ts
 */

import type { Page } from '@playwright/test';
import { REGIONAL_POPUPS } from '@constants/popups';
import { logger } from '@utils/logger';

export class PopupHandler {

  /**
   * Dismiss tất cả popups có thể xuất hiện trên page hiện tại.
   * Bỏ qua nếu popup không visible — không throw.
   */
  static async dismissAll(page: Page, region: 'VN' | 'SG'): Promise<void> {
    const popups = REGIONAL_POPUPS[region];
    if (!popups?.length) return;

    let currentPath = '/';
    try {
      currentPath = new URL(page.url()).pathname;
    } catch {
      return; // page chưa load URL hợp lệ
    }

    for (const popup of popups) {
      // Bỏ qua nếu popup chỉ xuất hiện trên trang khác
      if (popup.pages && !popup.pages.some(p => currentPath.startsWith(p))) {
        continue;
      }

      const timeout = popup.timeout ?? 1500;

      try {
        const btn = page.locator(popup.selector).first();
        const visible = await btn.isVisible({ timeout }).catch(() => false);

        if (visible) {
          await btn.click({ timeout: 3000 });
          logger.info('PopupHandler', `dismissed: ${popup.name}`, { region, path: currentPath });
        }
      } catch {
        // Popup không click được — bỏ qua, không fail test
        logger.debug('PopupHandler', `skip: ${popup.name} (not interactable)`, { region });
      }
    }
  }

  /**
   * Setup auto-dismiss trên mỗi page navigation.
   * Gọi 1 lần trong fixture — tự động áp dụng cho toàn bộ test.
   */
  static setup(page: Page, region: 'VN' | 'SG'): void {
    page.on('load', () => {
      PopupHandler.dismissAll(page, region).catch(() => {});
    });
  }
}
