/**
 * Test Data - Data-driven
 * Tài khoản login, thông điệp chat, text đa ngôn ngữ
 * Hỗ trợ region: VN | SG
 */

export const TEST_ACCOUNTS = {
  VN: {
    seller: { email: 'seller.vn@test.com', password: 'seller123' },
    buyer: { email: 'buyer.vn@test.com', password: 'buyer123' },
  },
  SG: {
    seller: { email: 'seller.sg@test.com', password: 'seller123' },
    buyer: { email: 'buyer.sg@test.com', password: 'buyer123' },
  },
} as const;

export const CHAT_MESSAGES = {
  vi: {
    greeting: 'Xin chào, tôi cần hỗ trợ',
    thanks: 'Cảm ơn bạn!',
  },
  en: {
    greeting: 'Hello, I need support',
    thanks: 'Thank you!',
  },
} as const;

export const SECTION_TITLES = {
  bestSellers: 'Best Sellers',
  newArrivals: 'New Arrivals',
  popularSports: 'Popular Sports',
} as const;

export const TIMEOUTS = {
  TINY: 2000, // Dành cho các thành phần UI cực nhanh
  SHORT: 5000, // Mặc định cho click, hover
  MEDIUM: 10000, // Dành cho việc load trang, chuyển hướng
  LONG: 30000, // Dành cho xử lý dữ liệu nặng hoặc CI/CD
} as const;
