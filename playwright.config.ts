/**
 * Playwright Configuration — Enterprise Scale
 *
 * Projects:
 *   setup        → save auth state (runs first, once)
 *   VN           → Chromium, vi-VN, guest (no login)
 *   SG           → Chromium, en-SG, guest (no login)
 *   VN-auth      → Chromium, vi-VN, logged-in (storageState)
 *   SG-auth      → Chromium, en-SG, logged-in (storageState)
 *   VN-mobile    → Pixel 5, vi-VN, guest
 *   SG-mobile    → iPhone 12, en-SG, guest
 *   SG-webkit    → Safari, en-SG, guest
 *
 * Auth strategy:
 *   Guest  projects (VN, SG)           → skip @logged-in, skip @sg-only
 *   Auth   projects (VN-auth, SG-auth) → only @logged-in, skip opposite region
 *   Mobile / webkit                    → skip @logged-in
 *
 * Region strategy:
 *   VN, VN-auth, VN-mobile  → skip @sg-only
 *   SG, SG-auth, SG-mobile  → skip @vn-only
 *
 * Spec folders:
 *   tests/specs/shared/   → 80% — chạy trên TẤT CẢ projects
 *   tests/specs/vn-only/  → 10% — @vn-only, chỉ VN projects
 *   tests/specs/sg-only/  → 10% — @sg-only, chỉ SG projects
 *
 * Tags (via --grep):
 *   @smoke | @regression | @p0 | @p1 | @p2
 *   @guest | @logged-in
 *   @vn-only | @sg-only
 *   @visual | @api | @a11y | @performance | @mobile
 *
 * ENV vars:
 *   ENV=dev|prod     (default: prod)
 *   WORKERS=N        (default: cpu count)
 *   SHARD=1/4        (for CI sharding)
 */

import { defineConfig, devices } from '@playwright/test';
import { getUrlConfig, type Environment } from './tests/constants/urls';

const env = (process.env.ENV || 'prod') as Environment;
const vnConfig = getUrlConfig('VN', env);
const sgConfig = getUrlConfig('SG', env);

// Auth state files – written by setup project, read by -auth projects
export const AUTH_FILES = {
  buyer_vn: 'playwright/.auth/buyer-vn.json',
  buyer_sg: 'playwright/.auth/buyer-sg.json',
  seller_vn: 'playwright/.auth/seller-vn.json',
  seller_sg: 'playwright/.auth/seller-sg.json',
} as const;

export default defineConfig({
  testDir: './tests/specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  
  workers: process.env.WORKERS ? parseInt(process.env.WORKERS) : process.env.CI ? 4 : undefined,

  // ─── Reporters ──────────────────────────────────────────────
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['line'],
    ...(process.env.CI ? [['github'] as [string]] : []),
  ],

  // ─── Global settings ────────────────────────────────────────
  use: {
    headless: process.env.CI ? true : false,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  // ─── Output ─────────────────────────────────────────────────
  outputDir: 'test-results',
  snapshotDir: 'tests/specs/visual/__snapshots__',

  // ─── Projects ───────────────────────────────────────────────
  projects: [

    // ══════════════════════════════════════════════════════════
    // AUTH SETUP — chạy 1 lần trước tất cả, tạo storageState
    // ══════════════════════════════════════════════════════════
    {
      name: 'setup',
      testMatch: '**/fixtures/auth.setup.ts',
      use: { headless: true },
    },

    // ══════════════════════════════════════════════════════════
    // GUEST PROJECTS — browser sạch, không login
    // Bỏ qua tất cả test @logged-in
    // ══════════════════════════════════════════════════════════

    {
      name: 'VN',
      grepInvert: /@logged-in|@sg-only/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: vnConfig.baseURL,
        locale: vnConfig.locale,
      },
    },

    {
      name: 'SG',
      grepInvert: /@logged-in|@vn-only/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: sgConfig.baseURL,
        locale: sgConfig.locale,
      },
    },

    // ══════════════════════════════════════════════════════════
    // LOGGED-IN PROJECTS — có storageState, đã đăng nhập
    // ══════════════════════════════════════════════════════════

    {
      name: 'VN-auth',
      dependencies: ['setup'],
      grep: /@logged-in/,
      grepInvert: /@sg-only/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: vnConfig.baseURL,
        locale: vnConfig.locale,
        storageState: AUTH_FILES.buyer_vn,
      },
    },

    {
      name: 'SG-auth',
      dependencies: ['setup'],
      grep: /@logged-in/,
      grepInvert: /@vn-only/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: sgConfig.baseURL,
        locale: sgConfig.locale,
        storageState: AUTH_FILES.buyer_sg,
      },
    },

    // ══════════════════════════════════════════════════════════
    // MOBILE / WEBKIT — guest only, @smoke only for webkit
    // ══════════════════════════════════════════════════════════

    {
      name: 'VN-mobile',
      grep: /@mobile|@responsive/,
      grepInvert: /@logged-in|@sg-only/,
      use: {
        ...devices['Pixel 5'],
        baseURL: vnConfig.baseURL,
        locale: vnConfig.locale,
      },
    },

    {
      name: 'SG-mobile',
      grep: /@mobile|@responsive/,
      grepInvert: /@logged-in|@vn-only/,
      use: {
        ...devices['iPhone 12'],
        baseURL: sgConfig.baseURL,
        locale: sgConfig.locale,
      },
    },

    {
      name: 'SG-webkit',
      testMatch: '**/specs/shared/smoke/**/*.spec.ts',
      grepInvert: /@logged-in|@vn-only/,
      use: {
        ...devices['Desktop Safari'],
        baseURL: sgConfig.baseURL,
        locale: sgConfig.locale,
      },
    },
  ],
});
