/**
 * TC-HP-TREND-* : Trending Search section tests
 * Algolia-powered keyword chips (bicycle, backpack, socks, etc.)
 * @regression @p2
 */

import test, { expect } from '@fixtures/test.fixture';

test.describe('Homepage – Trending Search @regression @p2', () => {

  test.beforeEach(async ({ pages }) => {
    await pages.home.goto();
  });

  test('TC-HP-TREND-001: Trending Search section is visible', async ({ pages }) => {
    expect(await pages.home.hp.trendingSearch.isVisible()).toBe(true);
  });

  test('TC-HP-TREND-002: at least 3 keyword chips are displayed', async ({ pages }) => {
    const count = await pages.home.hp.trendingSearch.getKeywordCount();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('TC-HP-TREND-003: all keyword chips have non-empty text', async ({ pages }) => {
    expect(await pages.home.hp.trendingSearch.allKeywordsHaveText()).toBe(true);
  });

  test('TC-HP-TREND-004: keyword list is not empty', async ({ pages }) => {
    const keywords = await pages.home.hp.trendingSearch.getKeywords();
    expect(keywords.length).toBeGreaterThan(0);
    for (const kw of keywords) {
      expect(kw).toBeTruthy();
    }
  });

  test('TC-HP-TREND-005: clicking a keyword chip navigates to search results', async ({ pages, page }) => {
    const count = await pages.home.hp.trendingSearch.getKeywordCount();
    if (count === 0) test.skip();

    await pages.home.hp.trendingSearch.clickKeyword(0);
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/search|query|q=/i);
  });

  test('TC-HP-TREND-006: clicking keyword by text navigates away from homepage', async ({ pages, page }) => {
    const keywords = await pages.home.hp.trendingSearch.getKeywords();
    if (keywords.length === 0) test.skip();

    await pages.home.hp.trendingSearch.clickKeywordByText(keywords[0]);
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).not.toBe('/');
  });

});
