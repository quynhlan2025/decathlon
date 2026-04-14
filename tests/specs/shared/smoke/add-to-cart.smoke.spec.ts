/**
 * TC-SMOKE-CART-* : Product & Add-to-cart smoke tests
 * Kiểm tra PDP load và nút Add to Cart hiện.
 * Không cần login — chạy trên guest projects (VN, SG).
 * @smoke @p0
 */

import test, { expect } from '@fixtures/test.fixture';
import { ProductFactory } from '@factories/product.factory';

test.describe('Smoke – Product & Add to Cart @smoke @p0', () => {

  test('TC-SMOKE-CART-001: product detail page loads', async ({ pages, region }) => {
    const product = ProductFactory.getRandomProduct(region);
    await pages.productDetail.goto(product.url);
    await expect(pages.productDetail.productName).toBeVisible();
  });

  test('TC-SMOKE-CART-002: add to cart button is visible on PDP', async ({ pages, region }) => {
    const product = ProductFactory.getRandomProduct(region);
    await pages.productDetail.goto(product.url);
    await expect(pages.productDetail.addToCartButton).toBeVisible();
  });

});
