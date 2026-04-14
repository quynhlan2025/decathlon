/**
 * TC-E2E-ACCOUNT-* : Account management journey
 * @regression @p2 @logged-in
 */

import test, { expect } from '@fixtures/test.fixture';

test.describe('E2E – Account Management @regression @p2 @logged-in', () => {

  test('TC-E2E-ACCOUNT-001: buyer can view account profile', async ({ pages }) => {
    await pages.account.goto();
    await expect(pages.account.page).toHaveURL(/account|profile|my-account/i);
  });

  test('TC-E2E-ACCOUNT-002: buyer can view order history', async ({ pages }) => {
    await pages.account.goto();
    await pages.account.navigateToSection('orders');
    await expect(pages.account.page).toHaveURL(/orders|history/i);
  });
});
