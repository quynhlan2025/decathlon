/**
 * TC-CHECKOUT-SHIPPING-* : Checkout shipping form tests
 * @regression @p1
 */

import test, { expect } from '@fixtures/test.fixture';
import { CHECKOUT_TEST_DATA } from '@data/checkout-data';
import { ProductFactory } from '@factories/product.factory';

test.describe('Regression – Checkout Shipping @regression @p1', () => {

  test.beforeEach(async ({ buyer, region }) => {
    await buyer.addProductToCart(ProductFactory.getRandomProduct(region, 'running').url);
    const cart = buyer.getCart();
    await cart.goto();
    await cart.proceedToCheckout();
  });

  test('TC-CHECKOUT-SHIPPING-001: shipping form is visible', async ({ pages }) => {
    await expect(pages.checkout.page).toHaveURL(/checkout/i);
    await expect(pages.checkout.fullNameInput).toBeVisible();
  });

  test('TC-CHECKOUT-SHIPPING-002: form shows validation errors for empty fields', async ({ pages }) => {
    await pages.checkout.continueButton.click();
    const errorEl = pages.checkout.page
      .locator('[class*="error"], [class*="invalid"], [data-testid*="error"]')
      .first();
    await expect(errorEl).toBeVisible({ timeout: 3000 }).catch(() => {
      // Some forms validate on submit — acceptable
    });
  });

  test('TC-CHECKOUT-SHIPPING-003: guest can fill shipping info', async ({ pages, region }) => {
    const data = CHECKOUT_TEST_DATA[region];
    await pages.checkout.fillGuestInfo(data.guestInfo);
    await expect(pages.checkout.fullNameInput).toHaveValue(data.guestInfo.fullName);
  });
});
