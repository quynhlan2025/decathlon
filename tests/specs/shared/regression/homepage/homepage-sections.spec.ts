/**
 * TC-HP-SECTIONS-* : Homepage sections presence tests
 * High-level checks that key homepage sections render correctly.
 * Detailed tests per section are in dedicated spec files.
 * @regression @p2
 */

import test, { expect } from '@fixtures/test.fixture';

test.describe('Regression – Homepage Sections @regression @p2', () => {

  test.beforeEach(async ({ pages }) => {
    await pages.home.goto();
  });

  test('TC-HP-SECTIONS-001: hero banner section is visible', async ({ pages }) => {
    await expect(pages.home.hp.heroBanner.heroBanner).toBeVisible();
  });

  test('TC-HP-SECTIONS-002: popular sports section renders at least 1 card', async ({ pages, page }) => {
    await page.evaluate(() => window.scrollBy(0, 300));
    const count = await pages.home.hp.popularSports.getCardCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('TC-HP-SECTIONS-003: category grid section renders at least 1 card', async ({ pages }) => {
    const count = await pages.home.hp.categoryGrid.getCardCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });

});
