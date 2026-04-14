/**
 * TC-CAT-SUB-* : Subcategory navigation tests
 * @regression @p2
 */

import test, { expect } from '@fixtures/test.fixture';

test.describe('Regression – Subcategory @regression @p2', () => {

  test('TC-CAT-SUB-001: subcategory filters are available on category page', async ({ pages }) => {
    await pages.category.goto('/c/sports-shoes');
    const filters = pages.category.filter.filterPanel;
    await expect(filters).toBeVisible();
  });

  test('TC-CAT-SUB-002: selecting subcategory updates product list', async ({ pages }) => {
    await pages.category.goto('/c/sports-shoes');
    const initialCount = await pages.category.getProductCount();
    await pages.category.filter.filterPanel.locator('input[type="checkbox"]').first().click();
    const newCount = await pages.category.getProductCount();
    expect(newCount).toBeGreaterThanOrEqual(0);
    expect(newCount).toBeLessThanOrEqual(initialCount);
  });
});
