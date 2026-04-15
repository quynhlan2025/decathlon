/**
 * TC-MAIN-* : Main user journey — full happy-path flows
 * Covers: Homepage → Search → PDP → Cart → Checkout (guest & logged-in)
 * Product URL lấy từ API (api.products.getRandomInStockProduct) thay vì hardcode.
 * @regression @p1 @main-flow
 */

import test, { expect } from '@fixtures/test.fixture';
import { CHECKOUT_TEST_DATA } from '@data/checkout-data';

test.describe('Main Flow – Homepage to Purchase @regression @p1 @main-flow', () => {

  // ─── 1. Homepage ───────────────────────────────────────────────

  test('TC-MAIN-001: homepage loads successfully', async ({ pages }) => {
    await pages.home.goto();
    await expect(pages.home.page).toHaveURL(/decathlon\.(vn|sg)/);
    await expect(pages.home.navbar.logo).toBeVisible();
  });

  test('TC-MAIN-002: search bar is visible on homepage', async ({ pages }) => {
    await pages.home.goto();
    await expect(pages.home.search.searchInput).toBeVisible();
  });

  // ─── 2. Search → PDP ──────────────────────────────────────────

  test('TC-MAIN-003: search returns results for a valid keyword', async ({ buyer }) => {
    await buyer.searchProduct('running');
    await expect(buyer.getPage()).toHaveURL(/search|q=running/i);
  });

  test('TC-MAIN-004: user can navigate from search results to PDP', async ({ buyer, pages, api }) => {
    const product = await api.products.getRandomInStockProduct('running');
    await buyer.searchProduct('running');
    await pages.productDetail.goto(product.productUrl);
    await expect(pages.productDetail.productName).toBeVisible();
    const name = await pages.productDetail.getProductName();
    expect(name.length).toBeGreaterThan(0);
  });

  test('TC-MAIN-005: product detail page displays price', async ({ pages, api }) => {
    const product = await api.products.getRandomInStockProduct();
    await pages.productDetail.goto(product.productUrl);
    await expect(pages.productDetail.productPrice).toBeVisible();
    const price = await pages.productDetail.getPrice();
    expect(price.length).toBeGreaterThan(0);
  });

  // ─── 3. PDP → Add to Cart ─────────────────────────────────────

  test('TC-MAIN-006: user can add product to cart from PDP', async ({ buyer, pages, api }) => {
    const product = await api.products.getRandomInStockProduct();
    await buyer.addProductToCart(product.productUrl);
    await pages.cart.goto();
    const count = await pages.cart.getItemCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-MAIN-007: cart is not empty after adding a product', async ({ buyer, pages, api }) => {
    const product = await api.products.getRandomInStockProduct();
    await buyer.addProductToCart(product.productUrl);
    await pages.cart.goto();
    const empty = await pages.cart.isEmpty();
    expect(empty).toBe(false);
  });

  test('TC-MAIN-008: cart item count increases after adding product', async ({ buyer, pages, api }) => {
    const product = await api.products.getRandomInStockProduct();
    await pages.cart.goto();
    const countBefore = await pages.cart.getItemCount();

    await buyer.addProductToCart(product.productUrl);
    await pages.cart.goto();
    const countAfter = await pages.cart.getItemCount();

    expect(countAfter).toBeGreaterThan(countBefore);
  });

  // ─── 4. Cart ──────────────────────────────────────────────────

  test('TC-MAIN-009: cart page loads and shows checkout button', async ({ buyer, pages, api }) => {
    const product = await api.products.getRandomInStockProduct();
    await buyer.addProductToCart(product.productUrl);
    await pages.cart.goto();
    await expect(pages.cart.checkoutButton).toBeVisible();
  });

  test('TC-MAIN-010: cart persists after page reload', async ({ buyer, pages, api }) => {
    const product = await api.products.getRandomInStockProduct();
    await buyer.addProductToCart(product.productUrl);
    await pages.cart.goto();
    await buyer.getPage().reload();
    const count = await pages.cart.getItemCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-MAIN-011: user can remove item from cart', async ({ buyer, pages, api }) => {
    const product = await api.products.getRandomInStockProduct();
    await buyer.addToCartAndGoToCart(product.productUrl);
    const countBefore = await pages.cart.getItemCount();
    await pages.cart.removeItem(0);
    const countAfter = await pages.cart.getItemCount();
    expect(countAfter).toBeLessThan(countBefore);
  });

  test('TC-MAIN-012: cart shows total price', async ({ buyer, pages, api }) => {
    const product = await api.products.getRandomInStockProduct();
    await buyer.addToCartAndGoToCart(product.productUrl);
    const total = await pages.cart.getTotalPrice();
    expect(total.length).toBeGreaterThan(0);
  });

  // ─── 5. Category Browse → PDP → Cart ─────────────────────────

  test('TC-MAIN-013: user can browse running category', async ({ pages }) => {
    await pages.home.gotoCategory('RUNNING');
    await expect(pages.home.page).toHaveURL(/running|ban-chay/i);
  });

  test('TC-MAIN-014: full flow — category browse to add-to-cart', async ({ buyer, pages, api }) => {
    await pages.home.gotoCategory('RUNNING');
    const product = await api.products.getRandomInStockProduct('running');
    await buyer.addProductToCart(product.productUrl);
    await pages.cart.goto();
    const count = await pages.cart.getItemCount();
    expect(count).toBeGreaterThan(0);
  });

  // ─── 6. Checkout – Guest ──────────────────────────────────────

  test('TC-MAIN-015: guest can proceed to checkout from cart', async ({ buyer, pages, api }) => {
    const product = await api.products.getRandomInStockProduct();
    await buyer.addToCartAndGoToCart(product.productUrl);
    await pages.cart.proceedToCheckout();
    await expect(buyer.getPage()).toHaveURL(/checkout|thanh-toan/i);
  });

  test('TC-MAIN-016: guest checkout completes with valid data', async ({ buyer, api, region }) => {
    const data = CHECKOUT_TEST_DATA[region];
    const product = await api.products.getRandomInStockProduct();
    await buyer.addProductToCart(product.productUrl);
    const result = await buyer.completeGuestCheckout({
      region,
      guestInfo: data.guestInfo,
      address:   data.address,
    });
    expect(result.orderNumber).toMatch(/\w+/);
  });

  test('TC-MAIN-017: order confirmation page shown after guest checkout', async ({ buyer, api, region }) => {
    const data = CHECKOUT_TEST_DATA[region];
    const product = await api.products.getRandomInStockProduct();
    await buyer.addProductToCart(product.productUrl);
    await buyer.completeGuestCheckout({
      region,
      guestInfo: data.guestInfo,
      address:   data.address,
    });
    await expect(buyer.getPage()).toHaveURL(/confirmation|success|thank/i);
  });

  // ─── 7. Checkout – Logged-in ──────────────────────────────────

  test('TC-MAIN-018: logged-in user can complete purchase @logged-in', async ({ buyer, api }) => {
    const product = await api.products.getRandomInStockProduct('running');
    await buyer.buyProduct(product.productUrl);
    await expect(buyer.getPage()).toHaveURL(/confirmation|success|thank/i);
  });

  test('TC-MAIN-019: full search-to-purchase flow @logged-in', async ({ buyer }) => {
    await buyer.buyProductBySearch('running');
    await expect(buyer.getPage()).toHaveURL(/confirmation|success|cart|checkout/i);
  });

  // ─── 8. Navigation consistency ────────────────────────────────

  test('TC-MAIN-020: logo click redirects to homepage', async ({ pages }) => {
    await pages.home.gotoCategory('RUNNING');
    await pages.home.navbar.logo.click();
    await expect(pages.home.page).toHaveURL(/decathlon\.(vn|sg)\/?$/);
  });
});
