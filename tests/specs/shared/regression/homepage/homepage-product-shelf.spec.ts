/**
 * TC-HP-SHELF-* : Product Shelf section tests
 * Covers all named product shelves: Best Sellers, New Arrivals, On Sale, etc.
 * Each shelf follows the same pattern: Title + Product Cards + optional "View All"
 * @regression @p2
 */

import test, { expect } from '@fixtures/test.fixture';
import { SHELF_SECTIONS } from '@ui/components/homepage/homepage.facade';

// Shelves expected on Decathlon SG/VN — match productslistfloor-headline text
// Tests skip gracefully if a shelf is not visible (CMS-driven content)
const EXPECTED_SHELVES = [
  SHELF_SECTIONS.BEST_SELLERS,   // "Our Best Sellers" on SG
  SHELF_SECTIONS.NEW_ARRIVALS,
  SHELF_SECTIONS.ON_SALE,
] as const;

test.describe('Homepage – Product Shelves @regression @p2', () => {

  test.beforeEach(async ({ pages, page }) => {
    await pages.home.goto();
    // Scroll to trigger lazy loading
    await page.evaluate(() => window.scrollBy(0, 400));
  });

  // ─── Generic shelf tests (parameterized per section) ─────────────────────

  for (const shelfName of EXPECTED_SHELVES) {
    test(`TC-HP-SHELF: "${shelfName}" — at least 4 products`, async ({ pages }) => {
      const shelf = pages.home.hp.shelf(shelfName);
      if (!await shelf.isVisible()) test.skip();

      const count = await shelf.getProductCount();
      expect(count).toBeGreaterThanOrEqual(4);
    });

    test(`TC-HP-SHELF: "${shelfName}" — all products have images`, async ({ pages }) => {
      const shelf = pages.home.hp.shelf(shelfName);
      if (!await shelf.isVisible()) test.skip();

      expect(await shelf.allProductsHaveImages()).toBe(true);
    });

    test(`TC-HP-SHELF: "${shelfName}" — all products have prices`, async ({ pages }) => {
      const shelf = pages.home.hp.shelf(shelfName);
      if (!await shelf.isVisible()) test.skip();

      expect(await shelf.allProductsHavePrices()).toBe(true);
    });

    test(`TC-HP-SHELF: "${shelfName}" — all products have links`, async ({ pages }) => {
      const shelf = pages.home.hp.shelf(shelfName);
      if (!await shelf.isVisible()) test.skip();

      expect(await shelf.allProductsHaveLinks()).toBe(true);
    });
  }

  // ─── Specific shelf interaction tests ────────────────────────────────────

  test('TC-HP-SHELF-001: clicking product card navigates to PDP', async ({ pages, page }) => {
    for (const shelfName of EXPECTED_SHELVES) {
      const shelf = pages.home.hp.shelf(shelfName);
      if (await shelf.isVisible() && await shelf.getProductCount() > 0) {
        await shelf.clickProduct(0);
        await page.waitForLoadState('domcontentloaded');
        expect(page.url()).toMatch(/\/p\//);
        return;
      }
    }
    test.skip();
  });

  test('TC-HP-SHELF-002: "View All" link navigates to category/search page', async ({ pages, page }) => {
    for (const shelfName of EXPECTED_SHELVES) {
      const shelf = pages.home.hp.shelf(shelfName);
      if (await shelf.isVisible() && await shelf.hasViewAll()) {
        await shelf.clickViewAll();
        await page.waitForLoadState('domcontentloaded');
        expect(page.url()).not.toBe('/');
        return;
      }
    }
    test.skip();
  });

  test('TC-HP-SHELF-003: product cards display name, price, and image', async ({ pages }) => {
    for (const shelfName of EXPECTED_SHELVES) {
      const shelf = pages.home.hp.shelf(shelfName);
      if (!await shelf.isVisible()) continue;

      const count = await shelf.getProductCount();
      if (count === 0) continue;

      const product = await shelf.getProductData(0);
      expect(product.name).toBeTruthy();
      expect(product.price).toBeTruthy();
      expect(product.hasImage).toBe(true);
      return;
    }
    test.skip();
  });

  test('TC-HP-SHELF-004: carousel scroll next does not break shelf', async ({ pages }) => {
    for (const shelfName of EXPECTED_SHELVES) {
      const shelf = pages.home.hp.shelf(shelfName);
      if (!await shelf.isVisible()) continue;

      await shelf.scrollNext();
      const count = await shelf.getProductCount();
      expect(count).toBeGreaterThan(0);
      return;
    }
    test.skip();
  });

});
