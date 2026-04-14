/**
 * SearchComponent - Reusable search bar
 * Extends BasePage (not HomePage - fixed inheritance)
 */

import { Page, Locator } from '@playwright/test';
import BasePage from '../pages/BasePage';

export class SearchComponent extends BasePage {
  readonly searchContainer: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchSuggestions: Locator;

  constructor(page: Page) {
    super(page);
    this.searchContainer = page.locator("[data-cy='search-bar-desktop']");
    this.searchInput = page.locator("[data-cy='search-bar-desktop'] input");
    this.searchButton = this.searchContainer.getByRole('button', { name: /search/i });
    this.searchSuggestions = page.locator("[data-testid='search-suggestions']");
  }

  async searchFor(keyword: string): Promise<void> {
    // Click container để kích hoạt search bar trước khi type
    await this.searchContainer.click();
    await this.searchInput.fill(keyword);
    // Chờ suggestions xuất hiện (nếu có) rồi submit bằng icon button
    await Promise.all([
      this.page.waitForURL(/search/, { timeout: 15_000 }),
      this.searchButton.click(),
    ]);
  }

  async searchAndSelectSuggestion(keyword: string, suggestion: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await this.waitForVisible(this.searchSuggestions);
    await this.searchSuggestions.getByText(suggestion).click();
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
  }

  async getSearchValue(): Promise<string> {
    return await this.searchInput.inputValue();
  }

  async isVisible(): Promise<boolean> {
    return await this.searchContainer.isVisible();
  }

  /** Backwards compat alias */
  async searchContainerIsVisible(): Promise<boolean> {
    return await this.isVisible();
  }
}
