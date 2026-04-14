/**
 * TC-VISUAL-HP-* : Homepage visual regression tests
 * @visual @regression @p2
 */

import test, { expect } from '@fixtures/test.fixture';

test.describe('Visual – Homepage @visual @regression @p2', () => {

  test('TC-VISUAL-HP-001: homepage hero matches snapshot', async ({ pages }) => {
    await pages.home.goto();
    await expect(pages.home.hp.heroBanner.heroBanner).toHaveScreenshot('homepage-hero.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('TC-VISUAL-HP-002: homepage full page matches snapshot', async ({ pages }) => {
    await pages.home.goto();
    await expect(pages.home.page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.03,
    });
  });
});
