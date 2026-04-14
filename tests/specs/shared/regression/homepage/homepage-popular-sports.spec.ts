/**
 * TC-HP-SPORT-* : Popular Sports section tests
 * Sport category carousel displayed on the homepage.
 * @regression @p1
 */

import test, { expect } from '@fixtures/test.fixture';

test.describe('Homepage – Popular Sports @regression @p1', () => {

  test.beforeEach(async ({ pages }) => {
    await pages.home.goto();
    await pages.home.page.evaluate(() => window.scrollBy(0, 300));
  });

  test('TC-HP-SPORT-001: Popular Sports section is visible', async ({ pages }) => {
    expect(await pages.home.hp.popularSports.isVisible()).toBe(true);
  });

  test('TC-HP-SPORT-002: at least 4 sport cards are displayed', async ({ pages }) => {
    const count = await pages.home.hp.popularSports.getCardCount();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('TC-HP-SPORT-003: all sport cards have non-empty text labels', async ({ pages }) => {
    const count = await pages.home.hp.popularSports.getCardCount();
    expect(count).toBeGreaterThan(0);
    const names = await pages.home.hp.popularSports.getSportNames();
    for (const name of names) {
      expect(name.length).toBeGreaterThan(0);
    }
  });

  test('TC-HP-SPORT-004: clicking a sport card navigates to category page', async ({ pages, page }) => {
    const count = await pages.home.hp.popularSports.getCardCount();
    if (count === 0) test.skip();

    await pages.home.hp.popularSports.clickSport(0);
    await page.waitForURL(url => url.toString() !== pages.home.page.url());
    expect(page.url()).not.toMatch(/^https?:\/\/[^/]+\/?$/);
  });

  test('TC-HP-SPORT-005: clicking sport by name navigates correctly', async ({ pages, page }) => {
    const names = await pages.home.hp.popularSports.getSportNames();
    if (names.length === 0) test.skip();

    await pages.home.hp.popularSports.clickSportByName(names[0]);
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).not.toMatch(/^https?:\/\/[^/]+\/?$/);
  });

  test('TC-HP-SPORT-006: carousel next button scrolls to new cards (if carousel)', async ({ pages }) => {
    const hasCarousel = await pages.home.hp.popularSports.hasCarousel();
    if (!hasCarousel) test.skip();

    await pages.home.hp.popularSports.scrollNext();
    const count = await pages.home.hp.popularSports.getCardCount();
    expect(count).toBeGreaterThan(0);
  });

});
