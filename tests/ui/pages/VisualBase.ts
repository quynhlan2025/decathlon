// ─── Visual / Image Comparison ────────────────────────────────
//
// Usage guide:
//
// | Situation                                      | Method                          |
// | ---------------------------------------------- | ------------------------------- |
// | Static UI with no dynamic data                 | matchSnapshot()                 |
// | Has dynamic areas (price, date, avatar, timer) | matchSnapshotAndMask()          |
// | Font rendering differs across OS               | matchSnapshotWithThreshold()    |
// | Large image, allow a few pixels difference     | matchSnapshotWithMaxDiffPixels()|
// | Need to regenerate a new baseline              | updateSnapshot()                |
//
// First run — generate baseline:
//   npx playwright test --update-snapshots
//
// Subsequent runs — compare against baseline:
//   npx playwright test

import { Page, Locator, expect } from "@playwright/test";

export default class VisualBase {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Compare a visible element against its stored snapshot.
   * Use for: static UI components with no dynamic content.
   */
  async matchSnapshot(locator: Locator, snapshotName: string): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await expect(locator).toHaveScreenshot(`${snapshotName}.png`);
  }

  /**
   * Compare the entire page against its stored snapshot.
   * Use for: full-page layout regression checks.
   */
  async matchFullPageSnapshot(snapshotName: string): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await expect(this.page).toHaveScreenshot(`${snapshotName}.png`);
  }

  /**
   * Compare with a pixel-difference threshold (0.0 = exact, 1.0 = ignore all).
   * Use for: cross-OS font rendering differences or anti-aliasing inconsistencies.
   *
   * @param threshold - Acceptable ratio of differing pixels (default: 0.2 = 20%)
   */
  async matchSnapshotWithThreshold(
    locator: Locator,
    snapshotName: string,
    threshold: number = 0.2
  ): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await expect(locator).toHaveScreenshot(`${snapshotName}.png`, { threshold });
  }

  /**
   * Compare while allowing a fixed number of pixels to differ.
   * Use for: large elements where minor rendering shifts are acceptable.
   *
   * @param maxDiffPixels - Maximum number of pixels allowed to differ (default: 100)
   */
  async matchSnapshotWithMaxDiffPixels(
    locator: Locator,
    snapshotName: string,
    maxDiffPixels: number = 100
  ): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await expect(locator).toHaveScreenshot(`${snapshotName}.png`, { maxDiffPixels });
  }

  /**
   * Compare while masking dynamic regions (e.g. price, countdown, avatar).
   * Masked areas are ignored during pixel comparison.
   * Use for: pages with frequently changing content like Decathlon promotions.
   *
   * @param maskLocators - List of locators whose areas will be masked before comparison
   */
  async matchSnapshotAndMask(
    locator: Locator,
    snapshotName: string,
    maskLocators: Locator[]
  ): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await expect(locator).toHaveScreenshot(`${snapshotName}.png`, {
      mask: maskLocators,
    });
  }

  /**
   * Capture a new screenshot to overwrite the existing baseline.
   * Use for: intentional UI changes that require a new baseline image.
   */
  async updateSnapshot(locator: Locator, snapshotName: string): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.screenshot({ path: `snapshots/${snapshotName}.png` });
  }
}