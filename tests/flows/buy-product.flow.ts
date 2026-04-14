/**
 * BuyProductFlow — Business flow: search → select product → add to cart
 * Orchestrates Tasks. Tests call flows, not individual page methods.
 *
 * Usage:
 *   await BuyProductFlow.run(page, { keyword: 'yoga mat', region: 'SG' });
 */

import { Page, test } from '@playwright/test';
import { HomePage } from '@ui/pages/home.page';
import { PopupHandler } from '@utils/popup-handler';
import { SearchTask } from '@tasks/search.task';
import { AddToCartTask } from '@tasks/add-to-cart.task';
import type { Region } from '@constants/urls';

export interface BuyProductOptions {
  /** Search keyword OR direct product URL */
  keyword?: string;
  productUrl?: string;
  region: Region;
  sizeIndex?: number;
  /** Pick result index from search results (default: 0) */
  resultIndex?: number;
}

export class BuyProductFlow {
  static async run(page: Page, options: BuyProductOptions): Promise<void> {
    return test.step(`BuyProductFlow: buy "${options.keyword ?? options.productUrl}"`, async () => {
      const home = new HomePage(page, options.region);
      await home.goto();
      await PopupHandler.dismissAll(page, options.region);

      if (options.productUrl) {
        // Direct URL — skip search
        await AddToCartTask.perform(page, options.productUrl, options.sizeIndex ?? 1);
      } else if (options.keyword) {
        // Search → pick first result → add to cart
        await SearchTask.perform(page, options.keyword);
        await page.waitForLoadState('networkidle');

        const productCards = page.locator(
          "[data-testid='productHit-tilesbox-gridcell'], [data-testid='product-card']"
        );
        const count = await productCards.count();
        if (count === 0) throw new Error(`BuyProductFlow: no results for "${options.keyword}"`);

        const target = productCards.nth(options.resultIndex ?? 0);
        const productLink = target.getByRole('link').first();
        const href = await productLink.getAttribute('href');
        if (!href) throw new Error('BuyProductFlow: product card has no link');

        await AddToCartTask.perform(page, href, options.sizeIndex ?? 1);
      } else {
        throw new Error('BuyProductFlow: must provide keyword or productUrl');
      }
    });
  }
}
