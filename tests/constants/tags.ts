/**
 * Test Tag Taxonomy
 *
 * Usage in test:
 *   test('TC-SRCH-001: valid search @smoke @p1', ...)
 *
 * Run subsets:
 *   npx playwright test --grep @smoke
 *   npx playwright test --grep "@p1|@p0"
 *   npx playwright test --grep-invert @visual
 */

export const TAGS = {
  // ─── Priority ─────────────────────────────────────────────
  P0: '@p0',          // Production blocking — must pass before deploy
  P1: '@p1',          // Critical path — run on every PR
  P2: '@p2',          // Important — run nightly
  P3: '@p3',          // Edge cases — run on release

  // ─── Suite ────────────────────────────────────────────────
  SMOKE: '@smoke',              // ~50 tests, < 5 min
  REGRESSION: '@regression',   // Full suite ~1000+ tests
  SANITY: '@sanity',            // Post-deploy quick check

  // ─── Feature ──────────────────────────────────────────────
  SEARCH: '@search',
  CART: '@cart',
  CHECKOUT: '@checkout',
  AUTH: '@auth',
  ACCOUNT: '@account',
  PRODUCT: '@product',
  CATEGORY: '@category',
  NAVIGATION: '@navigation',
  HOMEPAGE: '@homepage',
  WISHLIST: '@wishlist',
  FOOTER: '@footer',
  STORE: '@store',

  // ─── Type ─────────────────────────────────────────────────
  VISUAL: '@visual',
  API: '@api',
  A11Y: '@a11y',
  PERFORMANCE: '@performance',
  MOBILE: '@mobile',
  RESPONSIVE: '@responsive',

  // ─── Region ───────────────────────────────────────────────
  VN_ONLY: '@vn-only',
  SG_ONLY: '@sg-only',

  // ─── State ────────────────────────────────────────────────
  LOGGED_IN: '@logged-in',
  GUEST: '@guest',
  SKIP_CI: '@skip-ci',
} as const;

export type Tag = (typeof TAGS)[keyof typeof TAGS];
