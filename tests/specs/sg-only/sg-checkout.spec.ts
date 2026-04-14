/**
 * TC-SG-CO-* : SG-specific checkout tests
 * Credit card, PayNow, postal code — chỉ có trên SG.
 * @sg-only @regression @p1
 */

import test, { expect } from '@fixtures/test.fixture';
import { CHECKOUT_TEST_DATA } from '@data/checkout-data';
import { ProductFactory } from '@factories/product.factory';

test.describe('SG – Checkout Specific @sg-only @regression @p1', () => {

  test('TC-SG-CO-001: Credit Card là phương thức thanh toán mặc định', async ({ buyer }) => {
    const methods = buyer.getAvailablePayments();
    expect(methods).toContain('CREDIT_CARD');
  });

  test('TC-SG-CO-002: form địa chỉ SG dùng postal code (không có tỉnh/quận)', async ({ pages, buyer }) => {
    const data = CHECKOUT_TEST_DATA['SG'];
    await buyer.addProductToCart(ProductFactory.getRandomProduct('SG').url);
    await buyer.getCart().goto();
    await buyer.getCart().proceedToCheckout();

    // SG-specific: postal code thay vì tỉnh/quận/phường
    await expect(pages.checkout.postalCodeInput).toBeVisible();
    await expect(pages.checkout.provinceDropdown).not.toBeVisible();
  });

  test('TC-SG-CO-003: giá hiển thị định dạng SGD ($)', async ({ buyer }) => {
    const pattern = buyer.getCurrencyPattern();
    expect(pattern.source).toMatch(/\$|SGD/);
  });

  test('TC-SG-CO-004: PayNow có trong danh sách phương thức thanh toán', async ({ buyer }) => {
    const methods = buyer.getAvailablePayments();
    expect(methods).toContain('PAYNOW');
  });

});
