/**
 * BuyerActor — Who: the customer
 * Delegates atomic actions to Tasks, multi-step journeys to Flows.
 * No UI selectors here — actors are pure orchestration.
 */

import { test } from '@playwright/test';
import { Page } from '@playwright/test';
import { Actor } from './actor';
import { AddToCartTask } from '@tasks/add-to-cart.task';
import { SearchTask } from '@tasks/search.task';
import { LoginTask } from '@tasks/login.task';
import { BuyProductFlow } from '@flows/buy-product.flow';
import { GuestCheckoutFlow, type GuestCheckoutOptions, type CheckoutResult } from '@flows/guest-checkout.flow';
import { CartPage } from '@ui/pages/cart.page';
import { ProductDetailPage } from '@ui/pages/product-detail.page';
import { getCheckoutStrategy } from '@strategies/index';
import type { Region } from '@constants/urls';

export class BuyerActor extends Actor {
  constructor(page: Page, region: Region) {
    super(page, region);
  }

  // ─── Homepage ─────────────────────────────────────────────────

  async goToHomePage() {
    return test.step('BuyerActor: open homepage', async () => {
      await this.homePage.goto();
      return this.homePage;
    });
  }

  // ─── Search — delegates to SearchTask ────────────────��────────

  async searchProduct(keyword: string): Promise<void> {
    await this.homePage.goto();
    await SearchTask.perform(this.page, keyword);
  }

  // ─── Product — delegates to AddToCartTask ───────────────���─────

  async goToProduct(productUrl: string): Promise<ProductDetailPage> {
    return test.step('BuyerActor: navigate to product', async () => {
      const pdp = new ProductDetailPage(this.page);
      await pdp.goto(productUrl);
      return pdp;
    });
  }

  async addProductToCart(productUrl: string, sizeIndex = 1): Promise<void> {
    await AddToCartTask.perform(this.page, productUrl, sizeIndex);
  }

  // ─── Cart ─────────────────────────────────────────────────────

  getCart(): CartPage {
    return new CartPage(this.page);
  }

  async addToCartAndGoToCart(productUrl: string, sizeIndex = 1): Promise<CartPage> {
    await this.addProductToCart(productUrl, sizeIndex);
    const cart = this.getCart();
    await cart.goto();
    return cart;
  }

  // ─── Login — delegates to LoginTask ───────────────────────────

  async login(email: string, password: string): Promise<void> {
    await LoginTask.perform(this.page, { email, password });
  }

  // ─── Flows — delegates to Flow classes ───────────────────────

  async buyProduct(productUrl: string, sizeIndex = 1): Promise<void> {
    await BuyProductFlow.run(this.page, {
      productUrl,
      region: this.region,
      sizeIndex,
    });
  }

  async buyProductBySearch(keyword: string): Promise<void> {
    await BuyProductFlow.run(this.page, { keyword, region: this.region });
  }

  async completeGuestCheckout(options: GuestCheckoutOptions): Promise<CheckoutResult> {
    return GuestCheckoutFlow.run(this.page, options);
  }

  // ─── Strategy helpers ─────────────────────────────────────────

  getCurrencyPattern(): RegExp {
    return getCheckoutStrategy(this.region).getCurrencyPattern();
  }

  getAvailablePayments(): string[] {
    return getCheckoutStrategy(this.region).getPaymentMethods();
  }
}
