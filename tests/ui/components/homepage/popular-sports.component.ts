/**
 * PopularSportsComponent — Sport category cards
 *
 * DOM (SG/VN): no container testid — use card testids directly
 *   [data-testid^="popular-sports-link-{id}"]   ← each sport card link
 *     [data-testid^="popular-sports-image-{id}"] ← sport image inside link
 */

import { Page, Locator } from '@playwright/test';

export class PopularSportsComponent {
  readonly page: Page;
  readonly sportCards: Locator;

  constructor(page: Page) {
    this.page = page;
    // Each card is an anchor tag with a testid starting with "popular-sports-link-"
    this.sportCards = page.locator('[data-testid^="popular-sports-link-"]');
  }

  async isVisible(): Promise<boolean> {
    return (await this.sportCards.count()) > 0;
  }

  async getCardCount(): Promise<number> {
    return this.sportCards.count();
  }

  async getSportNames(): Promise<string[]> {
    const count = await this.sportCards.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await this.sportCards.nth(i).textContent().catch(() => '');
      if (text?.trim()) names.push(text.trim());
    }
    return names;
  }

  async clickSport(index: number): Promise<void> {
    await this.sportCards.nth(index).click();
  }

  async clickSportByName(name: string): Promise<void> {
    await this.sportCards.filter({ hasText: new RegExp(name, 'i') }).first().click();
  }

  /** Carousel: SG uses prev/next arrows outside this component — always false here */
  async hasCarousel(): Promise<boolean> {
    return false;
  }

  async scrollNext(): Promise<void> {
    // No-op — popular sports section doesn't use an internal carousel on SG
  }
}
