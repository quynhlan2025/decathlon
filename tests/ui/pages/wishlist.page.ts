/**
 * WishlistPage - /wishlist or /account/wishlist
 * Saved products list for logged-in users
 */

import { Page, Locator } from '@playwright/test';
import BasePageObject from './BasePageObject';

export class WishlistPage extends BasePageObject {
  readonly wishlistItems: Locator;
  readonly emptyMessage: Locator;
  readonly shareButton: Locator;
  readonly clearAllButton: Locator;
  readonly addAllToCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.wishlistItems = page.locator(
      "[data-testid='wishlist-item'], [class*='wishlist-item'], [class*='saved-item']"
    );
    this.emptyMessage = page.getByText(/wishlist is empty|no saved items|chưa có sản phẩm/i);
    this.shareButton = page.getByRole('button', { name: /share wishlist/i });
    this.clearAllButton = page.getByRole('button', { name: /clear all|remove all/i });
    this.addAllToCartButton = page.getByRole('button', { name: /add all to cart/i });
  }

  async goto(): Promise<void> {
    await this.navigate('/wishlist');
  }

  async getItemCount(): Promise<number> {
    return await this.wishlistItems.count();
  }

  async isEmpty(): Promise<boolean> {
    return await this.emptyMessage.isVisible();
  }

  async removeItem(index: number): Promise<void> {
    const removeBtn = this.wishlistItems
      .nth(index)
      .getByRole('button', { name: /remove|delete/i });
    await this.click(removeBtn);
  }

  async addItemToCart(index: number): Promise<void> {
    const addBtn = this.wishlistItems
      .nth(index)
      .getByRole('button', { name: /add to cart/i });
    await this.click(addBtn);
    await this.page.waitForLoadState('networkidle');
  }

  async getItemName(index: number): Promise<string> {
    const nameEl = this.wishlistItems
      .nth(index)
      .locator("[data-testid='product-name'], [class*='product-name']")
      .first();
    return await this.getText(nameEl);
  }
}
