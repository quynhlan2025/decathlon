/**
 * SellerActor — Admin / backend user role
 * Uses LoginTask for authentication.
 */

import { Page } from '@playwright/test';
import { Actor } from './actor';
import { LoginTask } from '@tasks/login.task';
import { TEST_ACCOUNTS } from '@constants/test-data';
import type { Region } from '@constants/urls';

export class SellerActor extends Actor {
  constructor(page: Page, region: Region) {
    super(page, region);
  }

  async loginToSystem(options?: { email?: string; password?: string }): Promise<void> {
    const defaults = TEST_ACCOUNTS[this.region].seller;
    await LoginTask.perform(this.page, {
      email: options?.email ?? defaults.email,
      password: options?.password ?? defaults.password,
    });
  }
}
