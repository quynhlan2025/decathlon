/**
 * HomeSectionsComponent - Các section trên trang chủ
 * Hero banner, Sport cards, Promotions, Newsletter
 */

import { Page, Locator } from '@playwright/test';
import BasePage from '../pages/BasePage';
import type { Region } from '../../constants/urls';

export class HomeSectionsComponent extends BasePage {
  readonly region: Region;

  // ─── Hero / Banner ────────────────────────────────────────────
  readonly heroBanner: Locator;
  readonly heroCTA: Locator;

  // ─── Sport Cards (Trending) ───────────────────────────────────
  readonly trendingSection: Locator;
  readonly sportCards: Locator;

  // ─── Promotions ───────────────────────────────────────────────
  readonly promotionBanners: Locator;

  // ─── Cookie Banner ────────────────────────────────────────────
  readonly cookieBanner: Locator;
  readonly cookieAcceptButton: Locator;

  // ─── Newsletter ───────────────────────────────────────────────
  readonly newsletterInput: Locator;
  readonly newsletterSubmit: Locator;

  // ─── Footer ───────────────────────────────────────────────────
  readonly footer: Locator;

  constructor(page: Page, region: Region = 'VN') {
    super(page);
    this.region = region;

    this.heroBanner = page
      .locator("[data-testid='hero-banner'], [data-cy='hero-banner'], [data-testid='banner']")
      .first();
    this.heroCTA = this.heroBanner.getByRole('link').first();

    this.trendingSection = page
      .locator("[data-testid='imgTextLinksFour-container']")
      .first();
    this.sportCards = this.trendingSection.locator(
      "[data-testid='imgTextLinksFour-sub-container'] [data-testid='imgTextLinkFour-container']"
    );

    this.promotionBanners = page.locator(
      "[data-testid='promotion-banner'], [data-cy='promo-banner']"
    );

    this.cookieBanner = page.locator(
      "[id*='cookie'], [class*='cookie-banner'], [data-testid='cookie-consent']"
    );
    this.cookieAcceptButton = this.cookieBanner.getByRole('button', {
      name: /accept|đồng ý|agree/i,
    });

    this.newsletterInput = page.getByPlaceholder(/email|e-mail/i).last();
    this.newsletterSubmit = page
      .getByRole('button', { name: /subscribe|đăng ký/i })
      .last();

    this.footer = page.locator('footer');
  }

  // ─── Hero ─────────────────────────────────────────────────────

  async isHeroBannerVisible(): Promise<boolean> {
    return await this.heroBanner.isVisible();
  }

  async clickHeroCTA(): Promise<void> {
    await this.click(this.heroCTA);
  }

  // ─── Sport Cards ──────────────────────────────────────────────

  async getSportCardCount(): Promise<number> {
    return await this.sportCards.count();
  }

  async getSportCardNames(): Promise<string[]> {
    const count = await this.sportCards.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = (await this.sportCards.nth(i).textContent()) ?? '';
      names.push(text.trim());
    }
    return names;
  }

  async clickSportCard(index: number): Promise<void> {
    await this.scrollIntoView(this.sportCards.nth(index));
    await this.click(this.sportCards.nth(index));
  }

  async clickSportCardByName(name: string): Promise<void> {
    const card = this.sportCards.filter({ hasText: name }).first();
    await this.scrollIntoView(card);
    await this.click(card);
  }

  // ─── Cookie Banner ────────────────────────────────────────────

  async dismissCookieBanner(): Promise<void> {
    if (await this.cookieBanner.isVisible()) {
      await this.click(this.cookieAcceptButton);
      await this.waitForHidden(this.cookieBanner);
    }
  }

  async isCookieBannerVisible(): Promise<boolean> {
    return await this.cookieBanner.isVisible();
  }

  // ─── Newsletter ───────────────────────────────────────────────

  async subscribeNewsletter(email: string): Promise<void> {
    await this.scrollIntoView(this.newsletterInput);
    await this.sendText(this.newsletterInput, email);
    await this.click(this.newsletterSubmit);
  }

  // ─── Promotions ───────────────────────────────────────────────

  async getPromotionCount(): Promise<number> {
    return await this.promotionBanners.count();
  }

  // ─── Footer ───────────────────────────────────────────────────

  async isFooterVisible(): Promise<boolean> {
    await this.scrollToBottom();
    return await this.footer.isVisible();
  }
}
