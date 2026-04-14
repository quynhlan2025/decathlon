/**
 * BreadcrumbComponent - Navigation breadcrumb
 * e.g. Home > Running > Shoes > Nike Pegasus
 */

import { Page, Locator } from '@playwright/test';
import BasePage from '../pages/BasePage';

export class BreadcrumbComponent extends BasePage {
  readonly breadcrumb: Locator;
  readonly items: Locator;
  readonly homeItem: Locator;
  readonly currentItem: Locator;

  constructor(page: Page) {
    super(page);
    this.breadcrumb = page.locator(
      "[data-testid='breadcrumb'], [aria-label='breadcrumb'], nav[class*='breadcrumb'], ol[class*='breadcrumb']"
    ).first();
    this.items = this.breadcrumb.locator('li, [data-testid*="breadcrumb-item"]');
    this.homeItem = this.items.first();
    this.currentItem = this.items.last();
  }

  async getItems(): Promise<string[]> {
    const count = await this.items.count();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      texts.push(((await this.items.nth(i).textContent()) ?? '').trim());
    }
    return texts;
  }

  async getDepth(): Promise<number> {
    return await this.items.count();
  }

  async getCurrentPageName(): Promise<string> {
    return ((await this.currentItem.textContent()) ?? '').trim();
  }

  async navigateTo(index: number): Promise<void> {
    const item = this.items.nth(index).getByRole('link');
    await this.click(item);
    await this.page.waitForLoadState('networkidle');
  }

  async goHome(): Promise<void> {
    await this.navigateTo(0);
  }

  async isVisible(): Promise<boolean> {
    return await this.breadcrumb.isVisible();
  }
}
