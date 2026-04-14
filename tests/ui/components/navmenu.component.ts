/**
 * NavMenuComponent - Mega menu navigation (L1 → L2 → L3)
 * TODO: implement selectors khi có HTML structure thực tế
 */

import { Page, Locator } from '@playwright/test';
import BasePage from '../pages/BasePage';

export class NavMenuComponent extends BasePage {
  readonly menuItems: Locator;

  constructor(page: Page) {
    super(page);
    this.menuItems = page.locator("[data-testid='nav-menu'] > li, nav > ul > li");
  }

  async navigateNavToL1ThenL2ThenL3(
    navIndex: number,
    l1Index: number,
    l2Index: number,
    l3Index: number
  ): Promise<void> {
    // Hover L1
    await this.menuItems.nth(navIndex).hover();

    // Click L1 panel item
    const l1Panel = this.page.locator("[data-testid='nav-l1-panel']");
    await this.click(l1Panel.locator('a, li').nth(l1Index));

    // Click L2 panel item
    const l2Panel = this.page.locator("[data-testid='nav-l2-panel']");
    await this.click(l2Panel.locator('a, li').nth(l2Index));

    // Click L3 panel item
    const l3Panel = this.page.locator("[data-testid='nav-l3-panel']");
    await this.click(l3Panel.locator('a, li').nth(l3Index));
  }
}
