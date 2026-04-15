/**
 * ProductApiClient — Decathlon Product API
 * Covers: search, product detail, category listing
 */

import { APIRequestContext } from '@playwright/test';
import { ApiClient } from '../base/ApiClient';
import type { Region } from '@constants/urls';

export interface ApiProduct {
  id: string;
  slug?: string;
  url?: string;
  name: string;
  price: number;
  currency: string;
  category: string;
  brand: string;
  inStock: boolean;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
}

export interface SearchApiResponse {
  products: ApiProduct[];
  total: number;
  page: number;
  pageSize: number;
  query: string;
}

export interface CategoryApiResponse {
  products: ApiProduct[];
  total: number;
  categoryName: string;
  filters: Record<string, string[]>;
}

export class ProductApiClient extends ApiClient {
  private readonly region: Region;

  constructor(request: APIRequestContext, baseURL: string, region: Region) {
    super(request, baseURL);
    this.region = region;
  }

  async searchProducts(query: string, page = 1, pageSize = 20): Promise<SearchApiResponse> {
    return this.get<SearchApiResponse>('/api/search', {
      params: { q: query, page, pageSize, region: this.region.toLowerCase() },
    });
  }

  async getProduct(productId: string): Promise<ApiProduct> {
    return this.get<ApiProduct>(`/api/products/${productId}`);
  }

  async getCategoryProducts(
    categorySlug: string,
    options: { page?: number; pageSize?: number; sortBy?: string } = {}
  ): Promise<CategoryApiResponse> {
    return this.get<CategoryApiResponse>(`/api/categories/${categorySlug}/products`, {
      params: {
        page: options.page ?? 1,
        pageSize: options.pageSize ?? 20,
        sortBy: options.sortBy ?? 'relevance',
      },
    });
  }

  async getRecommendedProducts(productId: string): Promise<ApiProduct[]> {
    return this.get<ApiProduct[]>(`/api/products/${productId}/recommendations`);
  }

  /**
   * Xây URL sản phẩm từ slug + id.
   * VN: /vn/p/{slug}-{id}.html
   * SG: /p/{slug}-{id}.html
   */
  buildProductUrl(product: ApiProduct): string {
    // Ưu tiên dùng url trả về từ API nếu có
    if (product.url) return product.url;

    const slug = product.slug ?? product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const prefix = this.region === 'VN' ? '/vn' : '';
    return `${prefix}/p/${slug}-${product.id}.html`;
  }

  /**
   * Lấy 1 sản phẩm ngẫu nhiên đang còn hàng từ API.
   * @param keyword  - từ khoá tìm kiếm (mặc định: 'running')
   * @param pageSize - số sản phẩm lấy để random (mặc định: 20)
   */
  async getRandomInStockProduct(keyword = 'running', pageSize = 20): Promise<ApiProduct & { productUrl: string }> {
    const response = await this.searchProducts(keyword, 1, pageSize);
    const inStock = response.products.filter((p) => p.inStock);

    if (!inStock.length) {
      throw new Error(`No in-stock products found for keyword "${keyword}" in region ${this.region}`);
    }

    const product = inStock[Math.floor(Math.random() * inStock.length)];
    return { ...product, productUrl: this.buildProductUrl(product) };
  }
}
