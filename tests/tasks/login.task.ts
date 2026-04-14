/**
 * LoginTask — Atomic action: navigate to /login and authenticate
 * Reusable by BuyerActor, SellerActor, or directly in specs.
 *
 * Usage:
 *   await LoginTask.as(page).withCredentials(email, password).execute();
 *   await LoginTask.asGuest(page).execute();  // skip login
 */

import { Page, test } from '@playwright/test';
import { LoginPage } from '@ui/pages/login.page';

export interface LoginCredentials {
  email: string;
  password: string;
}

export class LoginTask {
  private page: Page;
  private credentials?: LoginCredentials;
  private isGuest = false;

  private constructor(page: Page) {
    this.page = page;
  }

  // ─── Builder ─────────────────────────────────────────────────

  static as(page: Page): LoginTask {
    return new LoginTask(page);
  }

  static asGuest(page: Page): LoginTask {
    const task = new LoginTask(page);
    task.isGuest = true;
    return task;
  }

  withCredentials(email: string, password: string): this {
    this.credentials = { email, password };
    return this;
  }

  // ─── Execute ─────────────────────────────────────────────────

  async execute(): Promise<void> {
    if (this.isGuest) return; // No-op for guest

    return test.step('LoginTask: authenticate user', async () => {
      const loginPage = new LoginPage(this.page);
      await loginPage.goto();

      const emailVisible = await loginPage.emailInput.isVisible().catch(() => false);
      if (!emailVisible) return; // Already logged in or no login form

      if (!this.credentials) throw new Error('LoginTask: credentials not set');
      await loginPage.login(this.credentials.email, this.credentials.password);
    });
  }

  // ─── Static shortcuts ────────────────────────────────────────

  static async perform(page: Page, credentials: LoginCredentials): Promise<void> {
    await LoginTask.as(page).withCredentials(credentials.email, credentials.password).execute();
  }
}
