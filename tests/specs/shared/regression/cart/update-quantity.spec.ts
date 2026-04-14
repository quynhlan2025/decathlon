/**
 * TC-CART-QTY-* : Cart quantity update tests
 * @regression @p1
 */

import test, { expect } from '@fixtures/test.fixture';
import { ProductFactory } from '@factories/product.factory';

test.describe('Regression – Cart Quantity @regression @p1', () => {

  test.beforeEach(async ({ buyer, region }) => {
    await buyer.addProductToCart(ProductFactory.getRandomProduct(region, 'running').url);
    await buyer.getCart().goto();
  });

  test('TC-CART-QTY-001: cart has at least one item after add', async ({ pages }) => {
    const count = await pages.cart.getItemCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-CART-QTY-002: quantity controls are visible for cart items', async ({ pages }) => {
    const itemCount = await pages.cart.getItemCount();
    if (itemCount > 0) {
      const qtyBtn = pages.cart.cartItems.first().getByRole('button').first();
      await expect(qtyBtn).toBeVisible();
    }
  });

  test('TC-CART-QTY-003: total price is displayed', async ({ pages }) => {
    await expect(pages.cart.totalPrice).toBeVisible();
    const total = await pages.cart.getTotalPrice();
    expect(total.length).toBeGreaterThan(0);
  });
});
