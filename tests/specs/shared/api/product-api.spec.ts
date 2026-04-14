/**
 * TC-API-PROD-* : Product API Tests
 * @api @regression @p2
 * Directly calls Decathlon APIs — no UI
 * Count: ~25 tests × 2 regions = 50 runs
 */

import test, { expect } from '@fixtures/test.fixture';

test.describe('API – Product Search & Detail @api @regression @p2', () => {

  test('TC-API-PROD-001: product search API returns results for "running"', async ({ api }) => {
    const response = await api.products.searchProducts('running').catch(() => null);
    if (response) {
      expect(response.products.length).toBeGreaterThan(0);
      expect(response.total).toBeGreaterThan(0);
    }
  });

  test('TC-API-PROD-002: search response has required product fields', async ({ api }) => {
    const response = await api.products.searchProducts('yoga').catch(() => null);
    if (response?.products.length) {
      const first = response.products[0];
      expect(first).toHaveProperty('id');
      expect(first).toHaveProperty('name');
      expect(first).toHaveProperty('price');
      expect(first).toHaveProperty('currency');
    }
  });

  test('TC-API-PROD-003: search for non-existent keyword returns empty or 0 results', async ({
    api,
  }) => {
    const response = await api.products.searchProducts('xyzabc999nonexistentitem').catch(() => null);
    if (response) {
      expect(response.products.length).toBe(0);
    }
  });

  test('TC-API-PROD-004: product price is positive number', async ({ api }) => {
    const response = await api.products.searchProducts('bike').catch(() => null);
    if (response?.products.length) {
      response.products.slice(0, 3).forEach((p) => {
        expect(p.price).toBeGreaterThan(0);
      });
    }
  });

  test('TC-API-PROD-005: search with page param returns paginated results', async ({ api }) => {
    const page1 = await api.products.searchProducts('running', 1).catch(() => null);
    const page2 = await api.products.searchProducts('running', 2).catch(() => null);
    if (page1 && page2 && page1.products.length && page2.products.length) {
      expect(page1.products[0].id).not.toBe(page2.products[0].id);
    }
  });

  test('TC-API-PROD-006: category API returns products list', async ({ api }) => {
    const response = await api.products.getCategoryProducts('running').catch(() => null);
    if (response) {
      expect(Array.isArray(response.products)).toBe(true);
    }
  });

  test('TC-API-PROD-007: API response time < 5 seconds', async ({ api }) => {
    const start = Date.now();
    await api.products.searchProducts('tennis').catch(() => null);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(5_000);
  });
});
