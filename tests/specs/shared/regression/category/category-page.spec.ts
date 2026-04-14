/**
 * TC-CAT-* : Category page tests
 * @regression @p1
 */

import test, { expect } from '@fixtures/test.fixture';

test.describe('Regression – Category Page @regression @p1', () => {

  test.beforeEach(async ({ pages }) => {
    await pages.category.goto('/c/running');
  });

  test('TC-CAT-001: category page loads with products', async ({ pages }) => {
    const count = await pages.category.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-CAT-002: category title is displayed', async ({ pages }) => {
    await expect(pages.category.categoryTitle).toBeVisible();
  });

  test('TC-CAT-003: pagination or load-more exists when products > page size', async ({ pages }) => {
    const count = await pages.category.getProductCount();
    if (count >= 20) {
      const hasPagination = await pages.category.paginationNext.isVisible();
      expect(hasPagination).toBe(true);
    }
  });
});
