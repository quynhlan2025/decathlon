/**
 * CategoryPage - /sg/c0/running or /vn/c0/ban-chay
 * Shows product listing for a category with filters and breadcrumb
 */

import { Page, Locator } from '@playwright/test';
import BasePageObject from './BasePageObject';
import { FilterComponent } from '../components/filter.component';
import { ProductGridComponent } from '../components/product-card.component';
import { BreadcrumbComponent } from '../components/breadcrumb.component';
import { PATHS, type Region, type RegionPaths } from '@constants/urls';

export class CategoryPage extends BasePageObject {
  readonly filter: FilterComponent;
  readonly productGrid: ProductGridComponent;
  readonly breadcrumb: BreadcrumbComponent;

  readonly categoryTitle: Locator;
  readonly resultCount: Locator;
  readonly paginationNext: Locator;
  readonly paginationPrev: Locator;

  private readonly region: Region;
  private readonly paths: RegionPaths;

  constructor(page: Page, region: Region = 'SG') {
    super(page);
    this.region = region;
    this.paths = PATHS[region];

    this.filter = new FilterComponent(page);
    this.productGrid = new ProductGridComponent(page);
    this.breadcrumb = new BreadcrumbComponent(page);

    this.categoryTitle = page.locator('h1, [data-testid="category-title"]').first();
    this.resultCount = page
      .locator("[data-testid='result-count'], [class*='result-count'], [class*='nb-hits']")
      .first();
    this.paginationNext = page.getByRole('button', { name: /next|→/i }).last();
    this.paginationPrev = page.getByRole('button', { name: /prev|←/i }).last();
  }

  async gotoRunning(): Promise<void> {
    await this.navigate(this.paths.CATEGORIES.RUNNING);
  }

  async gotoSportswear(): Promise<void> {
    await this.navigate(this.paths.CATEGORIES.SPORTSWEAR);
  }

  async gotoCycling(): Promise<void> {
    await this.navigate(this.paths.CATEGORIES.CYCLING);
  }

  async goto(path: string): Promise<void> {
    await this.navigate(path);
  }

  async getCategoryTitle(): Promise<string> {
    return await this.getText(this.categoryTitle);
  }

  async getProductCount(): Promise<number> {
    return await this.productGrid.getCount();
  }

  async goToNextPage(): Promise<void> {
    await this.click(this.paginationNext);
    await this.waitForPageLoad();
  }

  async goToPrevPage(): Promise<void> {
    await this.click(this.paginationPrev);
    await this.waitForPageLoad();
  }

  getRegion(): Region {
    return this.region;
  }
}
