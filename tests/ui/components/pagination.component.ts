/**
 * PaginationComponent — page navigation for PLP / search results
 */

import { Page, Locator } from '@playwright/test';
import BasePage from '../pages/BasePage';

export class PaginationComponent extends BasePage {
  readonly pagination: Locator;
  readonly nextButton: Locator;
  readonly prevButton: Locator;
  readonly pageItems: Locator;
  readonly currentPage: Locator;

  constructor(page: Page) {
    super(page);
    this.pagination = page
      .locator("[data-testid='pagination'], [class*='pagination'], [aria-label='pagination']")
      .first();
    this.nextButton = this.pagination.getByRole('button', { name: /next|→|>/i }).last();
    this.prevButton = this.pagination.getByRole('button', { name: /prev|←|</i }).first();
    this.pageItems = this.pagination.locator('li, button, a').filter({ hasNotText: /next|prev/i });
    this.currentPage = this.pagination.locator('[aria-current="page"], [class*="active"]').first();
  }

  async goToNext(): Promise<void> {
    await this.click(this.nextButton);
    await this.page.waitForLoadState('networkidle');
  }

  async goToPrev(): Promise<void> {
    await this.click(this.prevButton);
    await this.page.waitForLoadState('networkidle');
  }

  async goToPage(pageNumber: number): Promise<void> {
    const pageBtn = this.pagination.getByRole('button', { name: String(pageNumber) });
    await this.click(pageBtn);
    await this.page.waitForLoadState('networkidle');
  }

  async getCurrentPageNumber(): Promise<number> {
    const text = await this.getText(this.currentPage);
    return parseInt(text.trim(), 10) || 1;
  }

  async getTotalPages(): Promise<number> {
    return await this.pageItems.count();
  }

  async isNextEnabled(): Promise<boolean> {
    return await this.isEnabled(this.nextButton);
  }

  async isPrevEnabled(): Promise<boolean> {
    return await this.isEnabled(this.prevButton);
  }

  async isVisible(): Promise<boolean> {
    return await this.pagination.isVisible();
  }
}
