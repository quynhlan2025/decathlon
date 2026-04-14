/**
 * CartPage - Giỏ hàng
 * Hỗ trợ VN & SG
 */

import { Page, Locator } from '@playwright/test';
import BasePageObject from './BasePageObject';

export class CartPage extends BasePageObject {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly emptyCartMessage: Locator;
  readonly totalPrice: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator("[data-cy='cart-product']");
    this.checkoutButton = page.getByRole('button', { name: /checkout|thanh toán/i });
    this.emptyCartMessage = page.getByText(/your cart is empty|giỏ hàng trống/i);
    this.totalPrice = page.locator("[data-testid='cart-total'], [data-cy='cart-total']");
  }

  async goto(): Promise<void> {
    await this.navigate('/cart');
  }

  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getTotalPrice(): Promise<string> {
    return await this.getText(this.totalPrice);
  }

  async removeItem(index: number): Promise<void> {
    const removeBtn = this.cartItems
      .nth(index)
      .getByRole('button', { name: /remove|xóa/i });
    await this.click(removeBtn);
  }

  async proceedToCheckout(): Promise<void> {
    await this.click(this.checkoutButton);
    await this.waitForURL(/checkout|thanh-toan/);
  }

  async isEmpty(): Promise<boolean> {
    return await this.emptyCartMessage.isVisible();
  }
}
