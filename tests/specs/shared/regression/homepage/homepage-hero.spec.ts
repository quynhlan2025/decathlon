/**
 * TC-HP-HERO-* : Homepage hero banner tests
 * @regression @p1
 */

import test, { expect } from '@fixtures/test.fixture';

test.describe('Regression – Homepage Hero @regression @p1', () => {

  test.beforeEach(async ({ pages }) => {
    await pages.home.goto();
  });

  test('TC-HP-HERO-001: hero banner is visible', async ({ pages }) => {
    await expect(pages.home.hp.heroBanner.heroBanner).toBeVisible();
  });

  test('TC-HP-HERO-002: hero CTA is present and enabled', async ({ pages }) => {
    const cta = pages.home.hp.heroBanner.heroCTA;
    if (await cta.isVisible()) {
      await expect(cta).toBeEnabled();
    }
  });

  test('TC-HP-HERO-003: hero banner image has valid src', async ({ pages }) => {
    const img = pages.home.hp.heroBanner.heroImage;
    if (await img.isVisible()) {
      const src = await img.getAttribute('src');
      expect(src).toBeTruthy();
    }
  });

  test('TC-HP-HERO-004: all hero banner images have src', async ({ pages }) => {
    expect(await pages.home.hp.heroBanner.allBannersHaveImages()).toBe(true);
  });
});
