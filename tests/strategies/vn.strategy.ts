/**
 * VNCheckoutStrategy — Vietnam-specific checkout behaviour
 * Payment: COD, VNPay, MoMo
 * Address: Province → District → Ward cascade
 */

import type { CheckoutPage } from '@ui/pages/checkout.page';
import type { CheckoutStrategy, ShippingAddressInput } from './checkout.strategy';

export class VNCheckoutStrategy implements CheckoutStrategy {
  readonly region = 'VN' as const;

  async fillAddress(checkout: CheckoutPage, address: ShippingAddressInput): Promise<void> {
    await checkout.sendText(checkout.fullNameInput, address.fullName);
    await checkout.sendText(checkout.phoneInput, address.phone);
    if (address.email) await checkout.sendText(checkout.emailInput, address.email);
    if (address.street) await checkout.sendText(checkout.addressInput, address.street);
    await checkout.fillVNAddress(
      address.province ?? '',
      address.district ?? '',
      address.ward ?? ''
    );
  }

  async selectDefaultPayment(checkout: CheckoutPage): Promise<void> {
    await checkout.selectCOD();
  }

  getPaymentMethods(): string[] {
    return ['COD', 'VNPAY', 'MOMO', 'CREDIT_CARD'];
  }

  getCurrencyPattern(): RegExp {
    return /\d[\d,.]*\s*(đ|VND|vnđ)?/i;
  }
}
