/**
 * TC-SEARCH-FILTER-* : Search filter functionality
 * @regression @p2
 */

import test, { expect } from '@fixtures/test.fixture';

test.describe('Regression – Search Filters @regression @p2', () => {

  test.beforeEach(async ({ buyer }) => {
    await buyer.searchProduct('shoes');
  });

  test('TC-SEARCH-FILTER-001: filter panel is visible on search results', async ({ pages }) => {
    await expect(pages.searchResults.filter.filterPanel).toBeVisible();
  });

  test('TC-SEARCH-FILTER-002: price filter narrows results', async ({ pages }) => {
    const initialCount = await pages.searchResults.productGrid.cardLocators.count();
    await pages.searchResults.filter.setPriceRange(0, 50);
    const filteredCount = await pages.searchResults.productGrid.cardLocators.count();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test('TC-SEARCH-FILTER-003: sport filter is available', async ({ pages }) => {
    const filterOptions = pages.searchResults.filter.filterPanel.locator('[data-testid*="sport"]');
    const count = await filterOptions.count();
    expect(count).toBeGreaterThan(0);
  });
});
