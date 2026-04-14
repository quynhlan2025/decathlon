/**
 * Global Teardown — runs ONCE after all tests complete
 * 1. Archive auth state files (optional)
 * 2. Clean up any seeded test data
 * 3. Print summary
 */

import { FullConfig } from '@playwright/test';

async function globalTeardown(_config: FullConfig): Promise<void> {
  console.log('\n[Global Teardown] Cleaning up...');
  // Add API-based cleanup here if test data was seeded in globalSetup
  console.log('[Global Teardown] Done.');
}

export default globalTeardown;
