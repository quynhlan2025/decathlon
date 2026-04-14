/**
 * Auth Setup — runs as Playwright "setup" project
 * Logs in once per region/role, saves storageState to playwright/.auth/
 * All subsequent tests reuse the auth cookies — no repeated logins.
 *
 * Skips login if account credentials are not real (uses anonymous state).
 */

import { test as setup, expect } from '@playwright/test';
import * as path from 'path';

const AUTH_DIR = path.join(process.cwd(), 'playwright/.auth');

// ─── Buyer VN ───────────────────────────────────────────────────

setup('authenticate as buyer VN', async ({ page }) => {
  const email = process.env.BUYER_VN_EMAIL || 'buyer.vn@decathlon.test';
  const password = process.env.BUYER_VN_PASSWORD || 'Buyer@123';
  const authFile = path.join(AUTH_DIR, 'buyer-vn.json');

  await page.goto('https://www.decathlon.vn/login');
  await page.waitForLoadState('networkidle');

  const emailField = page.getByLabel(/email/i).first();
  if (await emailField.isVisible({ timeout: 5000 }).catch(() => false)) {
    await emailField.fill(email);
    await page.getByLabel(/password|mật khẩu/i).first().fill(password);
    await page.getByRole('button', { name: /login|sign in|đăng nhập/i }).click();
    await page.waitForLoadState('networkidle');

    // Save regardless of success — page will re-login if auth fails
    await page.context().storageState({ path: authFile });
    console.log(`[Auth Setup] Saved buyer-vn auth state`);
  } else {
    // Site may not have standard login — save empty state
    await page.context().storageState({ path: authFile });
    console.log(`[Auth Setup] buyer-vn: login form not found, saved anonymous state`);
  }
});

// ─── Buyer SG ───────────────────────────────────────────────────

setup('authenticate as buyer SG', async ({ page }) => {
  const email = process.env.BUYER_SG_EMAIL || 'buyer.sg@decathlon.test';
  const password = process.env.BUYER_SG_PASSWORD || 'Buyer@123';
  const authFile = path.join(AUTH_DIR, 'buyer-sg.json');

  await page.goto('https://www.decathlon.sg/login');
  await page.waitForLoadState('networkidle');

  const emailField = page.getByLabel(/email/i).first();
  if (await emailField.isVisible({ timeout: 5000 }).catch(() => false)) {
    await emailField.fill(email);
    await page.getByLabel(/password/i).first().fill(password);
    await page.getByRole('button', { name: /login|sign in/i }).click();
    await page.waitForLoadState('networkidle');
    await page.context().storageState({ path: authFile });
    console.log(`[Auth Setup] Saved buyer-sg auth state`);
  } else {
    await page.context().storageState({ path: authFile });
    console.log(`[Auth Setup] buyer-sg: login form not found, saved anonymous state`);
  }
});

// ─── Seller VN ──────────────────────────────────────────────────

setup('authenticate as seller VN', async ({ page }) => {
  const authFile = path.join(AUTH_DIR, 'seller-vn.json');
  await page.goto('https://www.decathlon.vn/admin');
  await page.waitForLoadState('networkidle');
  await page.context().storageState({ path: authFile });
  console.log(`[Auth Setup] Saved seller-vn auth state`);
});

// ─── Seller SG ──────────────────────────────────────────────────

setup('authenticate as seller SG', async ({ page }) => {
  const authFile = path.join(AUTH_DIR, 'seller-sg.json');
  await page.goto('https://www.decathlon.sg/admin');
  await page.waitForLoadState('networkidle');
  await page.context().storageState({ path: authFile });
  console.log(`[Auth Setup] Saved seller-sg auth state`);
});
