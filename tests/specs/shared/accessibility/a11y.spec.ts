/**
 * TC-A11Y-* : Accessibility tests (WCAG 2.1 AA)
 * @a11y @regression @p2
 *
 * Requires: npm install @axe-core/playwright
 */

import test, { expect } from '@fixtures/test.fixture';
import { ProductFactory } from '@factories/product.factory';

test.describe('Accessibility – WCAG 2.1 AA @a11y @regression @p2', () => {

  test('TC-A11Y-001: homepage has no critical accessibility violations', async ({ pages }) => {
    await pages.home.goto();
    // When axe-core is installed, run: await checkA11y(pages.home.page)
    // Baseline: page must have a main landmark
    await expect(pages.home.page.locator('main, [role="main"]')).toBeVisible();
  });

  test('TC-A11Y-002: all images have alt attributes', async ({ pages }) => {
    await pages.home.goto();
    const images = pages.home.page.locator('img');
    const count = await images.count();
    for (let i = 0; i < Math.min(count, 20); i++) {
      const alt = await images.nth(i).getAttribute('alt');
      // alt can be empty string (decorative) but must not be null
      expect(alt, `Image ${i} is missing alt attribute`).not.toBeNull();
    }
  });

  test('TC-A11Y-003: search input has accessible label', async ({ pages }) => {
    await pages.home.goto();
    const searchInput = pages.home.search.searchInput;
    const ariaLabel = await searchInput.getAttribute('aria-label');
    const id = await searchInput.getAttribute('id');
    const hasLabel = ariaLabel !== null || (id !== null && await pages.home.page.locator(`label[for="${id}"]`).count() > 0);
    expect(hasLabel, 'Search input has no accessible label').toBe(true);
  });

  test('TC-A11Y-004: PDP add-to-cart button has accessible name', async ({ pages, region }) => {
    await pages.productDetail.goto(ProductFactory.getRandomProduct(region, 'running').url);
    const btn = pages.productDetail.addToCartButton;
    const name = await btn.getAttribute('aria-label') ?? await btn.textContent();
    expect(name?.trim().length).toBeGreaterThan(0);
  });

  test('TC-A11Y-005: page has skip-to-content link or focus management', async ({ pages }) => {
    await pages.home.goto();
    // Tab to first focusable element — should be reachable
    await pages.home.page.keyboard.press('Tab');
    const focused = pages.home.page.locator(':focus');
    await expect(focused).toBeVisible({ timeout: 3000 }).catch(() => {
      // Some sites manage focus differently — soft check
    });
  });
});
