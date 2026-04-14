/**
 * Checkout Test Data - Data-driven
 * Hỗ trợ VN & SG: guest info, address
 * Product URL: lấy từ ProductFactory.getRandomProduct(region).url
 * Payment method: xử lý bởi CheckoutStrategy (SGCheckoutStrategy / VNCheckoutStrategy)
 */

import type { GuestInfo, CheckoutAddress } from '@ui/pages/checkout.page';
import type { Region } from '@constants/urls';

export interface CheckoutTestData {
  region: Region;
  guestInfo: GuestInfo;
  address: CheckoutAddress;
}

export const CHECKOUT_TEST_DATA: Record<Region, CheckoutTestData> = {
  VN: {
    region: 'VN',
    guestInfo: {
      fullName: 'Nguyen Van Test',
      phone: '0901234567',
      email: 'test.vn@decathlon.test',
      address: '123 Nguyen Hue, Quan 1',
    },
    address: {
      province: 'Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Phường Bến Nghé',
    },
  },
  SG: {
    region: 'SG',
    guestInfo: {
      fullName: 'John Tan Test',
      phone: '91234567',
      email: 'test.sg@decathlon.test',
    },
    address: {
      postalCode: '238888',
      city: 'Singapore',
    },
  },
};

export const INVALID_CHECKOUT_DATA = {
  invalidPhone: { VN: '123', SG: 'abc' },
  invalidEmail: 'notanemail',
  invalidPostalCode: 'ABCDEF',
  emptyForm: { fullName: '', phone: '', email: '' },
};

// Convenience aliases
export const GUEST_USERS = { standard: CHECKOUT_TEST_DATA.SG.guestInfo, vn: CHECKOUT_TEST_DATA.VN.guestInfo } as const;
