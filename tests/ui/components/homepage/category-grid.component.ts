/**
 * CategoryGridComponent — Homepage category/sport quick-links grid
 *
 * DOM (SG/VN):
 *   [data-testid="smallbanner-floorheading"]  ← optional section heading
 *   [data-testid="smallbanner-wrapper"]        ← each card (24 on SG)
 *     [data-testid="smallbanner-anchor"]       ← clickable link (href to /c/ or /s/)
 *     [data-testid="smallbanner-image-box"]    ← image wrapper
 *       img
 *
 * Fallback: imgTextLinksFour-container  (deals/promo cards, 14 items)
 */

import { Page, Locator } from '@playwright/test';

export interface CategoryCard {
  name: string;
  href: string | null;
  hasImage: boolean;
}

export class CategoryGridComponent {
  readonly page: Page;
  readonly cards: Locator;    // each smallbanner-wrapper (or imgTextLinkFour)
  readonly cardLinks: Locator;
  readonly cardImages: Locator;

  constructor(page: Page) {
    this.page = page;

    // Primary: smallbanner category links; fallback: imgTextLinksFour promo cards
    this.cards = page.locator('[data-testid="smallbanner-wrapper"], [data-testid="imgTextLinkFour-container"]');
    this.cardLinks  = page.locator('[data-testid="smallbanner-anchor"], [data-testid="imgTextLinkFour-anchorTag"]');
    this.cardImages = page.locator('[data-testid="smallbanner-image-box"] img, [data-testid="imageTextLink4-image"]');
  }

  async isVisible(): Promise<boolean> {
    return (await this.cards.count()) > 0;
  }

  async getCardCount(): Promise<number> {
    return this.cards.count();
  }

  async getCardData(index: number): Promise<CategoryCard> {
    const card  = this.cards.nth(index);
    const link  = card.locator('a').first();
    const img   = card.locator('img').first();
    const label = card.locator('[data-testid*="text"], [data-testid*="headline"], span, p').first();

    return {
      name:     (await label.textContent().catch(() => ''))?.trim() ?? '',
      href:     await link.getAttribute('href').catch(() => null),
      hasImage: await img.isVisible().catch(() => false),
    };
  }

  async getAllCards(): Promise<CategoryCard[]> {
    const count = await this.getCardCount();
    return Promise.all(Array.from({ length: count }, (_, i) => this.getCardData(i)));
  }

  async clickCard(index: number): Promise<void> {
    await this.cards.nth(index).locator('a').first().click();
  }

  async clickCardByName(name: string): Promise<void> {
    await this.cards.filter({ hasText: new RegExp(name, 'i') }).first().locator('a').first().click();
  }

  async allCardsHaveImages(): Promise<boolean> {
    const count = await this.getCardCount();
    if (count === 0) return false;
    for (let i = 0; i < count; i++) {
      const card = await this.getCardData(i);
      if (!card.hasImage) return false;
    }
    return true;
  }

  async allCardsHaveLinks(): Promise<boolean> {
    const count = await this.getCardCount();
    if (count === 0) return false;
    for (let i = 0; i < count; i++) {
      const card = await this.getCardData(i);
      if (!card.href) return false;
    }
    return true;
  }
}
