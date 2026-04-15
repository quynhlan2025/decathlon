/**
 * ProductCardComponent - Individual product card in listing/search pages
 * Wraps a single card locator; provides typed accessors for price, name, rating.
 */

import { Locator, Page } from '@playwright/test';
import BasePage from '../pages/BasePage';

export class ProductCardComponent extends BasePage {
  /** The root locator of this specific card */
  readonly card: Locator;

  readonly name: Locator;
  readonly price: Locator;
  readonly originalPrice: Locator;
  readonly discountBadge: Locator;
  readonly rating: Locator;
  readonly image: Locator;
  readonly wishlistButton: Locator;

  constructor(page: Page, cardLocator: Locator) {
    super(page);
    this.card = cardLocator;
    this.name = cardLocator.locator(
      "[data-testid='product-name'], [class*='product-name'], [class*='product-title']"
    ).first();
    this.price = cardLocator.locator(
      "[data-testid='product-price'], [data-testid='product-price-wrapper']"
    ).first();
    this.originalPrice = cardLocator.locator(
      "[data-testid='original-price'], [class*='original-price'], s"
    ).first();
    this.discountBadge = cardLocator.locator(
      "[data-testid='discount-badge'], [class*='discount'], [class*='badge']"
    ).first();
    this.rating = cardLocator.locator(
      "[data-testid='rating'], [aria-label*='star' i], [class*='rating']"
    ).first();
    this.image = cardLocator.locator('img').first();
    this.wishlistButton = cardLocator.getByRole('button', { name: /wishlist|save|heart/i });
  }

  async getName(): Promise<string> {
    return await this.getText(this.name);
  }

  async getPrice(): Promise<string> {
    return await this.getText(this.price);
  }

  async getOriginalPrice(): Promise<string | null> {
    if (await this.originalPrice.isVisible()) {
      return await this.getText(this.originalPrice);
    }
    return null;
  }

  async getDiscountPercent(): Promise<string | null> {
    if (await this.discountBadge.isVisible()) {
      return await this.getText(this.discountBadge);
    }
    return null;
  }

  async hasDiscount(): Promise<boolean> {
    return await this.discountBadge.isVisible();
  }

  async click(): Promise<void> {
    await super.click(this.card);
  }

  async addToWishlist(): Promise<void> {
    await super.click(this.wishlistButton);
  }
}

/**
 * ProductGridComponent - Collection of ProductCards on a listing page
 */
export class ProductGridComponent extends BasePage {
  readonly grid: Locator;
  readonly cardLocators: Locator;

  constructor(page: Page) {
    super(page);
    this.grid = page.locator(
      "[data-testid='product-grid'], [data-testid='productHit-tilesbox-container'], [class*='product-grid']"
    ).first();
    // [data-testid="producthit-tile-box"] là locator chính xác từ Decathlon SG/VN
    this.cardLocators = page.locator(
      "[data-testid='producthit-tile-box'], [data-testid='productHit-tilesbox-gridcell'], [data-testid='product-card']"
    );
  }

  async getCount(): Promise<number> {
    return await this.cardLocators.count();
  }

  getCard(index: number): ProductCardComponent {
    return new ProductCardComponent(this.page, this.cardLocators.nth(index));
  }

  async getAllNames(): Promise<string[]> {
    const count = await this.getCount();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      names.push(await this.getCard(i).getName());
    }
    return names;
  }

  async clickCard(index: number): Promise<void> {
    await this.getCard(index).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Lấy danh sách tất cả product tiles, click vào 1 card ngẫu nhiên.
   * Trả về index đã click để test có thể log/assert nếu cần.
   */
  async clickRandom(): Promise<number> {
    await this.cardLocators.first().waitFor({ state: 'visible', timeout: 10_000 });
    const count = await this.getCount();
    if (count === 0) throw new Error('No product tiles found on page');
    const index = Math.floor(Math.random() * count);
    await this.clickCard(index);
    return index;
  }

  async isGridVisible(): Promise<boolean> {
    return await this.grid.isVisible();
  }
}
