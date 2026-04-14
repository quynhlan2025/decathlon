/**
 * SGCheckoutStrategy — Singapore-specific checkout behaviour
 * Payment: Credit Card, PayNow
 * Address: Postal code + street + unit number
 */

import type { CheckoutPage } from '@ui/pages/checkout.page';
import type { CheckoutStrategy, ShippingAddressInput } from './checkout.strategy';

export class SGCheckoutStrategy implements CheckoutStrategy {
  readonly region = 'SG' as const;

  async fillAddress(checkout: CheckoutPage, address: ShippingAddressInput): Promise<void> {
    await checkout.sendText(checkout.fullNameInput, address.fullName);
    await checkout.sendText(checkout.phoneInput, address.phone);
    if (address.email) await checkout.sendText(checkout.emailInput, address.email);
    await checkout.fillSGAddress(address.postalCode ?? '', address.city ?? 'Singapore');
  }

  async selectDefaultPayment(checkout: CheckoutPage): Promise<void> {
    await checkout.selectCreditCard();
  }

  getPaymentMethods(): string[] {
    return ['CREDIT_CARD', 'PAYNOW', 'GRABPAY'];
  }

  getCurrencyPattern(): RegExp {
    return /\$\s?\d+(\.\d{2})?|SGD\s?\d+/;
  }
}
