/**
 * CartAssertions — Custom assertions for cart and checkout
 */

import { expect } from '@playwright/test';
import type { CartPage } from '@ui/pages/cart.page';
import type { CheckoutPage } from '@ui/pages/checkout.page';
import type { Region } from '@constants/urls';

export class CartAssertions {

  static async assertCartNotEmpty(cart: CartPage): Promise<void> {
    const count = await cart.getItemCount();
    expect(count, 'Cart should have at least 1 item').toBeGreaterThan(0);
  }

  static async assertCartEmpty(cart: CartPage): Promise<void> {
    expect(await cart.isEmpty()).toBe(true);
  }

  static async assertItemCount(cart: CartPage, expected: number): Promise<void> {
    const count = await cart.getItemCount();
    expect(count).toBe(expected);
  }

  static async assertTotalFormat(cart: CartPage, region: Region): Promise<void> {
    const total = await cart.getTotalPrice();
    if (region === 'VN') {
      expect(total).toMatch(/\d/);
    } else {
      expect(total).toMatch(/\$|SGD|\d/);
    }
  }

  static async assertCheckoutFormPresent(checkout: CheckoutPage): Promise<void> {
    await expect(checkout.fullNameInput).toBeVisible();
    await expect(checkout.phoneInput).toBeVisible();
    await expect(checkout.emailInput).toBeVisible();
  }

  static async assertOrderSummaryHasItems(checkout: CheckoutPage, minItems = 1): Promise<void> {
    const summary = await checkout.getOrderSummary();
    expect(summary.itemCount).toBeGreaterThanOrEqual(minItems);
  }

  static async assertPaymentMethodsVisible(checkout: CheckoutPage): Promise<void> {
    expect(await checkout.isPaymentSectionVisible()).toBe(true);
  }
}
