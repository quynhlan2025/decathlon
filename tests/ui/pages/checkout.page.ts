/**
 * CheckoutPage - Trang thanh toán
 * Region-aware: VN (COD, địa chỉ VN) | SG (Credit card, SG address)
 */

import { Page, Locator } from '@playwright/test';
import BasePageObject from './BasePageObject';
import { ROUTES } from '@constants/routes';
import type { Region } from '@constants/urls';

export interface GuestInfo {
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface CheckoutAddress {
  province?: string;   // VN only
  district?: string;   // VN only
  ward?: string;       // VN only
  city?: string;       // SG only
  postalCode?: string; // SG only
}

export interface OrderSummary {
  subtotal: string;
  shipping: string;
  total: string;
  itemCount: number;
}

export class CheckoutPage extends BasePageObject {
  private readonly region: Region;

  // ─── Guest Info ───────────────────────────────────────────────
  readonly fullNameInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly addressInput: Locator;

  // ─── VN Address ───────────────────────────────────────────────
  readonly provinceDropdown: Locator;
  readonly districtDropdown: Locator;
  readonly wardDropdown: Locator;

  // ─── SG Address ───────────────────────────────────────────────
  readonly postalCodeInput: Locator;
  readonly cityInput: Locator;

  // ─── Payment ──────────────────────────────────────────────────
  readonly paymentSection: Locator;
  readonly codOption: Locator;
  readonly creditCardOption: Locator;

  // ─── Order Summary ────────────────────────────────────────────
  readonly orderSummarySection: Locator;
  readonly summarySubtotal: Locator;
  readonly summaryShipping: Locator;
  readonly summaryTotal: Locator;
  readonly summaryItems: Locator;

  // ─── Actions ──────────────────────────────────────────────────
  readonly termsCheckbox: Locator;
  readonly continueButton: Locator;
  readonly placeOrderButton: Locator;
  readonly orderConfirmation: Locator;
  readonly orderNumber: Locator;

  constructor(page: Page, region: Region) {
    super(page);
    this.region = region;

    this.fullNameInput = page.getByLabel(/full name|họ và tên/i);
    this.phoneInput = page.getByLabel(/phone|số điện thoại/i);
    this.emailInput = page.getByLabel(/email/i);
    this.addressInput = page.getByLabel(/street|address|địa chỉ/i);

    this.provinceDropdown = page.getByLabel(/province|tỉnh.*thành/i);
    this.districtDropdown = page.getByLabel(/district|quận.*huyện/i);
    this.wardDropdown = page.getByLabel(/ward|phường.*xã/i);

    this.postalCodeInput = page.getByLabel(/postal|zip code/i);
    this.cityInput = page.getByLabel(/city/i);

    this.paymentSection = page.locator("[data-testid='payment-methods'], #payment-methods");
    this.codOption = this.paymentSection.getByText(/cod|cash on delivery|tiền mặt/i);
    this.creditCardOption = this.paymentSection.getByText(/credit card|thẻ tín dụng/i);

    this.orderSummarySection = page.locator("[data-testid='order-summary'], [data-cy='order-summary']");
    this.summarySubtotal = this.orderSummarySection.locator("[data-testid='subtotal']");
    this.summaryShipping = this.orderSummarySection.locator("[data-testid='shipping-cost']");
    this.summaryTotal = this.orderSummarySection.locator("[data-testid='total-price']");
    this.summaryItems = this.orderSummarySection.locator("[data-testid='checkout-item']");

    this.termsCheckbox = page.getByLabel(/agree|terms|điều khoản/i);
    this.continueButton = page.getByRole('button', { name: /continue|tiếp tục/i });
    this.placeOrderButton = page.getByRole('button', { name: /place order|đặt hàng/i });
    this.orderConfirmation = page.locator("[data-testid='order-confirmation'], [data-cy='order-confirmation']");
    this.orderNumber = page.locator("[data-testid='order-number']");
  }

  // ─── Navigation ───────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.navigate(ROUTES.CHECKOUT);
  }

  // ─── Fill Guest Info ──────────────────────────────────────────

  async fillGuestInfo(info: GuestInfo): Promise<void> {
    await this.sendText(this.fullNameInput, info.fullName);
    await this.sendText(this.phoneInput, info.phone);
    if (info.email) await this.sendText(this.emailInput, info.email);
    if (info.address) await this.sendText(this.addressInput, info.address);
  }

  // ─── Fill Address ─────────────────────────────────────────────

  async fillAddress(addr: CheckoutAddress): Promise<void> {
    if (this.region === 'VN') {
      await this.fillVNAddress(addr.province ?? '', addr.district ?? '', addr.ward ?? '');
    } else {
      await this.fillSGAddress(addr.postalCode ?? '', addr.city ?? '');
    }
  }

  async fillVNAddress(province: string, district: string, ward: string): Promise<void> {
    await this.selectOptionByLabel(this.provinceDropdown, province);
    await this.districtDropdown.waitFor({ state: 'visible' });
    await this.selectOptionByLabel(this.districtDropdown, district);
    await this.wardDropdown.waitFor({ state: 'visible' });
    await this.selectOptionByLabel(this.wardDropdown, ward);
  }

  async fillSGAddress(postalCode: string, city: string): Promise<void> {
    await this.sendText(this.postalCodeInput, postalCode);
    await this.sendText(this.cityInput, city);
  }

  // ─── Payment ──────────────────────────────────────────────────

  async selectPaymentMethod(method: string): Promise<void> {
    await this.click(this.paymentSection.getByText(method));
  }

  async selectCOD(): Promise<void> {
    await this.click(this.codOption);
  }

  async selectCreditCard(): Promise<void> {
    await this.click(this.creditCardOption);
  }

  // ─── Order Summary ────────────────────────────────────────────

  async getOrderSummary(): Promise<OrderSummary> {
    return {
      subtotal: await this.getText(this.summarySubtotal),
      shipping: await this.getText(this.summaryShipping),
      total: await this.getText(this.summaryTotal),
      itemCount: await this.summaryItems.count(),
    };
  }

  // ─── Actions ──────────────────────────────────────────────────

  async acceptTerms(): Promise<void> {
    if (await this.termsCheckbox.isVisible()) {
      await this.check(this.termsCheckbox);
    }
  }

  async continueToPayment(): Promise<void> {
    await this.click(this.continueButton);
    await this.waitForVisible(this.paymentSection);
  }

  async placeOrder(): Promise<void> {
    await this.click(this.placeOrderButton);
    await this.waitForURL(/order-confirmation|xac-nhan-don-hang/);
  }

  async getOrderNumber(): Promise<string> {
    return await this.getText(this.orderNumber);
  }

  async isPaymentSectionVisible(): Promise<boolean> {
    return await this.paymentSection.isVisible();
  }

  async isPlaceOrderEnabled(): Promise<boolean> {
    return await this.placeOrderButton.isEnabled();
  }

  getRegion(): Region {
    return this.region;
  }
}
