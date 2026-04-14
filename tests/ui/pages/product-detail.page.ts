/**
 * ProductDetailPage - Trang chi tiết sản phẩm
 * Hỗ trợ VN & SG (locators dùng data-cy/data-testid nên region-agnostic)
 *
 * Size selector: React Select custom dropdown
 *   - [data-cy="size-options-container"]  → click để mở dropdown
 *   - [role="option"]                      → các option hiện ra sau khi mở
 *   - [data-testid="option-label"]         → text label của từng size (S, M, L, ...)
 *
 * Add to Cart: button nằm trong wrapper [data-cy="pdp-cta-btn-tablet-desktop"]
 */

import { Page, Locator } from '@playwright/test';
import BasePageObject from './BasePageObject';

export class ProductDetailPage extends BasePageObject {
  readonly productName: Locator;
  readonly productPrice: Locator;
  /** Wrapper của React Select dropdown — click để mở danh sách size */
  readonly sizeDropdown: Locator;
  /** Nút Add to Cart (desktop) */
  readonly addToCartButton: Locator;
  readonly stockMessage: Locator;
  readonly productImages: Locator;

  // ── backward-compat alias ──────────────────────────────────────
  get sizeSelector(): Locator { return this.sizeDropdown; }

  constructor(page: Page) {
    super(page);
    this.productName    = page.locator('h1').first();
    this.productPrice   = page.locator("[data-testid='product-price-wrapper']").first();
    this.sizeDropdown   = page.locator("[data-cy='size-options-container']");
    this.addToCartButton = page.locator("[data-cy='pdp-cta-btn-tablet-desktop'] button");
    this.stockMessage   = page.locator("[data-testid='stock-message']");
    this.productImages  = page.locator("[data-testid='model-image']");
  }

  async goto(productUrl: string): Promise<void> {
    await this.navigate(productUrl);
  }

  async getProductName(): Promise<string> {
    return await this.getText(this.productName);
  }

  async getPrice(): Promise<string> {
    return await this.getText(this.productPrice);
  }

  /**
   * Mở React Select rồi chọn size theo label (ví dụ: 'S', 'M', 'L').
   * Dùng khi biết tên size cụ thể.
   */
  async selectSize(label: string): Promise<void> {
    await this.sizeDropdown.waitFor({ state: 'visible' });
    await this.sizeDropdown.click();
    await this.page
      .locator("[role='option']")
      .filter({ has: this.page.locator("[data-testid='option-label']", { hasText: label }) })
      .click();
  }

  /**
   * Mở React Select rồi chọn size theo vị trí (0-based).
   * Dùng khi không quan tâm size cụ thể, chỉ cần chọn 1 option.
   */
  async selectSizeByIndex(index = 0): Promise<void> {
    await this.sizeDropdown.waitFor({ state: 'visible' });
    await this.sizeDropdown.click();
    await this.page.locator("[role='option']").nth(index).click();
  }

  /**
   * Trả về tất cả size đang có (In Stock + Out of Stock).
   */
  async getAvailableSizes(): Promise<string[]> {
    await this.sizeDropdown.click();
    const labels = await this.page
      .locator("[role='option'] [data-testid='option-label']")
      .allTextContents();
    // Đóng dropdown bằng Escape
    await this.page.keyboard.press('Escape');
    return labels;
  }

  /**
   * Nhấn nút Add to Cart và đợi mini-cart panel xác nhận item đã được thêm.
   * Gọi selectSize / selectSizeByIndex trước nếu sản phẩm có size.
   */
  async addToCart(): Promise<void> {
    await this.addToCartButton.waitFor({ state: 'visible' });
    await this.addToCartButton.click();
    // Chờ mini-cart summary panel xuất hiện → xác nhận item đã vào cart
    await this.page
      .locator("[data-cy='cart-navigation-summary']")
      .waitFor({ state: 'visible', timeout: 10_000 });
  }

  async isAddToCartEnabled(): Promise<boolean> {
    return await this.addToCartButton.isEnabled();
  }
}
