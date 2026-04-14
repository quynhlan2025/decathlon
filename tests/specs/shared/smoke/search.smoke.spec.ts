/**
 * TC-SMOKE-SEARCH-* : Search smoke tests
 * Kiểm tra search cơ bản hoạt động.
 * Không cần login — chạy trên guest projects (VN, SG).
 * @smoke @p0
 */

import test, { expect } from '@fixtures/test.fixture';

test.describe('Smoke – Search @smoke @p0', () => {

  test('TC-SMOKE-SEARCH-001: search navigates to results page', async ({ pages }) => {
    await pages.home.goto();
    await pages.home.search.searchFor('running');
    await expect(pages.home.page).toHaveURL(/search/i);
  });

  test('TC-SMOKE-SEARCH-002: search results page has at least one product', async ({ pages }) => {
    await pages.home.goto();
    await pages.home.search.searchFor('shoes');
    await expect(pages.searchResults.productGrid.cardLocators.first()).toBeVisible();
  });

});
