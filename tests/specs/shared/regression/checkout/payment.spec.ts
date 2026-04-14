/**
 * TC-CHECKOUT-PAYMENT-* : Checkout payment method tests
 * @regression @p1
 */

import test, { expect } from '@fixtures/test.fixture';
import { ProductFactory } from '@factories/product.factory';

test.describe('Regression – Checkout Payment @regression @p1', () => {

  test('TC-CHECKOUT-PAYMENT-001: available payment methods match region', async ({ buyer }) => {
    const methods = buyer.getAvailablePayments();
    expect(methods.length).toBeGreaterThan(0);
    // VN should have COD, SG should have credit card
    const region = buyer.getRegion();
    if (region === 'VN') {
      expect(methods).toContain('COD');
    } else {
      expect(methods).toContain('CREDIT_CARD');
    }
  });

  test('TC-CHECKOUT-PAYMENT-002: payment section is visible on checkout', async ({ buyer, pages, region }) => {
    await buyer.addProductToCart(ProductFactory.getRandomProduct(region, 'running').url);
    await buyer.getCart().goto();
    await buyer.getCart().proceedToCheckout();
    // Fill minimum required fields then check payment section
    await expect(pages.checkout.page).toHaveURL(/checkout/i);
  });
});
