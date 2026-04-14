/**
 * Auth Test Data - Login credentials and expected states
 */

import type { Region } from '@constants/urls';

export interface AuthCredentials {
  email: string;
  password: string;
}

export const VALID_ACCOUNTS: Record<Region, AuthCredentials> = {
  VN: {
    email: 'buyer.vn@decathlon.test',
    password: 'Buyer@123',
  },
  SG: {
    email: 'buyer.sg@decathlon.test',
    password: 'Buyer@123',
  },
};

export const INVALID_CREDENTIALS = {
  wrongPassword: { email: 'buyer.sg@decathlon.test', password: 'wrongpassword123' },
  nonExistentEmail: { email: 'notregistered@nowhere.test', password: 'anypassword' },
  emptyBoth: { email: '', password: '' },
  invalidEmailFormat: { email: 'notanemail', password: 'somepassword' },
} as const;

// Convenience aliases
export const TEST_ACCOUNTS = VALID_ACCOUNTS;
