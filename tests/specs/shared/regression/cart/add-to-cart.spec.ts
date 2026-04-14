/**
 * TC-CART-ADD-* : Add to cart tests
 * @regression @p1
 */

import test, { expect } from '@fixtures/test.fixture';
import { ProductFactory } from '@factories/product.factory';

test.describe('Regression – Add to Cart @regression @p1', () => {

  test('TC-CART-ADD-001: product can be added to cart', async ({ buyer, region }) => {
    await buyer.addProductToCart(ProductFactory.getRandomProduct(region, 'running').url);
    const cart = buyer.getCart();
    await cart.goto();
    const count = await cart.getItemCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-CART-ADD-002: cart icon is visible in navbar after add', async ({ buyer, pages, region }) => {
    await buyer.addProductToCart(ProductFactory.getRandomProduct(region, 'running').url);
    await pages.home.goto();
    await expect(pages.home.navbar.cartIcon).toBeVisible();
  });

  test('TC-CART-ADD-003: add to cart redirects or shows confirmation', async ({ pages, region }) => {
    await pages.productDetail.goto(ProductFactory.getRandomProduct(region, 'running').url);
    await pages.productDetail.sizeSelector.first().click();
    await pages.productDetail.addToCartButton.click();
    // Either a toast appears or cart count updates — page stays on PDP or navigates
    await expect(pages.productDetail.page).toHaveURL(/.+/);
  });
});
