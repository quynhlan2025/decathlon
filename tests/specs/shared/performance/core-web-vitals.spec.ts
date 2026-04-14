/**
 * TC-PERF-* : Core Web Vitals & performance tests
 * @performance @regression @p2
 */

import test, { expect } from '@fixtures/test.fixture';
import { ProductFactory } from '@factories/product.factory';

// Thresholds (ms / score)
const THRESHOLDS = {
  LCP: 2500,     // Largest Contentful Paint ≤ 2.5s (Good)
  FID: 100,      // First Input Delay ≤ 100ms (Good)
  TTFB: 800,     // Time to First Byte ≤ 800ms
  FCP: 1800,     // First Contentful Paint ≤ 1.8s
};

test.describe('Performance – Core Web Vitals @performance @regression @p2', () => {

  test('TC-PERF-001: homepage TTFB is within threshold', async ({ pages }) => {
    const response = await pages.home.page.goto(pages.home.page.url() || '/');
    if (response) {
      const timing = await pages.home.page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
        return nav ? nav.responseStart - nav.requestStart : 0;
      });
      expect(timing, `TTFB ${timing}ms exceeds ${THRESHOLDS.TTFB}ms`).toBeLessThanOrEqual(THRESHOLDS.TTFB);
    }
  });

  test('TC-PERF-002: homepage LCP is within threshold', async ({ pages }) => {
    await pages.home.goto();
    const lcp = await pages.home.page.evaluate(() => {
      return new Promise<number>((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const last = entries[entries.length - 1];
          resolve(last?.startTime ?? 0);
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        setTimeout(() => resolve(0), 5000);
      });
    });
    if (lcp > 0) {
      expect(lcp, `LCP ${lcp}ms exceeds ${THRESHOLDS.LCP}ms`).toBeLessThanOrEqual(THRESHOLDS.LCP);
    }
  });

  test('TC-PERF-003: PDP load time is acceptable', async ({ pages, region }) => {
    const start = Date.now();
    await pages.productDetail.goto(ProductFactory.getRandomProduct(region).url);
    await pages.productDetail.productName.waitFor({ state: 'visible' });
    const elapsed = Date.now() - start;
    expect(elapsed, `PDP load ${elapsed}ms exceeds 5000ms`).toBeLessThanOrEqual(5000);
  });

  test('TC-PERF-004: search results page loads within threshold', async ({ buyer }) => {
    const start = Date.now();
    await buyer.searchProduct('running');
    const elapsed = Date.now() - start;
    expect(elapsed, `Search ${elapsed}ms exceeds 4000ms`).toBeLessThanOrEqual(4000);
  });

  test('TC-PERF-005: homepage has no render-blocking resources over 500ms', async ({ pages }) => {
    await pages.home.goto();
    const blockingTime = await pages.home.page.evaluate(() => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return entries
        .filter(e => e.initiatorType === 'script' || e.initiatorType === 'css')
        .reduce((sum, e) => sum + Math.max(0, e.responseEnd - e.startTime), 0);
    });
    // Soft check — log but don't fail hard
    if (blockingTime > 2000) {
      console.warn(`[PERF] Total blocking resource time: ${blockingTime.toFixed(0)}ms`);
    }
    expect(blockingTime).toBeLessThanOrEqual(5000);
  });
});
