/**
 * FilterComponent - Product filter sidebar/panel
 * Used on: category pages, search results
 * Locators are data-attribute-first, role-based fallback
 */

import { Page, Locator } from '@playwright/test';
import BasePage from '../pages/BasePage';

export class FilterComponent extends BasePage {
  readonly filterPanel: Locator;
  readonly priceMinInput: Locator;
  readonly priceMaxInput: Locator;
  readonly applyPriceButton: Locator;
  readonly clearAllButton: Locator;
  readonly activeFilterTags: Locator;

  constructor(page: Page) {
    super(page);
    this.filterPanel = page.locator(
      "[data-testid='filter-panel'], [data-cy='filter-sidebar'], aside[class*='filter']"
    );
    this.priceMinInput = page.locator(
      "[data-testid='price-min'], input[name='price-min'], input[placeholder*='min' i]"
    );
    this.priceMaxInput = page.locator(
      "[data-testid='price-max'], input[name='price-max'], input[placeholder*='max' i]"
    );
    this.applyPriceButton = this.filterPanel.getByRole('button', { name: /apply|ok|go/i });
    this.clearAllButton = page.getByRole('button', { name: /clear all|reset|xóa lọc/i });
    this.activeFilterTags = page.locator(
      "[data-testid='active-filter'], [class*='active-filter'], [class*='filter-tag']"
    );
  }

  // ─── Category / Sport filters ─────────────────────────────────

  async filterByCategory(categoryName: string): Promise<void> {
    const checkbox = this.filterPanel.getByLabel(new RegExp(categoryName, 'i'));
    await this.check(checkbox);
    await this.page.waitForLoadState('networkidle');
  }

  async filterByBrand(brand: string): Promise<void> {
    const checkbox = this.filterPanel.getByLabel(new RegExp(brand, 'i'));
    await this.check(checkbox);
    await this.page.waitForLoadState('networkidle');
  }

  async filterBySize(size: string): Promise<void> {
    const sizeOption = this.filterPanel.getByRole('button', { name: new RegExp(`^${size}$`, 'i') });
    await this.click(sizeOption);
    await this.page.waitForLoadState('networkidle');
  }

  // ─── Price range ──────────────────────────────────────────────

  async setPriceRange(min: number, max: number): Promise<void> {
    await this.sendText(this.priceMinInput, String(min));
    await this.sendText(this.priceMaxInput, String(max));
    await this.click(this.applyPriceButton);
    await this.page.waitForLoadState('networkidle');
  }

  // ─── Clear ────────────────────────────────────────────────────

  async clearAllFilters(): Promise<void> {
    if (await this.clearAllButton.isVisible()) {
      await this.click(this.clearAllButton);
      await this.page.waitForLoadState('networkidle');
    }
  }

  async getActiveFilterCount(): Promise<number> {
    return await this.activeFilterTags.count();
  }

  async isFilterPanelVisible(): Promise<boolean> {
    return await this.filterPanel.isVisible();
  }

  // ─── Sort ─────────────────────────────────────────────────────

  async sortBy(option: 'price-asc' | 'price-desc' | 'newest' | 'rating'): Promise<void> {
    const sortDropdown = this.page.locator(
      "[data-testid='sort-select'], select[name*='sort' i], [data-cy='sort-dropdown']"
    );
    await this.selectOption(sortDropdown, option);
    await this.page.waitForLoadState('networkidle');
  }
}
