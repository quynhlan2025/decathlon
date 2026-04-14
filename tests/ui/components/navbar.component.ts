/**
 * NavbarComponent - Reusable navigation bar
 * Shared across VN & SG (role-based locators → region-agnostic)
 */

import { Page, Locator } from '@playwright/test';
import BasePage from '../pages/BasePage';

export class NavbarComponent extends BasePage {
  readonly logo: Locator;
  readonly cartIcon: Locator;
  readonly accountIcon: Locator;

  constructor(page: Page) {
    super(page);
    const nav = page.locator("nav, [data-testid='navbar']");
    this.logo = nav.getByRole('link', { name: /decathlon/i });
    this.cartIcon = nav.getByRole('link', { name: /cart/i });
    this.accountIcon = nav.getByRole('link', { name: /account|profile/i });
  }

  async goToCart(): Promise<void> {
    await this.click(this.cartIcon);
  }

  async goToAccount(): Promise<void> {
    await this.click(this.accountIcon);
  }

  async isLogoVisible(): Promise<boolean> {
    return await this.logo.isVisible();
  }
}
