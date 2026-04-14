/**
 * HeroBannerComponent — Homepage hero section
 *
 * DOM (SG/VN): react-responsive-carousel
 *   .carousel.carousel-slider
 *     [data-testid="smallbanner-wrapper"]     ← each slide
 *       [data-testid="smallbanner-anchor"]    ← clickable link
 *       [data-testid="smallbanner-image-box"] ← image wrapper
 *         img
 */

import { Page, Locator } from '@playwright/test';

export class HeroBannerComponent {
  readonly page: Page;

  readonly heroBanner: Locator;   // carousel wrapper
  readonly heroCTA: Locator;      // first slide CTA link
  readonly heroImage: Locator;    // first slide image
  readonly slides: Locator;       // all slide wrappers
  readonly prevButton: Locator;
  readonly nextButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heroBanner  = page.locator('.carousel.carousel-slider').first();
    this.heroCTA     = this.heroBanner.locator('[data-testid="smallbanner-anchor"]').first();
    this.heroImage   = this.heroBanner.locator('[data-testid="smallbanner-image-box"] img').first();
    this.slides      = this.heroBanner.locator('[data-testid="smallbanner-wrapper"]');
    this.prevButton  = page.locator('[data-testid="carousel-left-arrow-btn"]').first();
    this.nextButton  = page.locator('[data-testid="carousel-right-arrow-btn"]').first();
  }

  async isVisible(): Promise<boolean> {
    return this.heroBanner.isVisible().catch(() => false);
  }

  async getHeroImageSrc(): Promise<string | null> {
    return this.heroImage.getAttribute('src').catch(() => null);
  }

  async clickHeroCTA(): Promise<void> {
    await this.heroCTA.click();
  }

  async getSlideCount(): Promise<number> {
    return this.slides.count();
  }

  async clickNextSlide(): Promise<void> {
    if (await this.nextButton.isVisible().catch(() => false)) {
      await this.nextButton.click();
    }
  }

  async allBannersHaveImages(): Promise<boolean> {
    const count = await this.slides.count();
    if (count === 0) return false;
    // Check only the first 3 slides (others may be lazy-loaded off-screen)
    const limit = Math.min(count, 3);
    for (let i = 0; i < limit; i++) {
      const img = this.slides.nth(i).locator('[data-testid="smallbanner-image-box"] img').first();
      const src = await img.getAttribute('src').catch(() => null);
      if (!src) return false;
    }
    return true;
  }
}
