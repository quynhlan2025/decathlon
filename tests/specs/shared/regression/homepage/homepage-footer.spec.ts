/**
 * TC-HP-FOOTER-* : Homepage footer tests
 * @regression @p2
 */

import test, { expect } from '@fixtures/test.fixture';

test.describe('Regression – Homepage Footer @regression @p2', () => {

  test.beforeEach(async ({ pages }) => {
    await pages.home.goto();
  });

  test('TC-HP-FOOTER-001: footer is visible', async ({ pages }) => {
    await pages.home.footer.footer.scrollIntoViewIfNeeded();
    await expect(pages.home.footer.footer).toBeVisible();
  });

  test('TC-HP-FOOTER-002: footer contains links', async ({ pages }) => {
    const footerLinks = pages.home.footer.footer.locator('a');
    const count = await footerLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-HP-FOOTER-003: social media links are present', async ({ pages }) => {
    const count = await pages.home.footer.getSocialLinkCount();
    expect(count).toBeGreaterThan(0);
  });

});
