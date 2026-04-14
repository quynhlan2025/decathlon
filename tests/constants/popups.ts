/**
 * Regional Popup Configuration
 * Tập trung tất cả popup/modal config theo region.
 * PopupHandler đọc file này để auto-dismiss trước mỗi test.
 *
 * Thêm popup mới: chỉ cần thêm entry vào đây — không sửa test.
 */

export type PopupTrigger =
  | 'always'     // xuất hiện mỗi lần load
  | 'once'       // xuất hiện lần đầu (cookie, newsletter)
  | 'campaign';  // xuất hiện theo campaign/ngày đặc biệt

export interface PopupConfig {
  /** Tên popup để log */
  name: string;
  /** CSS selector của nút đóng popup */
  selector: string;
  /** Khi nào popup xuất hiện */
  trigger: PopupTrigger;
  /** Chỉ xuất hiện trên các path này (undefined = mọi trang) */
  pages?: string[];
  /** Timeout chờ popup xuất hiện (ms) — default 1500 */
  timeout?: number;
}

export const REGIONAL_POPUPS: Record<'VN' | 'SG', PopupConfig[]> = {

  // ─── VN Popups ──────────────────────────────────────────────
  VN: [
    {
      name: 'cookie-banner',
      selector: [
        '[data-testid="cookie-accept"]',
        'button:has-text("Đồng ý")',
        'button:has-text("Chấp nhận")',
        '#cookie-accept',
      ].join(', '),
      trigger: 'once',
    },
    {
      name: 'promo-campaign-popup',      // popup giảm giá 4/4, Tết, 11/11...
      selector: [
        '[data-testid="promo-popup-close"]',
        '[data-testid="campaign-popup-close"]',
        '.promo-modal [aria-label="close"]',
        '.promo-modal .btn-close',
        '.campaign-modal .close',
        'button:has-text("Đóng")',
        '[aria-label="Đóng"]',
      ].join(', '),
      trigger: 'campaign',
      pages: ['/'],
      timeout: 2000,
    },
    {
      name: 'newsletter-popup',
      selector: [
        '.newsletter-modal [aria-label="close"]',
        '.newsletter-modal .btn-close',
        '[data-testid="newsletter-close"]',
      ].join(', '),
      trigger: 'once',
      pages: ['/'],
    },
    {
      name: 'app-download-banner',
      selector: [
        '[data-testid="app-banner-close"]',
        '.app-banner .close',
        '.smart-banner .close',
      ].join(', '),
      trigger: 'always',
    },
    {
      name: 'login-prompt-popup',        // popup gợi đăng nhập khi add to cart
      selector: [
        '[data-testid="login-prompt-close"]',
        '.login-prompt .close',
      ].join(', '),
      trigger: 'once',
    },
  ],

  // ─── SG Popups ──────────────────────────────────────────────
  SG: [
    {
      name: 'cookie-banner',
      selector: [
        '[data-testid="cookie-accept"]',
        'button:has-text("Accept All")',
        'button:has-text("Accept")',
        '#onetrust-accept-btn-handler',
      ].join(', '),
      trigger: 'once',
    },
    {
      name: 'newsletter-popup',
      selector: [
        '.newsletter-modal [aria-label="close"]',
        '.newsletter-modal .btn-close',
        '[data-testid="newsletter-close"]',
      ].join(', '),
      trigger: 'once',
      pages: ['/'],
    },
    {
      name: 'geolocation-prompt',        // SG có popup chọn country
      selector: [
        '[data-testid="geo-popup-close"]',
        '.country-selector .close',
        'button:has-text("Stay on Singapore")',
      ].join(', '),
      trigger: 'once',
    },
    // SG không có promo-campaign-popup 4/4
  ],
};
