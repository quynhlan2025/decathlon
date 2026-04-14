/**
 * TC-VISUAL-PDP-* : Product Detail Page visual regression tests
 * @visual @regression @p2
 *
 * Dùng getProduct(region, 0) thay vì getRandomProduct để snapshot ổn định giữa các lần chạy.
 */

import test, { expect } from '@fixtures/test.fixture';
import { ProductFactory } from '@factories/product.factory';

test.describe('Visual – Product Detail Page @visual @regression @p2', () => {

  test.beforeEach(async ({ pages, region }) => {
    await pages.productDetail.goto(ProductFactory.getProduct(region, 0).url);
  });

  test('TC-VISUAL-PDP-001: product image gallery matches snapshot', async ({ pages }) => {
    await expect(pages.productDetail.productImages.first()).toHaveScreenshot('pdp-main-image.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('TC-VISUAL-PDP-002: product info section matches snapshot', async ({ pages }) => {
    const infoSection = pages.productDetail.page.locator('[data-testid="product-info"], .product-info, .product-details').first();
    if (await infoSection.isVisible()) {
      await expect(infoSection).toHaveScreenshot('pdp-info.png', {
        maxDiffPixelRatio: 0.03,
      });
    }
  });
});
