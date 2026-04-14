/**
 * Common Utilities - Shared helpers dùng toàn framework
 */

import { Page, Locator, Request, Response } from '@playwright/test';
import type { Region } from '@constants/urls';

// ─── Random Generators ────────────────────────────────────────

export function getRandomInt(min: number, max: number): number {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  return Math.floor(Math.random() * (high - low + 1)) + low;
}

export function getRandomString(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

export function getRandomEmail(): string {
  return `test.${getRandomString(6)}@decathlon.test`;
}

// ─── Currency / Formatting ────────────────────────────────────

const CURRENCY_FORMAT: Record<Region, Intl.NumberFormatOptions> = {
  VN: { style: 'currency', currency: 'VND', maximumFractionDigits: 0 },
  SG: { style: 'currency', currency: 'SGD', minimumFractionDigits: 2 },
};

export function formatCurrency(amount: number, region: Region): string {
  const locale = region === 'VN' ? 'vi-VN' : 'en-SG';
  return new Intl.NumberFormat(locale, CURRENCY_FORMAT[region]).format(amount);
}

export function stripCurrencySymbol(text: string): number {
  return parseFloat(text.replace(/[^\d.]/g, ''));
}

// ─── Retry ────────────────────────────────────────────────────

export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: Error | undefined;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err as Error;
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
  throw lastError;
}

// ─── API Waits ────────────────────────────────────────────────

export async function waitForApiResponse(
  page: Page,
  urlPattern: string | RegExp,
  action: () => Promise<void>,
  options: { status?: number; timeout?: number } = {}
): Promise<Response> {
  const { status = 200, timeout = 30000 } = options;
  const [response] = await Promise.all([
    page.waitForResponse(
      (res) => {
        const urlMatch =
          typeof urlPattern === 'string'
            ? res.url().includes(urlPattern)
            : urlPattern.test(res.url());
        return urlMatch && res.status() === status;
      },
      { timeout }
    ),
    action(),
  ]);
  return response;
}

export async function waitForApiRequest(
  page: Page,
  urlPattern: string | RegExp,
  action: () => Promise<void>
): Promise<Request> {
  const [request] = await Promise.all([
    page.waitForRequest(
      (req) =>
        typeof urlPattern === 'string'
          ? req.url().includes(urlPattern)
          : urlPattern.test(req.url())
    ),
    action(),
  ]);
  return request;
}

// ─── Scroll ───────────────────────────────────────────────────

export async function scrollToElement(_page: Page, locator: Locator): Promise<void> {
  await locator.scrollIntoViewIfNeeded();
}

export async function scrollToBottom(page: Page): Promise<void> {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
}

export async function scrollToTop(page: Page): Promise<void> {
  await page.evaluate(() => window.scrollTo(0, 0));
}

export async function scrollBy(page: Page, x: number, y: number): Promise<void> {
  await page.evaluate(([dx, dy]: number[]) => window.scrollBy(dx, dy), [x, y]);
}

// ─── Drag & Drop ──────────────────────────────────────────────

export async function dragAndDrop(
  _page: Page,
  source: Locator,
  target: Locator
): Promise<void> {
  await source.dragTo(target);
}

// ─── Table Helper ─────────────────────────────────────────────

export class TableHelper {
  constructor(private readonly tableLocator: Locator) {}

  async getRowCount(): Promise<number> {
    return await this.tableLocator.locator('tbody tr').count();
  }

  async getColumnCount(): Promise<number> {
    return await this.tableLocator.locator('thead th').count();
  }

  async getCellText(row: number, col: number): Promise<string> {
    const cell = this.tableLocator.locator('tbody tr').nth(row).locator('td').nth(col);
    return (await cell.textContent()) ?? '';
  }

  async getRowByText(searchText: string): Promise<Locator> {
    return this.tableLocator.locator('tbody tr').filter({ hasText: searchText });
  }

  async getAllRowsData(): Promise<string[][]> {
    const rows = this.tableLocator.locator('tbody tr');
    const count = await rows.count();
    const result: string[][] = [];
    for (let i = 0; i < count; i++) {
      const cells = rows.nth(i).locator('td');
      const cellCount = await cells.count();
      const rowData: string[] = [];
      for (let j = 0; j < cellCount; j++) {
        rowData.push((await cells.nth(j).textContent()) ?? '');
      }
      result.push(rowData);
    }
    return result;
  }
}

// ─── Form Helper ──────────────────────────────────────────────

export class FormHelper {
  constructor(private readonly page: Page) {}

  async fillForm(fields: Record<string, string>): Promise<void> {
    for (const [label, value] of Object.entries(fields)) {
      const input = this.page.getByLabel(new RegExp(label, 'i'));
      await input.waitFor({ state: 'visible' });
      await input.clear();
      await input.fill(value);
    }
  }

  async getValidationError(fieldLabel: string): Promise<string> {
    const field = this.page.getByLabel(new RegExp(fieldLabel, 'i'));
    const fieldId = await field.getAttribute('id');
    const errorEl = fieldId
      ? this.page.locator(`[aria-describedby*="${fieldId}"], #${fieldId}-error`)
      : this.page.locator('[role="alert"]').first();
    return (await errorEl.textContent()) ?? '';
  }

  async isFieldRequired(locator: Locator): Promise<boolean> {
    const required = await locator.getAttribute('required');
    const ariaRequired = await locator.getAttribute('aria-required');
    return required !== null || ariaRequired === 'true';
  }

  async clearAllFields(formLocator: Locator): Promise<void> {
    const inputs = formLocator.locator(
      'input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"])'
    );
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
      await inputs.nth(i).clear();
    }
  }
}
