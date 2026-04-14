/**
 * CartApiClient — Cart & wishlist API operations
 */

import { APIRequestContext } from '@playwright/test';
import { ApiClient } from '../base/ApiClient';
import type { Region } from '@constants/urls';

export interface ApiCartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  name: string;
}

export interface ApiCart {
  id: string;
  items: ApiCartItem[];
  subtotal: number;
  total: number;
  currency: string;
  itemCount: number;
}

export class CartApiClient extends ApiClient {
  private readonly region: Region;

  constructor(request: APIRequestContext, baseURL: string, region: Region) {
    super(request, baseURL);
    this.region = region;
  }

  async getCart(cartId: string): Promise<ApiCart> {
    return this.get<ApiCart>(`/api/cart/${cartId}`);
  }

  async addItem(cartId: string, productId: string, quantity = 1, variantId?: string): Promise<ApiCart> {
    return this.post<ApiCart>(`/api/cart/${cartId}/items`, {
      data: { productId, quantity, variantId },
    });
  }

  async updateItemQuantity(cartId: string, itemId: string, quantity: number): Promise<ApiCart> {
    return this.patch<ApiCart>(`/api/cart/${cartId}/items/${itemId}`, {
      data: { quantity },
    });
  }

  async removeItem(cartId: string, itemId: string): Promise<ApiCart> {
    await this.delete(`/api/cart/${cartId}/items/${itemId}`);
    return this.getCart(cartId);
  }

  async clearCart(cartId: string): Promise<void> {
    await this.delete(`/api/cart/${cartId}`);
  }

  async createCart(): Promise<ApiCart> {
    return this.post<ApiCart>('/api/cart', {
      data: { region: this.region.toLowerCase() },
    });
  }
}
