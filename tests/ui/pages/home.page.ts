/**
 * HomePage - Region-aware home page
 * Supports VN (decathlon.vn) & SG (decathlon.sg)
 *
 * Accessing homepage sections in tests:
 *   pages.home.hp.heroBanner        → HeroBannerComponent
 *   pages.home.hp.popularSports     → PopularSportsComponent
 *   pages.home.hp.trendingSearch    → TrendingSearchComponent
 *   pages.home.hp.categoryGrid      → CategoryGridComponent
 *   pages.home.hp.newsletter        → NewsletterSectionComponent
 *   pages.home.hp.shelf('Best Sellers') → ProductShelfComponent
 *   pages.home.hp.explore('Outdoor')    → ExploreSectionComponent
 */

import { Page } from '@playwright/test';
import BasePageObject from './BasePageObject';
import { SearchComponent } from '../components/search.component';
import { NavbarComponent } from '../components/navbar.component';
import { NavMenuComponent } from '../components/navmenu.component';
import { FooterComponent } from '../components/footer.component';
import { HomepageFacade } from '../components/homepage/homepage.facade';
import { PATHS, type Region, type RegionPaths } from '@constants/urls';

export class HomePage extends BasePageObject {
  readonly search: SearchComponent;
  readonly navbar: NavbarComponent;
  readonly footer: FooterComponent;
  /** Main entry point for all homepage section components */
  readonly hp: HomepageFacade;

  private readonly region: Region;
  private readonly paths: RegionPaths;

  constructor(page: Page, region: Region = 'VN') {
    super(page);
    this.region = region;
    this.paths  = PATHS[region];
    this.search = new SearchComponent(page);
    this.navbar = new NavbarComponent(page);
    this.footer = new FooterComponent(page);
    this.hp     = new HomepageFacade(page);
  }

  async goto(): Promise<void> {
    await this.navigate(this.paths.HOME);
  }

  /** Alias for goto() - backwards compat */
  async open(): Promise<void> {
    await this.goto();
  }

  async gotoCategory(category: keyof RegionPaths['CATEGORIES']): Promise<void> {
    await this.navigate(this.paths.CATEGORIES[category]);
  }

  /** Backwards compat for search.spec.ts */
  getSearchComponent(): SearchComponent {
    return this.search;
  }

  getNavMenu(): NavMenuComponent {
    return new NavMenuComponent(this.page);
  }

  getRegion(): Region {
    return this.region;
  }
}
