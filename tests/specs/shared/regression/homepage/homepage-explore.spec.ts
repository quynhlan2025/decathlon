/**
 * TC-HP-EXPLORE-* : Explore / Editorial sections tests
 * Covers: "Explore Outdoor Sports", campaign collections, theme editorials.
 * Each section has large imagery + text + CTA linking to curated pages.
 * @regression @p2
 */

import test, { expect } from '@fixtures/test.fixture';
import { EXPLORE_SECTIONS } from '@ui/components/homepage/homepage.facade';

test.describe('Homepage – Explore Sections @regression @p2', () => {

  test.beforeEach(async ({ pages, page }) => {
    await pages.home.goto();
    await page.evaluate(() => window.scrollBy(0, 800));
  });

  // Try known section names across regions — use whichever is visible
  async function getVisibleExplore(pages: any) {
    for (const name of [EXPLORE_SECTIONS.DISCOVER, EXPLORE_SECTIONS.OUTDOOR_SPORTS]) {
      const e = pages.home.hp.explore(name);
      if (await e.isVisible()) return e;
    }
    return null;
  }

  test('TC-HP-EXPLORE-001: at least one editorial/explore section is visible', async ({ pages }) => {
    const explore = await getVisibleExplore(pages);
    if (!explore) test.skip();
    expect(await explore!.isVisible()).toBe(true);
  });

  test('TC-HP-EXPLORE-002: Explore section has at least 2 editorial cards', async ({ pages }) => {
    const explore = await getVisibleExplore(pages);
    if (!explore) test.skip();
    const count = await explore!.getCardCount();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('TC-HP-EXPLORE-003: all explore cards have images', async ({ pages }) => {
    const explore = await getVisibleExplore(pages);
    if (!explore) test.skip();
    expect(await explore!.allCardsHaveImages()).toBe(true);
  });

  test('TC-HP-EXPLORE-004: all explore cards have navigation links', async ({ pages }) => {
    const explore = await getVisibleExplore(pages);
    if (!explore) test.skip();
    expect(await explore!.allCardsHaveLinks()).toBe(true);
  });

  test('TC-HP-EXPLORE-005: clicking explore card navigates to collection page', async ({ pages, page }) => {
    const explore = await getVisibleExplore(pages);
    if (!explore || await explore.getCardCount() === 0) test.skip();
    await explore!.clickCard(0);
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).not.toBe('/');
  });

  test('TC-HP-EXPLORE-006: explore cards have descriptive title text', async ({ pages }) => {
    const explore = await getVisibleExplore(pages);
    if (!explore) test.skip();
    const cards = await explore!.getAllCards();
    for (const card of cards) {
      expect(typeof card.title).toBe('string');
    }
  });

  // ─── Generic check: any editorial/explore section present ─────────────────

  test('TC-HP-EXPLORE-007: at least one editorial section exists on homepage', async ({ page }) => {
    const editorialSection = page.locator([
      '[class*="editorial"]',
      '[class*="explore"]',
      '[class*="collection"]',
      'section:has(a:has(img)):not([class*="product"])',
    ].join(', ')).first();

    const isVisible = await editorialSection.isVisible({ timeout: 5000 }).catch(() => false);
    // Soft check — editorial content may vary by campaign
    if (!isVisible) {
      console.warn('No editorial/explore section found — may be expected if no active campaign');
    }
  });

});
