/**
 * Global Setup — runs ONCE before all tests
 * 1. Ensure playwright/.auth dir exists
 * 2. Validate environment config
 * 3. (Optional) seed test data via API
 */

import { chromium, FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

async function globalSetup(config: FullConfig): Promise<void> {
  // Ensure auth directory exists
  const authDir = path.join(process.cwd(), 'playwright/.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // Validate required env vars
  const env = process.env.ENV || 'prod';
  console.log(`\n[Global Setup] ENV=${env}`);
  console.log(`[Global Setup] Projects: ${config.projects.map((p) => p.name).join(', ')}`);

  // Smoke-check: verify at least one project base URL is reachable
  if (process.env.SKIP_CONNECTIVITY_CHECK !== 'true') {
    const browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext();
    const page = await ctx.newPage();

    const baseURL =
      env === 'dev' ? 'https://www.decathlon.sg' : 'https://www.decathlon.sg';

    try {
      const response = await page.goto(baseURL, { timeout: 30_000 });
      if (!response || response.status() >= 500) {
        console.warn(`[Global Setup] WARNING: ${baseURL} returned ${response?.status()}`);
      } else {
        console.log(`[Global Setup] Connectivity OK: ${baseURL} → ${response.status()}`);
      }
    } catch (e) {
      console.warn(`[Global Setup] WARNING: Could not reach ${baseURL}: ${(e as Error).message}`);
    } finally {
      await browser.close();
    }
  }
}

export default globalSetup;
