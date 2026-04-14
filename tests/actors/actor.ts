/**
 * Actor — Abstract base: represents a user role in the system
 * Holds page reference, region, and shared pages (home, chat).
 */

import { Page } from '@playwright/test';
import { HomePage } from '@ui/pages/home.page';
import { ChatComponent } from '@ui/components/chat.component';
import type { Region } from '@constants/urls';

export abstract class Actor {
  protected readonly page: Page;
  protected readonly region: Region;
  protected readonly homePage: HomePage;

  constructor(page: Page, region: Region) {
    this.page = page;
    this.region = region;
    this.homePage = new HomePage(page, region);
  }

  getHomePage(): HomePage   { return this.homePage; }
  getChat(): ChatComponent  { return new ChatComponent(this.page); }
  getPage(): Page           { return this.page; }
  getRegion(): Region       { return this.region; }
}
