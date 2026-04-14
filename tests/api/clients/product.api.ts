/**
 * ProductApiClient — Decathlon Product API
 * Covers: search, product detail, category listing
 */

import { APIRequestContext } from '@playwright/test';
import { ApiClient } from '../base/ApiClient';
import type { Region } from '@constants/urls';

export interface ApiProduct {
  id: string;
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
}
