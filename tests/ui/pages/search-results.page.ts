/**
 * SearchResultsPage - /search?q=...
 * Shows product grid + filter panel + pagination
 */

import { Page, Locator } from '@playwright/test';
import BasePageObject from './BasePageObject';
import { FilterComponent } from '../components/filter.component';
import { ProductGridComponent } from '../components/product-card.component';

export class SearchResultsPage extends BasePageObject {
  readonly filter: FilterComponent;
  readonly productGrid: ProductGridComponent;

  readonly searchQueryDisplay: Locator;
  readonly resultCount: Locator;
  readonly noResultsMessage: Locator;
  readonly paginationNext: Locator;
  readonly paginationPrev: Locator;
  readonly paginationItems: Locator;

  constructor(page: Page) {
    super(page);
    this.filter = new FilterComponent(page);
    this.productGrid = new ProductGridComponent(page);

    this.searchQueryDisplay = page.locator(
      "[data-testid='search-query'], [data-cy='search-keyword'], h1"
    ).first();
    this.resultCount = page.locator(
      "[data-testid='result-count'], [class*='result-count'], [class*='nb-hits']"
    ).first();
    this.noResultsMessage = page.getByText(/no results|no products found|không tìm thấy/i);
    this.paginationNext = page.getByRole('button', { name: /next|→/i }).last();
    this.paginationPrev = page.getByRole('button', { name: /prev|←/i }).last();
    this.paginationItems = page.locator(
      "[data-testid='pagination'] li, [class*='pagination'] li"
    );
  }

  async goto(query: string): Promise<void> {
    await this.navigate(`/search?q=${encodeURIComponent(query)}`);
  }

  async getResultCount(): Promise<number> {
    const text = await this.getText(this.resultCount);
    const match = text.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  async hasResults(): Promise<boolean> {
    return (await this.productGrid.getCount()) > 0;
  }

  async hasNoResultsMessage(): Promise<boolean> {
    return await this.noResultsMessage.isVisible();
  }

  async getDisplayedQuery(): Promise<string> {
    return await this.getText(this.searchQueryDisplay);
  }

  async goToNextPage(): Promise<void> {
    await this.click(this.paginationNext);
    await this.waitForPageLoad();
  }

  async goToPrevPage(): Promise<void> {
    await this.click(this.paginationPrev);
    await this.waitForPageLoad();
  }

  async getPaginationCount(): Promise<number> {
    return await this.paginationItems.count();
  }
}
