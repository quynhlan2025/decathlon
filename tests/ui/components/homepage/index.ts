/**
 * Homepage components barrel export
 * All homepage section components are exported from here.
 *
 * Architecture: each section is its own component class.
 * Shared pattern components (ProductShelf, ExploreSection) are parameterized
 * so they can represent any named section on the page.
 */

export { HeroBannerComponent }        from './hero-banner.component';
export { PopularSportsComponent }     from './popular-sports.component';
export { TrendingSearchComponent }    from './trending-search.component';
export { CategoryGridComponent }      from './category-grid.component';
export { ProductShelfComponent }      from './product-shelf.component';
export { ExploreSectionComponent }    from './explore-section.component';
export { NewsletterSectionComponent } from './newsletter-section.component';

export type { CategoryCard }          from './category-grid.component';
export type { ShelfProductCard }      from './product-shelf.component';
export type { ExploreCard }           from './explore-section.component';
