/**
 * Custom Playwright Matchers
 * Extends expect() with domain-specific assertions.
 *
 * Usage:
 *   import './tests/utils/custom-matchers';
 *   await expect(price).toBeValidPrice('SG');
 *   await expect(url).toBeDecathlonUrl('SG');
 */

import { expect } from '@playwright/test';
import type { Region } from '@constants/urls';

// ─── Price matcher ────────────────────────────────────────────

expect.extend({
  toBeValidPrice(received: string, region: Region) {
    const pattern = region === 'VN' ? /\d+/ : /\$\s?\d+(\.\d{2})?|SGD\s?\d+/;
    const pass = pattern.test(received);
    return {
      pass,
      message: () =>
        pass
          ? `Expected "${received}" NOT to be a valid ${region} price`
          : `Expected "${received}" to be a valid ${region} price (pattern: ${pattern})`,
    };
  },
});

expect.extend({
  toBeDecathlonUrl(received: string, region: Region) {
    const domain = region === 'VN' ? 'decathlon.vn' : 'decathlon.sg';
    const pass = received.includes(domain);
    return {
      pass,
      message: () =>
        pass
          ? `Expected URL not to contain "${domain}"`
          : `Expected URL "${received}" to contain "${domain}"`,
    };
  },
});

expect.extend({
  toHaveMinLength(received: string, min: number) {
    const pass = received.trim().length >= min;
    return {
      pass,
      message: () =>
        pass
          ? `Expected string length to be less than ${min}`
          : `Expected string "${received}" to have at least ${min} characters`,
    };
  },
});

// Augment TypeScript types
declare module '@playwright/test' {
  interface Matchers<R> {
    toBeValidPrice(region: Region): R;
    toBeDecathlonUrl(region: Region): R;
    toHaveMinLength(min: number): R;
  }
}
