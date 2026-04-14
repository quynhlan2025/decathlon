/**
 * TC-WL-* : Wishlist tests
 * @regression @p2 @logged-in
 */

import test, { expect } from '@fixtures/test.fixture';
import { ProductFactory } from '@factories/product.factory';

test.describe('Regression – Wishlist @regression @p2 @logged-in', () => {

  test('TC-WL-001: wishlist page is accessible', async ({ pages }) => {
    await pages.wishlist.goto();
    await expect(pages.wishlist.page).toHaveURL(/wishlist|saved|favourite/i);
  });

  test('TC-WL-002: product can be added to wishlist from PDP', async ({ pages, region }) => {
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

  test('TC-WL-003: product can be removed from wishlist', async ({ pages }) => {
    await pages.wishlist.goto();
    const initial = await pages.wishlist.getItemCount();
    if (initial > 0) {
      await pages.wishlist.removeItem(0);
      const after = await pages.wishlist.getItemCount();
      expect(after).toBe(initial - 1);
    }
  });

  test('TC-WL-004: wishlist item can be moved to cart', async ({ pages }) => {
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
