/**
 * GuestCheckoutFlow — Business flow: cart → shipping → payment → confirmation
 * The complete guest purchase journey, orchestrated via Tasks + Strategy.
 * Tests simply call this flow — zero UI details in specs.
 *
 * Usage:
 *   const orderNumber = await GuestCheckoutFlow.run(page, { region: 'SG', address, guestInfo });
 */

import { Page, test } from '@playwright/test';
import { CartPage } from '@ui/pages/cart.page';
import { CheckoutPage } from '@ui/pages/checkout.page';
import { CheckoutTask } from '@tasks/checkout.task';
import { getCheckoutStrategy, type ShippingAddressInput } from '@strategies/index';
import type { Region } from '@constants/urls';

export interface GuestCheckoutOptions {
  region: Region;
  guestInfo: {
    fullName: string;
    phone: string;
    email?: string;
  };
  address: Partial<ShippingAddressInput>;
}

export interface CheckoutResult {
  orderNumber: string;
  region: Region;
}

export class GuestCheckoutFlow {
  static async run(page: Page, options: GuestCheckoutOptions): Promise<CheckoutResult> {
    return test.step('GuestCheckoutFlow: complete guest checkout', async () => {
      // Step 1: Go to cart and proceed
      const cart = new CartPage(page);
      await cart.goto();

      const itemCount = await cart.getItemCount();
      if (itemCount === 0) throw new Error('GuestCheckoutFlow: cart is empty');

      await cart.proceedToCheckout();

      // Step 2: Fill form via CheckoutTask (uses Strategy internally)
      await CheckoutTask.for(page, options.region)
        .withInfo(options.guestInfo)
        .withAddress(options.address)
        .execute();

      // Step 3: Place order
      const checkout = new CheckoutPage(page, options.region);
      await checkout.placeOrder();

      // Step 4: Get confirmation
      const orderNumber = await checkout.getOrderNumber().catch(() => 'N/A');
      return { orderNumber, region: options.region };
    });
  }

  /** Validate that strategy supports expected payment methods */
  static getAvailablePayments(region: Region): string[] {
    return getCheckoutStrategy(region).getPaymentMethods();
  }
}
