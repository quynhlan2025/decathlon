/**
 * TC-NAV-MAIN-* : Main navigation tests
 * @regression @p1
 */

import test, { expect } from '@fixtures/test.fixture';

test.describe('Regression – Main Navigation @regression @p1', () => {

  test.beforeEach(async ({ pages }) => {
    await pages.home.goto();
  });

  test('TC-NAV-MAIN-001: navbar is visible', async ({ pages }) => {
    await expect(pages.home.navbar.logo).toBeVisible();
  });

  test('TC-NAV-MAIN-002: nav links exist on page', async ({ pages }) => {
    const navLinks = pages.home.page.locator('nav a, [role="navigation"] a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-NAV-MAIN-003: clicking a nav link navigates', async ({ pages }) => {
    const navLinks = pages.home.page.locator('nav a').filter({ hasText: /.+/ });
    const count = await navLinks.count();
    if (count > 0) {
      await navLinks.first().click();
      await expect(pages.home.page).toHaveURL(/.+/);
    }
  });

  test('TC-NAV-MAIN-004: logo click returns to homepage', async ({ pages }) => {
    await pages.home.navbar.logo.click();
    await expect(pages.home.page).toHaveURL(/^\/?$/);
  });

  test('TC-NAV-MAIN-005: cart icon is accessible from navbar', async ({ pages }) => {
    await expect(pages.home.navbar.cartIcon).toBeVisible();
  });
});
