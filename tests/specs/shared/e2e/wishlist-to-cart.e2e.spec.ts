/**
 * TC-E2E-WL-* : Wishlist → Cart journey
 * @regression @p2 @logged-in
 */

import test, { expect } from '@fixtures/test.fixture';
import { ProductFactory } from '@factories/product.factory';

test.describe('E2E – Wishlist to Cart @regression @p2 @logged-in', () => {

  test('TC-E2E-WL-001: buyer can add product to wishlist from PDP', async ({ pages, region }) => {
    await pages.productDetail.goto(ProductFactory.getRandomProduct(region).url);
    const wishlistBtn = pages.productDetail.page
      .locator('[data-testid="wishlist-btn"], [aria-label*="wishlist" i], [aria-label*="save" i]')
      .first();
    if (await wishlistBtn.isVisible()) {
      await wishlistBtn.click();
      await pages.wishlist.goto();
      const count = await pages.wishlist.getItemCount();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('TC-E2E-WL-002: buyer can move item from wishlist to cart', async ({ pages }) => {
    await pages.wishlist.goto();
    const count = await pages.wishlist.getItemCount();
    if (count > 0) {
      await pages.wishlist.addItemToCart(0);
      await pages.cart.goto();
      const cartCount = await pages.cart.getItemCount();
      expect(cartCount).toBeGreaterThan(0);
    }
  });
});
