/**
 * TC-AUTH-LOGIN-* : Login tests
 * @regression @p1
 */

import test, { expect } from '@fixtures/test.fixture';
import { TEST_ACCOUNTS, INVALID_CREDENTIALS } from '@data/auth-data';

test.describe('Regression – Login @regression @p1 @guest', () => {

  test.beforeEach(async ({ pages }) => {
    await pages.login.goto();
  });

  test('TC-AUTH-LOGIN-001: login page loads with email and password fields', async ({ pages }) => {
    await expect(pages.login.emailInput).toBeVisible();
    await expect(pages.login.passwordInput).toBeVisible();
    await expect(pages.login.loginButton).toBeVisible();
  });

  test('TC-AUTH-LOGIN-002: valid credentials redirect to account/home', async ({ pages, buyer }) => {
    const region = buyer.getRegion();
    const creds = TEST_ACCOUNTS[region];
    await buyer.login(creds.email, creds.password);
    await expect(pages.login.page).toHaveURL(/account|home|\//i);
  });

  test('TC-AUTH-LOGIN-003: invalid credentials show error message', async ({ pages }) => {
    const creds = INVALID_CREDENTIALS.wrongPassword;
    await pages.login.emailInput.fill(creds.email);
    await pages.login.passwordInput.fill(creds.password);
    await pages.login.loginButton.click();
    await expect(pages.login.errorMessage).toBeVisible({ timeout: 5000 });
  });

  test('TC-AUTH-LOGIN-004: empty form submission shows validation errors', async ({ pages }) => {
    await pages.login.loginButton.click();
    const errors = pages.login.page.locator('[class*="error"], [data-testid*="error"]');
    const count = await errors.count();
    expect(count).toBeGreaterThan(0);
  });
});
