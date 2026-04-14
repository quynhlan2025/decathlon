/**
 * CheckoutTask — Atomic action: fill checkout form and proceed to payment
 * Delegates address/payment logic to CheckoutStrategy (no if/else here).
 *
 * Usage:
 *   await CheckoutTask.for(page, region)
 *     .withInfo({ fullName, phone, email })
 *     .withAddress({ postalCode: '238888' })
 *     .execute();
 */

import { Page, test } from '@playwright/test';
import { CheckoutPage } from '@ui/pages/checkout.page';
import { getCheckoutStrategy, type ShippingAddressInput } from '@strategies/index';
import type { Region } from '@constants/urls';

export class CheckoutTask {
  private page: Page;
  private region: Region;
  private guestInfo: Partial<ShippingAddressInput> = {};
  private addressInfo: Partial<ShippingAddressInput> = {};

  private constructor(page: Page, region: Region) {
    this.page = page;
    this.region = region;
  }

  // ─── Builder ─────────────────────────────────────────────────

  static for(page: Page, region: Region): CheckoutTask {
    return new CheckoutTask(page, region);
  }

  withInfo(info: { fullName: string; phone: string; email?: string }): this {
    this.guestInfo = { ...this.guestInfo, ...info };
    return this;
  }

  withAddress(address: Partial<ShippingAddressInput>): this {
    this.addressInfo = { ...this.addressInfo, ...address };
    return this;
  }

  // ─── Execute ─────────────────────────────────────────────────

  async execute(): Promise<void> {
    return test.step(`CheckoutTask: fill shipping form for ${this.region}`, async () => {
      const checkout = new CheckoutPage(this.page, this.region);
      const strategy = getCheckoutStrategy(this.region);

      const fullAddress: ShippingAddressInput = {
        fullName: this.guestInfo.fullName ?? '',
        phone: this.guestInfo.phone ?? '',
        email: this.guestInfo.email,
        ...this.addressInfo,
      };

      await strategy.fillAddress(checkout, fullAddress);
      await checkout.acceptTerms();
      await checkout.continueToPayment();
      await strategy.selectDefaultPayment(checkout);
    });
  }
}
