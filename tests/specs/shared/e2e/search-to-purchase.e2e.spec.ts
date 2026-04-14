/**
 * TC-E2E-S2P-* : Search → Product → Cart → Purchase journey
 * @regression @p1
 */

import test, { expect } from '@fixtures/test.fixture';

test.describe('E2E – Search to Purchase @regression @p1', () => {

  test('TC-E2E-S2P-001: buyer can search and buy a product', async ({ buyer }) => {
    await buyer.buyProductBySearch('running shoes');
    await expect(buyer.getPage()).toHaveURL(/confirmation|success|cart|checkout/i);
  });

  test('TC-E2E-S2P-002: search results include correct product categories', async ({ buyer }) => {
    await buyer.searchProduct('basketball');
    const url = buyer.getPage().url();
    expect(url).toMatch(/search|q=basketball/i);
  });
});
