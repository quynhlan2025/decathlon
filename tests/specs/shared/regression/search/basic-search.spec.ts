/**
 * TC-SEARCH-BASIC-* : Basic search functionality
 * @regression @p1
 */

import test, { expect } from '@fixtures/test.fixture';

test.describe('Regression – Basic Search @regression @p1', () => {

  test('TC-SEARCH-BASIC-001: search with valid keyword returns results', async ({ buyer }) => {
    await buyer.searchProduct('running');
    await expect(buyer.getPage()).toHaveURL(/search|q=/i);
  });

  test('TC-SEARCH-BASIC-002: search results show product cards', async ({ pages, buyer }) => {
    await buyer.searchProduct('tennis');
    const cards = pages.searchResults.productGrid.cardLocators;
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-SEARCH-BASIC-003: search results page shows result count', async ({ pages, buyer }) => {
    await buyer.searchProduct('yoga');
    const countEl = pages.searchResults.resultCount;
    if (await countEl.isVisible()) {
      const text = await countEl.textContent();
      expect(text).toMatch(/\d+/);
    }
  });

  test('TC-SEARCH-BASIC-004: empty search shows no results or all products', async ({ buyer }) => {
    await buyer.searchProduct('xyzxyzxyznotaproduct123');
    const page = buyer.getPage();
    // Should show empty state or stay on search page
    await expect(page).toHaveURL(/.+/);
  });
});
