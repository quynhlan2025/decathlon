/**
 * TC-E2E-GUEST-* : Guest checkout end-to-end journey
 * @regression @p1
 */

import test, { expect } from '@fixtures/test.fixture';
import { CHECKOUT_TEST_DATA } from '@data/checkout-data';
import { ProductFactory } from '@factories/product.factory';

test.describe('E2E – Guest Checkout @regression @p1 @guest', () => {

  test('TC-E2E-GUEST-001: guest can complete checkout with valid address', async ({ buyer }) => {
    const region = buyer.getRegion();
    const data = CHECKOUT_TEST_DATA[region];

    await buyer.addProductToCart(ProductFactory.getRandomProduct(region).url);
    const result = await buyer.completeGuestCheckout({
      region,
      guestInfo: data.guestInfo,
      address:   data.address,
    });

    expect(result.orderNumber).toMatch(/\w+/);
  });

  test('TC-E2E-GUEST-002: order confirmation page is shown after checkout', async ({ buyer }) => {
    const region = buyer.getRegion();
    const data = CHECKOUT_TEST_DATA[region];

    await buyer.addProductToCart(ProductFactory.getRandomProduct(region).url);
    await buyer.completeGuestCheckout({
      region,
      guestInfo: data.guestInfo,
      address:   data.address,
    });

    await expect(buyer.getPage()).toHaveURL(/confirmation|success|thank/i);
  });
});
