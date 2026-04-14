/**
 * Strategy factory — returns the right strategy for a region
 */

import type { Region } from '@constants/urls';
import type { CheckoutStrategy } from './checkout.strategy';
import { SGCheckoutStrategy } from './sg.strategy';
import { VNCheckoutStrategy } from './vn.strategy';

export { SGCheckoutStrategy } from './sg.strategy';
export { VNCheckoutStrategy } from './vn.strategy';
export type { CheckoutStrategy, ShippingAddressInput } from './checkout.strategy';

export function getCheckoutStrategy(region: Region): CheckoutStrategy {
  return region === 'SG' ? new SGCheckoutStrategy() : new VNCheckoutStrategy();
}
