/**
 * ExploreSectionComponent — Editorial / collection sections
 *
 * DOM (SG/VN):
 *   [data-testid="contentMainCard"]              ← main editorial card (e.g. "Discover Decathlon")
 *     [data-testid="contentMainCard-headline"]   ← section heading
 *
 *   [data-testid="multiple-contentcard-setup-container"]  ← multi-card editorial grid
 *     [data-testid="contentcard"]                ← each editorial card
 *       [data-testid="contentcard-body-contentheadline"]  ← card title
 *       [data-testid="contentcard-cta-anchortag"]          ← card link
 *       img                                      ← card image
 *
 * Usage:
 *   hp.explore('Discover Decathlon')  → contentMainCard with that headline
 *   hp.explore('')                    → first contentMainCard
 */

import { Page, Locator } from '@playwright/test';

export interface ExploreCard {
  title: string;
  href: string | null;
  hasImage: boolean;
}

export class ExploreSectionComponent {
  readonly page: Page;
  readonly sectionName: string;

  readonly container: Locator;
  readonly sectionTitle: Locator;
  readonly cards: Locator;

  constructor(page: Page, sectionName: string) {
    this.page        = page;
    this.sectionName = sectionName;

    if (sectionName) {
      // Try to find a contentMainCard matching the section name
      const mainCard = page.locator('[data-testid="contentMainCard"]')
        .filter({ has: page.locator(`[data-testid="contentMainCard-headline"]:text-matches("${sectionName}", "i")`) });

      // Also check if a multiple-contentcard-setup has a sibling heading matching
      const multiGrid = page.locator('[data-testid="multiple-contentcard-setup-container"]')
        .filter({ hasText: new RegExp(sectionName, 'i') });

      // Prefer mainCard if visible, else multiGrid
      this.container = page.locator([
        `[data-testid="contentMainCard"]:has([data-testid="contentMainCard-headline"])`,
        `[data-testid="multiple-contentcard-setup-container"]`,
      ].join(', ')).filter({ hasText: new RegExp(sectionName, 'i') }).first();
    } else {
      this.container = page.locator('[data-testid="contentMainCard"]').first();
    }

    this.sectionTitle = this.container.locator(
      '[data-testid="contentMainCard-headline"], [data-testid*="headline"], h2, h3'
    ).first();

    this.cards = this.container.locator(
      '[data-testid="contentcard"], [data-testid="imageCardCarousel-wrap"], a:has(img)'
    );
  }

  async isVisible(): Promise<boolean> {
    return this.container.isVisible().catch(() => false);
  }

  async getCardCount(): Promise<number> {
    return this.cards.count();
  }

  async getCardData(index: number): Promise<ExploreCard> {
    const card  = this.cards.nth(index);
    const img   = card.locator('img').first();
    const title = card.locator(
      '[data-testid="contentcard-body-contentheadline"], [data-testid*="headline"], [data-testid*="title"], h3, h4, p'
    ).first();
    const link  = card.locator('[data-testid="contentcard-cta-anchortag"], a').first();

    return {
      title:    (await title.textContent().catch(() => ''))?.trim() ?? '',
      href:     await link.getAttribute('href').catch(() => null),
      hasImage: await img.isVisible().catch(() => false),
    };
  }

  async getAllCards(): Promise<ExploreCard[]> {
    const count = await this.getCardCount();
    return Promise.all(Array.from({ length: count }, (_, i) => this.getCardData(i)));
  }

  async clickCard(index: number): Promise<void> {
    const card = this.cards.nth(index);
    const link = card.locator('[data-testid="contentcard-cta-anchortag"], a').first();
    if (await link.count()) {
      await link.click();
    } else {
      await card.click();
    }
  }

  async allCardsHaveImages(): Promise<boolean> {
    const count = await this.getCardCount();
    for (let i = 0; i < count; i++) {
      const card = await this.getCardData(i);
      if (!card.hasImage) return false;
    }
    return true;
  }

  async allCardsHaveLinks(): Promise<boolean> {
    const count = await this.getCardCount();
    for (let i = 0; i < count; i++) {
      const card = await this.getCardData(i);
      if (!card.href) return false;
    }
    return true;
  }
}
