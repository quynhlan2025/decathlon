/**
 * Centralized Selector Constants
 * Prevents selector duplication across page objects.
 * Update one place → all POs pick up the change.
 */

export const SEL = {
  // ─── Layout ─────────────────────────────────────────────────
  NAVBAR: "nav, [data-testid='navbar']",
  FOOTER: 'footer',
  HERO_BANNER: "[data-testid='hero-banner'], [data-cy='hero-banner']",
  COOKIE_BANNER: "[id*='cookie'], [class*='cookie-banner'], [data-testid='cookie-consent']",
  BREADCRUMB: "[data-testid='breadcrumb'], [aria-label='breadcrumb'], nav[class*='breadcrumb']",
  TOAST: "[data-testid='toast'], [class*='toast'], [role='alert']",

  // ─── Search ──────────────────────────────────────────────────
  SEARCH_BAR: "[data-cy='search-bar-desktop']",
  SEARCH_INPUT: "[data-cy='search-bar-desktop'] input",
  SEARCH_SUGGESTIONS: "[data-testid='search-suggestions']",
  SEARCH_RESULTS_COUNT: "[class*='result-count'], [class*='nb-hits']",
  NO_RESULTS: "[data-testid='no-results'], [class*='no-results']",

  // ─── Navigation ──────────────────────────────────────────────
  NAV_MENU: "[data-testid='nav-menu'] > li, nav > ul > li",
  NAV_L1_PANEL: "[data-testid='nav-l1-panel']",
  NAV_L2_PANEL: "[data-testid='nav-l2-panel']",
  NAV_L3_PANEL: "[data-testid='nav-l3-panel']",
  LOGO: "[aria-label*='Decathlon'], [data-testid='logo']",
  CART_ICON: "[data-testid='cart-icon'], [aria-label*='cart' i]",
  ACCOUNT_ICON: "[data-testid='account-icon'], [aria-label*='account' i]",
  WISHLIST_ICON: "[data-testid='wishlist-icon'], [aria-label*='wishlist' i]",
  CART_BADGE: "[data-testid='cart-count'], [class*='cart-badge']",

  // ─── Category / PLP ──────────────────────────────────────────
  CATEGORY_TITLE: 'h1',
  PRODUCT_GRID: "[data-testid='productHit-tilesbox-container'], [class*='product-grid']",
  PRODUCT_CARD: "[data-testid='productHit-tilesbox-gridcell'], [data-testid='product-card']",
  PRODUCT_CARD_NAME: "[data-testid='product-name'], [class*='product-name']",
  PRODUCT_CARD_PRICE: "[data-testid='product-price'], [data-testid='product-price-wrapper']",
  DISCOUNT_BADGE: "[data-testid='discount-badge'], [class*='discount']",

  // ─── Filter ──────────────────────────────────────────────────
  FILTER_PANEL: "[data-testid='filter-panel'], [data-cy='filter-sidebar'], aside[class*='filter']",
  FILTER_ACTIVE_TAG: "[data-testid='active-filter'], [class*='filter-tag']",
  SORT_SELECT: "[data-testid='sort-select'], select[name*='sort' i]",
  PAGINATION: "[data-testid='pagination'], [class*='pagination']",

  // ─── PDP ─────────────────────────────────────────────────────
  PDP_PRODUCT_NAME: "[data-testid='product-name'], h1",
  PDP_PRICE: "[data-testid='product-price-wrapper']",
  PDP_SIZE_SELECT: "[aria-label*='size' i], select[name*='size' i]",
  PDP_ADD_TO_CART: "[data-cy='pdp-cta-btn-tablet-desktop']",
  PDP_STOCK_MSG: "[data-testid='stock-message']",
  PDP_IMAGES: "[data-testid='product-images'] img",
  PDP_RATING: "[data-testid='rating'], [class*='rating-stars']",
  PDP_REVIEW_COUNT: "[data-testid='review-count']",
  PDP_DESCRIPTION: "[data-testid='product-description']",
  PDP_RELATED: "[data-testid='related-products']",
  PDP_BREADCRUMB: "[data-testid='breadcrumb']",

  // ─── Cart ────────────────────────────────────────────────────
  CART_ITEM: "[data-testid='cart-item'], [data-cy='cart-item']",
  CART_ITEM_NAME: "[data-testid='cart-item-name']",
  CART_ITEM_PRICE: "[data-testid='cart-item-price']",
  CART_ITEM_QTY: "[data-testid='cart-item-qty'], input[name*='qty' i]",
  CART_ITEM_REMOVE: "[data-testid='cart-item-remove'], [aria-label*='remove' i]",
  CART_TOTAL: "[data-testid='cart-total'], [data-cy='cart-total']",
  CART_EMPTY: "[data-testid='empty-cart']",
  CART_SUBTOTAL: "[data-testid='cart-subtotal']",

  // ─── Checkout ────────────────────────────────────────────────
  CHECKOUT_FULL_NAME: "[name='fullName'], [id*='fullName']",
  CHECKOUT_PHONE: "[name='phone'], [id*='phone']",
  CHECKOUT_EMAIL: "[name='email'], [id*='email']",
  CHECKOUT_PAYMENT: "[data-testid='payment-methods'], #payment-methods",
  ORDER_SUMMARY: "[data-testid='order-summary'], [data-cy='order-summary']",
  ORDER_CONFIRMATION: "[data-testid='order-confirmation']",
  ORDER_NUMBER: "[data-testid='order-number']",

  // ─── Auth ────────────────────────────────────────────────────
  LOGIN_EMAIL: "[name='email'], [id*='email']",
  LOGIN_PASSWORD: "[name='password'], [id*='password']",
  LOGIN_SUBMIT: "[type='submit'], button[name*='login' i]",
  LOGIN_ERROR: "[role='alert'], [class*='error-message']",
  REGISTER_FIRST_NAME: "[name='firstName'], [id*='firstName']",
  REGISTER_LAST_NAME: "[name='lastName'], [id*='lastName']",

  // ─── Account ─────────────────────────────────────────────────
  ACCOUNT_NAV: "[data-testid='account-nav'], [class*='account-menu']",
  ACCOUNT_ORDER_LIST: "[data-testid='order-list'], [class*='order-history']",
  ACCOUNT_ORDER_ITEM: "[data-testid='order-item'], [class*='order-item']",
  WISHLIST_ITEM: "[data-testid='wishlist-item'], [class*='wishlist-item']",

  // ─── Trending / Home ─────────────────────────────────────────
  TRENDING_SECTION: "[data-testid='imgTextLinksFour-container']",
  SPORT_CARD: "[data-testid='imgTextLinkFour-container']",
  PROMOTION_BANNER: "[data-testid='promotion-banner'], [data-cy='promo-banner']",
} as const;

export type SelectorKey = keyof typeof SEL;
