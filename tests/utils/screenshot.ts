/**
 * Chụp màn hình – full page, viewport, hoặc element.
 * Ảnh lưu vào thư mục screenshots/ với tên có timestamp.
 */

import { Page, Locator } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const DEFAULT_DIR = path.join(process.cwd(), 'screenshots');

export type ScreenshotType = 'full' | 'viewport' | 'element';

export interface TakeScreenshotOptions {
  /** Thư mục lưu ảnh (mặc định: screenshots/) */
  dir?: string;
  /** Tiền tố tên file (vd: 'home', 'product-list') */
  name?: string;
  /** Chụp full page scroll (chỉ dùng khi type = 'full') */
  fullPage?: boolean;
  /** Ẩn các phần tử trước khi chụp (selector) */
  mask?: Locator[];
}

/**
 * Đảm bảo thư mục tồn tại.
 */
function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Sinh tên file: [name-]YYYY-MM-DD_HH-mm-ss[_viewport|_full].png
 */
function getFileName(options: TakeScreenshotOptions, type: ScreenshotType): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const prefix = options.name ? `${options.name}-` : '';
  const suffix = type === 'element' ? '' : `_${type}`;
  return `${prefix}${timestamp}${suffix}.png`;
}

/**
 * Chụp toàn trang (full page) hoặc viewport.
 * @returns Đường dẫn file ảnh đã lưu
 */
export async function takeScreenshot(
  page: Page,
  type: 'full' | 'viewport' = 'viewport',
  options: TakeScreenshotOptions = {}
): Promise<string> {
  const dir = options.dir ?? DEFAULT_DIR;
  ensureDir(dir);
  const fileName = getFileName(options, type);
  const filePath = path.join(dir, fileName);

  await page.screenshot({
    path: filePath,
    fullPage: type === 'full',
    mask: options.mask,
  });

  return filePath;
}

/**
 * Chụp màn hình chỉ một element (locator).
 * @returns Đường dẫn file ảnh đã lưu
 */
export async function takeElementScreenshot(
  locator: Locator,
  options: TakeScreenshotOptions = {}
): Promise<string> {
  const dir = options.dir ?? DEFAULT_DIR;
  ensureDir(dir);
  const fileName = getFileName(options, 'element');
  const filePath = path.join(dir, fileName);

  await locator.screenshot({ path: filePath, mask: options.mask });
  return filePath;
}

/**
 * Chụp full page (alias tiện).
 */
export async function takeFullPageScreenshot(
  page: Page,
  options: TakeScreenshotOptions = {}
): Promise<string> {
  return takeScreenshot(page, 'full', options);
}

/**
 * Chụp viewport (alias tiện).
 */
export async function takeViewportScreenshot(
  page: Page,
  options: TakeScreenshotOptions = {}
): Promise<string> {
  return takeScreenshot(page, 'viewport', options);
}
