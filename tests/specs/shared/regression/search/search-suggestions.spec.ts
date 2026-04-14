/**
 * TC-SEARCH-SUGGEST-* : Search autocomplete suggestions
 * @regression @p2
 */

import test, { expect } from '@fixtures/test.fixture';

test.describe('Regression – Search Suggestions @regression @p2', () => {

  test('TC-SEARCH-SUGGEST-001: typing in search box shows suggestions', async ({ pages }) => {
    await pages.home.goto();
    await pages.home.search.searchInput.fill('run');
    await expect(pages.home.search.searchSuggestions).toBeVisible({ timeout: 5000 });
  });

  test('TC-SEARCH-SUGGEST-002: suggestion list has at least one item', async ({ pages }) => {
    await pages.home.goto();
    await pages.home.search.searchInput.fill('swim');
    const items = pages.home.search.searchSuggestions.locator('li, [role="option"]');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-SEARCH-SUGGEST-003: clicking suggestion triggers search', async ({ pages }) => {
    await pages.home.goto();
    await pages.home.search.searchInput.fill('bike');
    const firstSuggestion = pages.home.search.searchSuggestions
      .locator('li, [role="option"]')
      .first();
    if (await firstSuggestion.isVisible()) {
      await firstSuggestion.click();
      await expect(pages.home.page).toHaveURL(/search|q=/i);
    }
  });
});
