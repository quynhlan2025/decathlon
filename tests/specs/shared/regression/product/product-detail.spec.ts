/**
 * TC-PDP-* : Product detail page tests
 * @regression @p1
 */

import test, { expect } from '@fixtures/test.fixture';
import { ProductFactory } from '@factories/product.factory';
import { ProductAssertions } from '@assertions/product.assertions';

test.describe('Regression – Product Detail Page @regression @p1', () => {

  test.beforeEach(async ({ pages, region }) => {
    await pages.productDetail.goto(ProductFactory.getRandomProduct(region, 'running').url);
  });

  test('TC-PDP-001: PDP loads with all key elements', async ({ pages }) => {
    await ProductAssertions.assertPDPLoaded(pages.productDetail);
  });

  test('TC-PDP-002: price is displayed in correct format', async ({ pages, buyer }) => {
    await ProductAssertions.assertPriceFormat(pages.productDetail, buyer.getRegion());
  });

  test('TC-PDP-003: product images are present', async ({ pages }) => {
    await ProductAssertions.assertImagesPresent(pages.productDetail);
  });

  test('TC-PDP-004: size selector is available', async ({ pages }) => {
    await expect(pages.productDetail.sizeSelector.first()).toBeVisible();
  });

  test('TC-PDP-005: add-to-cart is enabled after selecting size', async ({ pages }) => {
    await pages.productDetail.sizeSelector.first().click();
    await ProductAssertions.assertAddToCartEnabled(pages.productDetail);
  });
});
