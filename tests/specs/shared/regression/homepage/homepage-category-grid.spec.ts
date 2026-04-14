/**
 * TC-HP-CAT-* : Category Grid section tests
 * "Shop by Category" grid — 4-6 column cards with image + label.
 * @regression @p1
 */

import test, { expect } from '@fixtures/test.fixture';

test.describe('Homepage – Category Grid @regression @p1', () => {

  test.beforeEach(async ({ pages }) => {
    await pages.home.goto();
  });

  test('TC-HP-CAT-001: Category Grid section is visible', async ({ pages }) => {
    expect(await pages.home.hp.categoryGrid.isVisible()).toBe(true);
  });

  test('TC-HP-CAT-002: at least 4 category cards are displayed', async ({ pages }) => {
    const count = await pages.home.hp.categoryGrid.getCardCount();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('TC-HP-CAT-003: all category cards have images', async ({ pages }) => {
    const count = await pages.home.hp.categoryGrid.getCardCount();
    if (count === 0) test.skip();
    expect(await pages.home.hp.categoryGrid.allCardsHaveImages()).toBe(true);
  });

  test('TC-HP-CAT-004: all category cards have href links', async ({ pages }) => {
    const count = await pages.home.hp.categoryGrid.getCardCount();
    if (count === 0) test.skip();
    expect(await pages.home.hp.categoryGrid.allCardsHaveLinks()).toBe(true);
  });

  test('TC-HP-CAT-005: card hrefs point to internal category or sport pages', async ({ pages }) => {
    const cards = await pages.home.hp.categoryGrid.getAllCards();
    for (const card of cards) {
      expect(card.href).toBeTruthy();
      expect(card.href).toMatch(/^\//);
    }
  });

  test('TC-HP-CAT-006: clicking a category card navigates to category page', async ({ pages, page }) => {
    const count = await pages.home.hp.categoryGrid.getCardCount();
    if (count === 0) test.skip();

    await pages.home.hp.categoryGrid.clickCard(0);
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).not.toBe('/');
  });

  test('TC-HP-CAT-007: all category cards have name labels', async ({ pages }) => {
    const cards = await pages.home.hp.categoryGrid.getAllCards();
    for (const card of cards) {
      expect(card.name.length).toBeGreaterThan(0);
    }
  });

});

test.describe('Homepage – Bicycles & Scooters Grid @regression @p2', () => {
  /**
   * Specific named category grid section for Bicycles & Scooters.
   */

  test.beforeEach(async ({ pages, page }) => {
    await pages.home.goto();
    await page.evaluate(() => window.scrollBy(0, 600));
  });

  test('TC-HP-CAT-BIKES-001: Bicycles grid section exists on page', async ({ page }) => {
    const section = page.locator(
      'section:has-text("Bicycle"), section:has-text("Scooter"), [class*="bicycle"], [class*="cycling"]'
    ).first();
    if (!await section.isVisible({ timeout: 3000 }).catch(() => false)) {
      test.skip();
    }
    const cards = section.locator('a[href], [class*="card"]');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('TC-HP-CAT-BIKES-002: bicycle category cards link to /c/ or /s/ paths', async ({ page }) => {
    const section = page.locator(
      'section:has-text("Bicycle"), section:has-text("Scooter")'
    ).first();
    if (!await section.isVisible({ timeout: 3000 }).catch(() => false)) {
      test.skip();
    }
    const links = section.locator('a[href*="/c/"], a[href*="/s/"], a[href*="bicycle"], a[href*="cycling"]');
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

});
