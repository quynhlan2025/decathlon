/**
 * ProductFactory — Product URLs and data per region
 * Maps test products to their Decathlon prod URLs
 */

import type { Region } from '@constants/urls';

export interface TestProduct {
  url: string;
  name: string;
  category: 'running' | 'cycling' | 'swimming' | 'yoga' | 'basketball' | 'football';
  hasSizeSelector: boolean;
  expectedPricePattern: RegExp;
  inStock: boolean;
}

export const TEST_PRODUCTS: Record<Region, TestProduct[]> = {
  VN: [
    {
      url: '/vn/p/ao-phong-the-thao-nam-essential-club-decathlon-8795890.html',
      name: 'Áo Phong Nam Essential',
      category: 'running',
      hasSizeSelector: true,
      expectedPricePattern: /\d+/,
      inStock: true,
    },
    {
      url: '/vn/p/quan-chay-bo-nam-kalenji-8398565.html',
      name: 'Quần Chạy Bộ Nam',
      category: 'running',
      hasSizeSelector: true,
      expectedPricePattern: /\d+/,
      inStock: true,
    },
    {
      url: '/vn/p/xe-dap-the-thao-btwin-8577109.html',
      name: 'Xe Đạp Thể Thao',
      category: 'cycling',
      hasSizeSelector: false,
      expectedPricePattern: /\d+/,
      inStock: true,
    },
  ],
  SG: [
    {
      url: '/p/mountain-bike-expl50-v2-3x7-speed-27-5-inch-blue-mtb-rockrider-9002812.html',
      name: 'Mountain Bike EXPL50 V2',
      category: 'cycling',
      hasSizeSelector: true,
      expectedPricePattern: /\$\d+/,
      inStock: true,
    },
  ],
};

export class ProductFactory {
  static getProduct(region: Region, index = 0): TestProduct {
    const products = TEST_PRODUCTS[region];
    return products[index % products.length];
  }

  static getByCategory(
    region: Region,
    category: TestProduct['category']
  ): TestProduct | undefined {
    return TEST_PRODUCTS[region].find((p) => p.category === category);
  }

  static getAll(region: Region): TestProduct[] {
    return TEST_PRODUCTS[region];
  }

  /**
   * Trả về sản phẩm ngẫu nhiên theo region.
   * Nếu truyền category, lọc theo category trước rồi random.
   * Fallback về toàn bộ pool nếu category không có sản phẩm.
   */
  static getRandomProduct(region: Region, category?: TestProduct['category']): TestProduct {
    const pool = category
      ? TEST_PRODUCTS[region].filter((p) => p.category === category)
      : TEST_PRODUCTS[region];
    const source = pool.length > 0 ? pool : TEST_PRODUCTS[region];
    return source[Math.floor(Math.random() * source.length)];
  }
}
