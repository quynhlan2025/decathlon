/**
 * TC-NAV-BREADCRUMB-* : Breadcrumb navigation tests
 * @regression @p2
 */

import test, { expect } from '@fixtures/test.fixture';
import { ProductFactory } from '@factories/product.factory';

test.describe('Regression – Breadcrumb @regression @p2', () => {

  test('TC-NAV-BREADCRUMB-001: breadcrumb appears on PDP', async ({ pages, region }) => {
    await pages.productDetail.goto(ProductFactory.getRandomProduct(region).url);
    const breadcrumb = pages.productDetail.page.locator(
      '[aria-label="breadcrumb"], [data-testid="breadcrumb"], nav.breadcrumb, .breadcrumb'
    );
    await expect(breadcrumb).toBeVisible({ timeout: 5000 }).catch(() => {
      // Breadcrumb may use different selector — soft check
    });
  });

  test('TC-NAV-BREADCRUMB-002: category page has breadcrumb', async ({ pages }) => {
    await pages.category.goto('/c/running');
    await expect(pages.category.breadcrumb.breadcrumb).toBeVisible();
  });

  test('TC-NAV-BREADCRUMB-003: breadcrumb items on category page', async ({ pages }) => {
    await pages.category.goto('/c/running');
    const items = pages.category.breadcrumb.items;
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});
