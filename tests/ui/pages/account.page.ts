/**
 * AccountPage - /account or /my-account
 * Logged-in user: profile, order history, logout
 */

import { Page, Locator } from '@playwright/test';
import BasePageObject from './BasePageObject';

export interface ProfileInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export class AccountPage extends BasePageObject {
  readonly accountNav: Locator;
  readonly profileSection: Locator;
  readonly orderHistorySection: Locator;
  readonly logoutButton: Locator;
  readonly orderItems: Locator;
  readonly welcomeMessage: Locator;
  readonly editProfileButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.accountNav = page.locator(
      "[data-testid='account-nav'], [class*='account-menu'], [aria-label='account navigation']"
    );
    this.profileSection = page.locator("[data-testid='profile-section'], [id*='profile']");
    this.orderHistorySection = page.locator(
      "[data-testid='order-history'], [id*='orders'], [class*='order-history']"
    );
    this.logoutButton = page.getByRole('button', { name: /log out|sign out|đăng xuất/i });
    this.orderItems = this.orderHistorySection.locator(
      "[data-testid='order-item'], [class*='order-item']"
    );
    this.welcomeMessage = page.locator("[data-testid='welcome'], h1, [class*='welcome']").first();
    this.editProfileButton = page.getByRole('button', { name: /edit|update profile/i });
    this.firstNameInput = page.getByLabel(/first name/i);
    this.lastNameInput = page.getByLabel(/last name/i);
    this.saveButton = page.getByRole('button', { name: /save|update/i });
  }

  async goto(): Promise<void> {
    await this.navigate('/account');
  }

  async getOrderCount(): Promise<number> {
    return await this.orderItems.count();
  }

  async getWelcomeText(): Promise<string> {
    return await this.getText(this.welcomeMessage);
  }

  async logout(): Promise<void> {
    await this.click(this.logoutButton);
    await this.page.waitForLoadState('networkidle');
  }

  async updateProfile(info: Partial<ProfileInfo>): Promise<void> {
    await this.click(this.editProfileButton);
    if (info.firstName) await this.sendText(this.firstNameInput, info.firstName);
    if (info.lastName) await this.sendText(this.lastNameInput, info.lastName);
    await this.click(this.saveButton);
    await this.page.waitForLoadState('networkidle');
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.welcomeMessage.isVisible();
  }

  async navigateToSection(section: 'profile' | 'orders' | 'wishlist'): Promise<void> {
    const link = this.accountNav.getByRole('link', { name: new RegExp(section, 'i') });
    await this.click(link);
    await this.page.waitForLoadState('networkidle');
  }
}
