/**
 * Product Test Data
 * URLs và shortcuts đã chuyển sang ProductFactory.getRandomProduct(region, category).
 * File này chỉ giữ SEARCH_KEYWORDS dùng cho search tests.
 */

export const SEARCH_KEYWORDS = {
  valid: ['yoga', 'running', 'bike', 'swimming', 'tennis'],
  noResults: ['xyzxyz123nonexistent', 'aaabbbccc999'],
  withSpaces: ['  running shoes  ', ' yoga mat '],
} as const;
