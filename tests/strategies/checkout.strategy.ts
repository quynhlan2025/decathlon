/**
 * CheckoutStrategy — Strategy Pattern interface
 * Each region implements its own address + payment logic.
 * Eliminates if/else region checks scattered across pages.
 *
 * Usage:
 *   const strategy = region === 'SG' ? new SGCheckoutStrategy() : new VNCheckoutStrategy();
 *   await strategy.fillAddress(checkoutPage, address);
 *   await strategy.selectPayment(checkoutPage);
 */

import type { CheckoutPage } from '@ui/pages/checkout.page';

export interface ShippingAddressInput {
  fullName: string;
  phone: string;
  email?: string;
  // VN-specific
  street?: string;
  province?: string;
  district?: string;
  ward?: string;
  // SG-specific
  postalCode?: string;
  unitNumber?: string;
  city?: string;
}

export interface CheckoutStrategy {
  /** Fill shipping address form fields */
  fillAddress(checkout: CheckoutPage, address: ShippingAddressInput): Promise<void>;
  /** Select default payment method for this region */
  selectDefaultPayment(checkout: CheckoutPage): Promise<void>;
  /** Available payment methods */
  getPaymentMethods(): string[];
  /** Currency pattern for price assertions */
  getCurrencyPattern(): RegExp;
  /** Region identifier */
  readonly region: 'VN' | 'SG';
}
