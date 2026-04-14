/**
 * TC-E2E-AUTH-CHECKOUT-* : Logged-in user checkout journey
 * @regression @p1 @logged-in
 */

import test, { expect } from '@fixtures/test.fixture';
import { ProductFactory } from '@factories/product.factory';

test.describe('E2E – Logged-in Checkout @regression @p1 @logged-in', () => {

  test('TC-E2E-AUTH-CHECKOUT-001: logged-in buyer can buy product directly', async ({ buyer, region }) => {
    await buyer.buyProduct(ProductFactory.getRandomProduct(region, 'running').url);
    await expect(buyer.getPage()).toHaveURL(/confirmation|success|thank/i);
  });

  test('TC-E2E-AUTH-CHECKOUT-002: cart persists across page refresh', async ({ buyer, region }) => {
    await buyer.addProductToCart(ProductFactory.getRandomProduct(region, 'running').url);
    await buyer.getPage().reload();
    const cart = buyer.getCart();
    await cart.goto();
    const count = await cart.getItemCount();
    expect(count).toBeGreaterThan(0);
  });
});
