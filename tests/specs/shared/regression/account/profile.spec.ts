/**
 * TC-ACCOUNT-PROFILE-* : Account profile tests
 * @regression @p2 @logged-in
 */

import test, { expect } from '@fixtures/test.fixture';

test.describe('Regression – Account Profile @regression @p2 @logged-in', () => {

  test('TC-ACCOUNT-PROFILE-001: account page is accessible when logged in', async ({ pages }) => {
    await pages.account.goto();
    await expect(pages.account.page).toHaveURL(/account|profile|my-account/i);
  });

  test('TC-ACCOUNT-PROFILE-002: profile information is displayed', async ({ pages }) => {
    await pages.account.goto();
    await expect(pages.account.profileSection).toBeVisible();
  });

  test('TC-ACCOUNT-PROFILE-003: order history section is accessible', async ({ pages }) => {
    await pages.account.goto();
    await pages.account.navigateToSection('orders');
    await expect(pages.account.orderHistorySection).toBeVisible();
  });

  test('TC-ACCOUNT-PROFILE-004: logout is available', async ({ pages }) => {
    await pages.account.goto();
    const logoutBtn = pages.account.logoutButton;
    await expect(logoutBtn).toBeVisible();
  });
});
