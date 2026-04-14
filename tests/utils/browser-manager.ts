/**
 * Browser Manager - Quản lý đóng/mở Browser Context
 * Mỗi Actor có Browser Context riêng biệt
 */

import { BrowserContext, Page } from '@playwright/test';

export class BrowserManager {
  private context: BrowserContext | null = null;

  setContext(context: BrowserContext): void {
    this.context = context;
  }

  getContext(): BrowserContext | null {
    return this.context;
  }

  async newPage(): Promise<Page> {
    if (!this.context) throw new Error('Context chưa được set');
    return this.context.newPage();
  }

  async close(): Promise<void> {
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
  }
}
