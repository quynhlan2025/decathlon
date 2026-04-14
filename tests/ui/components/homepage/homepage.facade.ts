/**
 * HomepageFacade — Composes all homepage section components into one entry point.
 *
 * Usage in tests:
 *   const hp = new HomepageFacade(page);
 *   await hp.popularSports.isVisible();
 *   await hp.shelf('Best Sellers').getProductCount();
 *   await hp.explore('Explore Outdoor Sports').allCardsHaveImages();
 *
 * Section inventory (Decathlon SG/VN homepage):
 *   1. Hero Banner           — large + medium + 2 small banners
 *   2. Popular Sports        — sport category carousel
 *   3. Trending Search       — keyword chips (Algolia)
 *   4. Category Grid         — Shop by Category (4-6 col grid)
 *   5. Product Shelves       — Best Sellers, New Arrivals, On Sale (dynamic)
 *   6. Explore Sections      — Explore Outdoor Sports, campaign editorials
 *   7. Newsletter            — email signup
 */

import { Page } from '@playwright/test';
import { HeroBannerComponent }        from './hero-banner.component';
import { PopularSportsComponent }     from './popular-sports.component';
import { TrendingSearchComponent }    from './trending-search.component';
import { CategoryGridComponent }      from './category-grid.component';
import { ProductShelfComponent }      from './product-shelf.component';
import { ExploreSectionComponent }    from './explore-section.component';
import { NewsletterSectionComponent } from './newsletter-section.component';

// Known shelf section names — match productslistfloor-headline text on SG/VN
export const SHELF_SECTIONS = {
  BEST_SELLERS:   'Our Best Sellers',
  NEW_ARRIVALS:   'New Arrivals',
  ON_SALE:        'On Sale',
  PRICE_DROP:     'Price Drop',
  CYCLING:        'Cycling',
  RUNNING:        'Running',
  SWIMMING:       'Swimming',
  FOOTBALL:       'Football',
} as const;

// Known explore/editorial section names — match contentMainCard-headline on SG/VN
export const EXPLORE_SECTIONS = {
  DISCOVER:       'Discover Decathlon',
  OUTDOOR_SPORTS: 'Explore Outdoor Sports',
  BICYCLES:       'Bicycles',
  HIKING:         'Hiking',
  TEAM_SPORTS:    'Team Sports',
} as const;

export class HomepageFacade {
  readonly page: Page;

  readonly heroBanner:     HeroBannerComponent;
  readonly popularSports:  PopularSportsComponent;
  readonly trendingSearch: TrendingSearchComponent;
  readonly categoryGrid:   CategoryGridComponent;
  readonly newsletter:     NewsletterSectionComponent;

  // Cache for parameterized components
  private _shelves  = new Map<string, ProductShelfComponent>();
  private _explores = new Map<string, ExploreSectionComponent>();

  constructor(page: Page) {
    this.page           = page;
    this.heroBanner     = new HeroBannerComponent(page);
    this.popularSports  = new PopularSportsComponent(page);
    this.trendingSearch = new TrendingSearchComponent(page);
    this.categoryGrid   = new CategoryGridComponent(page);
    this.newsletter     = new NewsletterSectionComponent(page);
  }

  /** Get (or create) a ProductShelfComponent for a named section. */
  shelf(sectionName: string): ProductShelfComponent {
    if (!this._shelves.has(sectionName)) {
      this._shelves.set(sectionName, new ProductShelfComponent(this.page, sectionName));
    }
    return this._shelves.get(sectionName)!;
  }

  /** Get (or create) an ExploreSectionComponent for a named section. */
  explore(sectionName: string): ExploreSectionComponent {
    if (!this._explores.has(sectionName)) {
      this._explores.set(sectionName, new ExploreSectionComponent(this.page, sectionName));
    }
    return this._explores.get(sectionName)!;
  }
}
