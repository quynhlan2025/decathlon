/**
 * TC-CART-REMOVE-* : Cart remove item tests
 * @regression @p1
 */

import test, { expect } from '@fixtures/test.fixture';
import { ProductFactory } from '@factories/product.factory';

test.describe('Regression – Remove from Cart @regression @p1', () => {

  test.beforeEach(async ({ buyer, region }) => {
    await buyer.addProductToCart(ProductFactory.getRandomProduct(region, 'running').url);
    await buyer.getCart().goto();
  });

  test('TC-CART-REMOVE-001: item can be removed from cart', async ({ pages }) => {
    const initialCount = await pages.cart.getItemCount();
    await pages.cart.removeItem(0);
    const newCount = await pages.cart.getItemCount();
    expect(newCount).toBe(initialCount - 1);
  });

  test('TC-CART-REMOVE-002: empty cart shows empty state message after removing last item', async ({ pages }) => {
    const count = await pages.cart.getItemCount();
    for (let i = 0; i < count; i++) {
      await pages.cart.removeItem(0);
    }
    await expect(pages.cart.emptyCartMessage).toBeVisible();
  });

  test('TC-CART-REMOVE-003: cart item count decreases after removal', async ({ pages }) => {
    const before = await pages.cart.getItemCount();
    if (before > 0) {
      await pages.cart.removeItem(0);
      const after = await pages.cart.getItemCount();
      expect(after).toBeLessThan(before);
    }
  });
});
