
/**
 * ProductShelfComponent — Generic named product shelf
 * Covers any section that follows: Title + Product Cards + optional "View All"
 * Examples: "Best Sellers", "New Arrivals", "On Sale", "Cycling Essentials"
 *
 * Usage:
 *   const bestSellers = new ProductShelfComponent(page, 'Best Sellers');
 *   const cycling     = new ProductShelfComponent(page, 'Cycling');
 */

import { Page, Locator } from '@playwright/test';

export interface ShelfProductCard {
  name: string;
  price: string | null;
  href: string | null;
  hasImage: boolean;
  hasBadge: boolean;  // sale/new/exclusive badge
}

export class ProductShelfComponent {
  readonly page: Page;
  readonly sectionName: string;

  readonly container: Locator;
  readonly sectionTitle: Locator;
  readonly productCards: Locator;
  readonly viewAllLink: Locator;

  constructor(page: Page, sectionName: string) {
    this.page        = page;
    this.sectionName = sectionName;

    // Strategy: find section by heading text, fallback to data-testid / class patterns
    this.container = page.locator([
      `[data-testid*="product-shelf"]`,
      `[data-testid*="product-section"]`,
      `section:has(h2:text-matches("${sectionName}", "i"))`,
      `section:has(h3:text-matches("${sectionName}", "i"))`,
      `[class*="product-shelf"]:has-text("${sectionName}")`,
      `[class*="product-section"]:has-text("${sectionName}")`,
    ].join(', ')).filter({ hasText: new RegExp(sectionName, 'i') }).first();

    this.sectionTitle = this.container.locator('h2, h3, [class*="title"], [class*="heading"]').first();

    this.productCards = this.container.locator([
      '[data-testid="product-card"]',
      '[class*="product-card"]',
      '[class*="product-item"]',
      'article',
      'li:has(img):has(a)',
    ].join(', '));

    this.viewAllLink = this.container.locator([
      'a:has-text("View All")',
      'a:has-text("See All")',
      'a:has-text("Xem tất cả")',
      '[data-testid="view-all"]',
      '[class*="view-all"]',
    ].join(', ')).first();
  }

  async isVisible(): Promise<boolean> {
    return this.container.isVisible().catch(() => false);
  }

  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }

  async getProductData(index: number): Promise<ShelfProductCard> {
    const card  = this.productCards.nth(index);
    const img   = card.locator('img').first();
    const name  = card.locator('[class*="name"], [class*="title"], [class*="product-name"], h3, h4').first();
    const price = card.locator('[class*="price"], [data-testid*="price"]').first();
    const badge = card.locator('[class*="badge"], [class*="tag"], [class*="label"]');

    return {
      name:     (await name.textContent().catch(() => ''))?.trim() ?? '',
      price:    (await price.textContent().catch(() => null))?.trim() ?? null,
      href:     await card.locator('a').first().getAttribute('href').catch(() => null),
      hasImage: await img.isVisible().catch(() => false),
      hasBadge: await badge.count().then(c => c > 0).catch(() => false),
    };
  }

  async getAllProducts(): Promise<ShelfProductCard[]> {
    const count = await this.getProductCount();
    return Promise.all(Array.from({ length: count }, (_, i) => this.getProductData(i)));
  }

  async clickProduct(index: number): Promise<void> {
    await this.productCards.nth(index).locator('a').first().click();
  }

  async clickViewAll(): Promise<void> {
    await this.viewAllLink.click();
  }

  async hasViewAll(): Promise<boolean> {
    return this.viewAllLink.isVisible().catch(() => false);
  }

  async allProductsHaveImages(): Promise<boolean> {
    const count = await this.getProductCount();
    for (let i = 0; i < count; i++) {
      const product = await this.getProductData(i);
      if (!product.hasImage) return false;
    }
    return true;
  }

  async allProductsHavePrices(): Promise<boolean> {
    const count = await this.getProductCount();
    for (let i = 0; i < count; i++) {
      const product = await this.getProductData(i);
      if (!product.price) return false;
    }
    return true;
  }

  async allProductsHaveLinks(): Promise<boolean> {
    const count = await this.getProductCount();
    for (let i = 0; i < count; i++) {
      const product = await this.getProductData(i);
      if (!product.href) return false;
    }
    return true;
  }

  /** Carousel / next-prev navigation */
  async scrollNext(): Promise<void> {
    const next = this.container.locator('button[aria-label*="next" i], [class*="next"]').first();
    if (await next.isVisible().catch(() => false)) {
      await next.click();
    }
  }

  async scrollPrev(): Promise<void> {
    const prev = this.container.locator('button[aria-label*="prev" i], [class*="prev"]').first();
    if (await prev.isVisible().catch(() => false)) {
      await prev.click();
    }
  }
}
