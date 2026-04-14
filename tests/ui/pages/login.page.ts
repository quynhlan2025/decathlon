/**
 * LoginPage - /login
 * Handles: email/password login, guest checkout redirect, register link
 */

import { Page, Locator } from '@playwright/test';
import BasePageObject from './BasePageObject';

export class LoginPage extends BasePageObject {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly registerLink: Locator;
  readonly forgotPasswordLink: Locator;
  readonly continueAsGuestButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByLabel(/email|tài khoản/i).first();
    this.passwordInput = page.getByLabel(/password|mật khẩu/i).first();
    this.loginButton = page.getByRole('button', { name: /log in|sign in|đăng nhập/i });
    this.errorMessage = page
      .locator('[role="alert"], [class*="error"], [class*="invalid"]')
      .first();
    this.registerLink = page.getByRole('link', { name: /register|sign up|tạo tài khoản/i });
    this.forgotPasswordLink = page.getByRole('link', { name: /forgot|quên mật khẩu/i });
    this.continueAsGuestButton = page.getByRole('button', { name: /guest|continue without/i });
  }

  async goto(): Promise<void> {
    await this.navigate('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.sendText(this.emailInput, email);
    await this.sendText(this.passwordInput, password);
    await this.click(this.loginButton);
    await this.page.waitForLoadState('networkidle');
  }

  async getErrorMessage(): Promise<string> {
    await this.waitForVisible(this.errorMessage);
    return await this.getText(this.errorMessage);
  }

  async hasError(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  async goToRegister(): Promise<void> {
    await this.click(this.registerLink);
    await this.page.waitForLoadState('networkidle');
  }

  async continueAsGuest(): Promise<void> {
    if (await this.continueAsGuestButton.isVisible()) {
      await this.click(this.continueAsGuestButton);
    }
  }
}
