/**
 * TrendingSearchComponent — Trending search keyword chips
 * Algolia-powered: bicycle, backpack, socks...
 */

import { Page, Locator } from '@playwright/test';

export class TrendingSearchComponent {
  readonly container: Locator;
  readonly sectionTitle: Locator;
  readonly keywords: Locator;      // chip/pill elements

  constructor(page: Page) {
    this.container    = page.locator(
      '[data-testid="trending-search"], .trending-search, section:has-text("Trending")'
    ).first();
    this.sectionTitle = this.container.locator('h2, h3, [class*="title"]').first();
    this.keywords     = this.container.locator('a, button, [class*="keyword"], [class*="chip"], [class*="pill"], [class*="tag"]');
  }

  async isVisible(): Promise<boolean> {
    return this.container.isVisible();
  }

  async getKeywordCount(): Promise<number> {
    return this.keywords.count();
  }

  async getKeywords(): Promise<string[]> {
    const count = await this.keywords.count();
    const words: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await this.keywords.nth(i).textContent();
      if (text?.trim()) words.push(text.trim());
    }
    return words;
  }

  async clickKeyword(index: number): Promise<void> {
    await this.keywords.nth(index).click();
  }

  async clickKeywordByText(keyword: string): Promise<void> {
    await this.keywords.filter({ hasText: new RegExp(keyword, 'i') }).first().click();
  }

  async allKeywordsHaveText(): Promise<boolean> {
    const count = await this.keywords.count();
    for (let i = 0; i < count; i++) {
      const text = await this.keywords.nth(i).textContent();
      if (!text?.trim()) return false;
    }
    return true;
  }
}
