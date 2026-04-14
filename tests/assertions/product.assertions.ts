/**
 * ProductAssertions — Custom domain assertions for product pages
 * Encapsulates complex or repeated expect chains
 */

import { expect } from '@playwright/test';
import type { ProductDetailPage } from '@ui/pages/product-detail.page';
import type { ProductGridComponent } from '@ui/components/product-card.component';
import type { Region } from '@constants/urls';

export class ProductAssertions {

  // ─── PDP ────────────────────────────────────────────────────

  static async assertPDPLoaded(pdp: ProductDetailPage): Promise<void> {
    await expect(pdp.productName).toBeVisible();
    await expect(pdp.productPrice).toBeVisible();
    await expect(pdp.addToCartButton).toBeVisible();

    const name = await pdp.getProductName();
    expect(name.trim().length).toBeGreaterThan(0);

    const price = await pdp.getPrice();
    expect(price.trim().length).toBeGreaterThan(0);
  }

  static async assertPriceFormat(pdp: ProductDetailPage, region: Region): Promise<void> {
    const price = await pdp.getPrice();
    if (region === 'VN') {
      expect(price).toMatch(/\d/);
    } else {
      expect(price).toMatch(/\$|SGD|\d/);
    }
  }

  static async assertImagesPresent(pdp: ProductDetailPage, minCount = 1): Promise<void> {
    const count = await pdp.productImages.count();
    expect(count).toBeGreaterThanOrEqual(minCount);
  }

  static async assertAddToCartEnabled(pdp: ProductDetailPage): Promise<void> {
    expect(await pdp.isAddToCartEnabled()).toBe(true);
  }

  // ─── PLP / Grid ─────────────────────────────────────────────

  static async assertGridNotEmpty(grid: ProductGridComponent, minProducts = 1): Promise<void> {
    const count = await grid.getCount();
    expect(count, `Expected at least ${minProducts} products in grid`).toBeGreaterThanOrEqual(
      minProducts
    );
  }

  static async assertAllCardsHaveNames(grid: ProductGridComponent): Promise<void> {
    const count = await grid.getCount();
    for (let i = 0; i < Math.min(count, 6); i++) {
      const name = await grid.getCard(i).getName();
      expect(name.trim().length, `Card ${i} has empty name`).toBeGreaterThan(0);
    }
  }

  static async assertAllCardsHavePrices(grid: ProductGridComponent): Promise<void> {
    const count = await grid.getCount();
    for (let i = 0; i < Math.min(count, 6); i++) {
      const price = await grid.getCard(i).getPrice();
      expect(price.trim().length, `Card ${i} has empty price`).toBeGreaterThan(0);
    }
  }

  static async assertNoCardsWithEmptyImages(grid: ProductGridComponent): Promise<void> {
    const count = await grid.getCount();
    for (let i = 0; i < Math.min(count, 6); i++) {
      const card = grid.getCard(i);
      const src = await card.image.getAttribute('src');
      expect(src, `Card ${i} has no image src`).not.toBeNull();
      expect(src!.length, `Card ${i} has empty image src`).toBeGreaterThan(0);
    }
  }
}
