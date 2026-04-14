/**
 * SearchTask — Atomic action: type keyword in search bar and submit
 *
 * Usage:
 *   await SearchTask.for(page).withKeyword('yoga').execute();
 *   await SearchTask.perform(page, 'running shoes');
 */

import { Page, test } from '@playwright/test';
import { SearchComponent } from '@ui/components/search.component';

export class SearchTask {
  private page: Page;
  private keyword = '';
  private selectSuggestion?: string;

  private constructor(page: Page) {
    this.page = page;
  }

  // ─── Builder ─────────────────────────────────────────────────

  static for(page: Page): SearchTask {
    return new SearchTask(page);
  }

  withKeyword(keyword: string): this {
    this.keyword = keyword;
    return this;
  }

  andSelectSuggestion(suggestion: string): this {
    this.selectSuggestion = suggestion;
    return this;
  }

  // ─── Execute ─────────────────────────────────────────────────

  async execute(): Promise<void> {
    if (!this.keyword) throw new Error('SearchTask: keyword not set');

    return test.step(`SearchTask: search for "${this.keyword}"`, async () => {
      const search = new SearchComponent(this.page);

      if (this.selectSuggestion) {
        await search.searchAndSelectSuggestion(this.keyword, this.selectSuggestion);
      } else {
        await search.searchFor(this.keyword);
      }

      await this.page.waitForLoadState('networkidle');
    });
  }

  // ─── Static shortcut ─────────────────────────────────────────

  static async perform(page: Page, keyword: string): Promise<void> {
    await SearchTask.for(page).withKeyword(keyword).execute();
  }
}
