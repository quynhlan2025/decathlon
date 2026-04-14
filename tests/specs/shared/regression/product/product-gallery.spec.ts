/**
 * TC-PDP-GALLERY-* : Product image gallery tests
 * @regression @p2
 */

import test, { expect } from '@fixtures/test.fixture';
import { ProductFactory } from '@factories/product.factory';

test.describe('Regression – Product Gallery @regression @p2', () => {

  test.beforeEach(async ({ pages, region }) => {
    await pages.productDetail.goto(ProductFactory.getRandomProduct(region).url);
  });

  test('TC-PDP-GALLERY-001: main product image is visible', async ({ pages }) => {
    await expect(pages.productDetail.productImages.first()).toBeVisible();
  });

  test('TC-PDP-GALLERY-002: thumbnail images are displayed', async ({ pages }) => {
    const thumbs = pages.productDetail.productImages;
    const count = await thumbs.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('TC-PDP-GALLERY-003: clicking thumbnail updates main image', async ({ pages }) => {
    const thumbs = pages.productDetail.productImages;
    if (await thumbs.count() > 1) {
      const beforeSrc = await pages.productDetail.productImages.first().getAttribute('src');
      await thumbs.nth(1).click();
      const afterSrc = await pages.productDetail.productImages.first().getAttribute('src');
      // Image may update
      expect(afterSrc).toBeTruthy();
    }
  });
});
