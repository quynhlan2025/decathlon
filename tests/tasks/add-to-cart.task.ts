/**
 * AddToCartTask — Atomic action: navigate to PDP and add product to cart
 * Reusable by any actor or flow that needs to put items in cart.
 *
 * Usage:
 *   await AddToCartTask.for(page).product(url).withSize(1).execute();
 *   await AddToCartTask.perform(page, url);
 */

import { Page, test } from '@playwright/test';
import { ProductDetailPage } from '@ui/pages/product-detail.page';

export class AddToCartTask {
  private page: Page;
  private productUrl = '';
  private sizeIndex = 1;
  private sizeLabel?: string;

  private constructor(page: Page) {
    this.page = page;
  }

  // ─── Builder ─────────────────────────────────────────────────

  static for(page: Page): AddToCartTask {
    return new AddToCartTask(page);
  }

  product(url: string): this {
    this.productUrl = url;
    return this;
  }

  withSize(index: number): this {
    this.sizeIndex = index;
    return this;
  }

  withSizeLabel(label: string): this {
    this.sizeLabel = label;
    return this;
  }

  // ─── Execute ─────────────────────────────────────────────────

  async execute(): Promise<void> {
    if (!this.productUrl) throw new Error('AddToCartTask: product URL not set');

    return test.step(`AddToCartTask: add "${this.productUrl}" to cart`, async () => {
      const pdp = new ProductDetailPage(this.page);
      await pdp.goto(this.productUrl);

      if (await pdp.sizeDropdown.isVisible()) {
        this.sizeLabel
          ? await pdp.selectSize(this.sizeLabel)
          : await pdp.selectSizeByIndex(this.sizeIndex);
      }

      await pdp.addToCart();
      await this.page.waitForLoadState('networkidle');
    });
  }

  // ─── Static shortcut ─────────────────────────────────────────

  static async perform(page: Page, productUrl: string, sizeIndex = 1): Promise<void> {
    await AddToCartTask.for(page).product(productUrl).withSize(sizeIndex).execute();
  }
}
