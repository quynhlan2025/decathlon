/**
 * NewsletterSectionComponent — Email signup section at the bottom of homepage
 * Typically contains: heading text + email input + subscribe button
 */

import { Page, Locator } from '@playwright/test';

export class NewsletterSectionComponent {
  readonly container: Locator;
  readonly sectionTitle: Locator;
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.container = page.locator([
      '[data-testid="newsletter"]',
      '[data-testid="newsletter-section"]',
      '[class*="newsletter"]',
      'section:has(input[type="email"])',
    ].join(', ')).first();

    this.sectionTitle  = this.container.locator('h2, h3, [class*="title"]').first();
    this.emailInput    = this.container.locator('input[type="email"], input[name*="email" i], input[placeholder*="email" i]').first();
    this.submitButton  = this.container.locator('button[type="submit"], button:has-text("Subscribe"), button:has-text("Đăng ký"), input[type="submit"]').first();
    this.successMessage = this.container.locator('[class*="success"], [class*="confirmation"], [role="status"]').first();
    this.errorMessage  = this.container.locator('[class*="error"], [role="alert"]').first();
  }

  async isVisible(): Promise<boolean> {
    return this.container.isVisible().catch(() => false);
  }

  async subscribe(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }

  async isSuccessVisible(): Promise<boolean> {
    return this.successMessage.isVisible().catch(() => false);
  }

  async isErrorVisible(): Promise<boolean> {
    return this.errorMessage.isVisible().catch(() => false);
  }

  async getErrorText(): Promise<string> {
    return (await this.errorMessage.textContent().catch(() => ''))?.trim() ?? '';
  }
}
