/**
 * ToastComponent — notification toasts (add to cart, error, success)
 */

import { Page, Locator } from '@playwright/test';
import BasePage from '../pages/BasePage';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export class ToastComponent extends BasePage {
  readonly toast: Locator;
  readonly toastMessage: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.toast = page
      .locator("[data-testid='toast'], [class*='toast'], [role='alert'], [class*='notification']")
      .first();
    this.toastMessage = this.toast.locator('[data-testid="toast-message"], p, span').first();
    this.closeButton = this.toast.getByRole('button', { name: /close|dismiss/i });
  }

  async waitForToast(timeoutMs = 5000): Promise<void> {
    await this.toast.waitFor({ state: 'visible', timeout: timeoutMs });
  }

  async getMessage(): Promise<string> {
    await this.waitForToast();
    return await this.getText(this.toastMessage);
  }

  async dismiss(): Promise<void> {
    if (await this.closeButton.isVisible()) {
      await this.click(this.closeButton);
    }
    await this.toast.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }

  async isVisible(): Promise<boolean> {
    return await this.toast.isVisible();
  }

  async waitForDisappear(): Promise<void> {
    await this.toast.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  }
}
