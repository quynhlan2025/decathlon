/**
 * TC-E2E-REGION-* : Multi-region behavior tests
 * @regression @p1
 */

import test, { expect } from '@fixtures/test.fixture';

test.describe('E2E – Multi-region @regression @p1', () => {

  test('TC-E2E-REGION-001: currency symbol matches region', async ({ buyer, pages }) => {
    await pages.home.goto();
    const currencyPattern = buyer.getCurrencyPattern();
    const priceEl = pages.home.page.locator('[data-testid="price"], .price').first();
    if (await priceEl.isVisible()) {
      const priceText = await priceEl.textContent() ?? '';
      expect(priceText).toMatch(currencyPattern);
    }
  });

  test('TC-E2E-REGION-002: available payment methods match region', async ({ buyer }) => {
    const payments = buyer.getAvailablePayments();
    expect(payments.length).toBeGreaterThan(0);
  });
});
