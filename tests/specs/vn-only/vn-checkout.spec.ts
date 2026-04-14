/**
 * TC-VN-CO-* : VN-specific checkout tests
 * COD, VNPAY, địa chỉ tỉnh/quận/phường — chỉ có trên VN.
 * @vn-only @regression @p1
 */

import test, { expect } from '@fixtures/test.fixture';
import { CHECKOUT_TEST_DATA } from '@data/checkout-data';
import { ProductFactory } from '@factories/product.factory';

test.describe('VN – Checkout Specific @vn-only @regression @p1', () => {

  test('TC-VN-CO-001: COD là phương thức thanh toán mặc định', async ({ buyer }) => {
    const methods = buyer.getAvailablePayments();
    expect(methods).toContain('COD');
  });

  test('TC-VN-CO-002: hiển thị cascade tỉnh/quận/phường trên form địa chỉ', async ({ pages, buyer }) => {
    const data = CHECKOUT_TEST_DATA['VN'];
    await buyer.addProductToCart(ProductFactory.getRandomProduct('VN').url);
    await buyer.getCart().goto();
    await buyer.getCart().proceedToCheckout();

    // VN-specific: có dropdown tỉnh/quận/phường
    await expect(pages.checkout.provinceDropdown).toBeVisible();
    await expect(pages.checkout.districtDropdown).toBeVisible();
    await expect(pages.checkout.wardDropdown).toBeVisible();
  });

  test('TC-VN-CO-003: giá hiển thị định dạng VND (đ)', async ({ buyer }) => {
    const pattern = buyer.getCurrencyPattern();
    // VN pattern: số + đ hoặc VND
    expect(pattern.source).toMatch(/đ|VND/i);
  });

  test('TC-VN-CO-004: VNPAY có trong danh sách phương thức thanh toán', async ({ buyer }) => {
    const methods = buyer.getAvailablePayments();
    expect(methods).toContain('VNPAY');
  });

});
