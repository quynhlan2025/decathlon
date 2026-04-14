/**
 * FooterComponent - Site footer
 * Links: About, Help, Store Locator, Policies, Social
 */

import { Page, Locator } from '@playwright/test';
import BasePage from '../pages/BasePage';

export class FooterComponent extends BasePage {
  readonly footer: Locator;
  readonly socialLinks: Locator;
  readonly storeLocatorLink: Locator;
  readonly helpLink: Locator;
  readonly returnPolicyLink: Locator;
  readonly deliveryInfoLink: Locator;
  readonly newsletterSection: Locator;
  readonly newsletterInput: Locator;
  readonly newsletterSubmitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.footer = page.locator('footer').first();
    this.socialLinks = this.footer.locator(
      "[data-testid='social-links'] a, [class*='social'] a, [aria-label*='facebook' i], [aria-label*='instagram' i]"
    );
    this.storeLocatorLink = this.footer.getByRole('link', { name: /our stores|store locator/i });
    this.helpLink = this.footer.getByRole('link', { name: /help|support/i });
    this.returnPolicyLink = this.footer.getByRole('link', { name: /return|exchange/i });
    this.deliveryInfoLink = this.footer.getByRole('link', { name: /delivery/i });
    this.newsletterSection = this.footer.locator(
      "[data-testid='newsletter'], [class*='newsletter']"
    );
    this.newsletterInput = this.footer.getByPlaceholder(/email/i);
    this.newsletterSubmitButton = this.newsletterSection.getByRole('button', {
      name: /subscribe|sign up/i,
    });
  }

  async isVisible(): Promise<boolean> {
    await this.scrollToBottom();
    return await this.footer.isVisible();
  }

  async getSocialLinkCount(): Promise<number> {
    return await this.socialLinks.count();
  }

  async subscribeNewsletter(email: string): Promise<void> {
    await this.scrollIntoView(this.newsletterInput);
    await this.sendText(this.newsletterInput, email);
    await this.click(this.newsletterSubmitButton);
  }

  async goToStoreLocator(): Promise<void> {
    await this.click(this.storeLocatorLink);
    await this.page.waitForLoadState('networkidle');
  }

  async goToReturnPolicy(): Promise<void> {
    await this.click(this.returnPolicyLink);
    await this.page.waitForLoadState('networkidle');
  }
}
