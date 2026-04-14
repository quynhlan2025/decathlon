/**
 * OrderApiClient — Order placement and tracking
 */

import { APIRequestContext } from '@playwright/test';
import { ApiClient } from '../base/ApiClient';
import type { Region } from '@constants/urls';

export interface OrderItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  name: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  city: string;
  postalCode?: string;
  province?: string;   // VN
  district?: string;   // VN
  ward?: string;       // VN
  country: string;
}

export interface CreateOrderPayload {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'COD' | 'CREDIT_CARD' | 'PAYNOW';
  couponCode?: string;
}

export interface ApiOrder {
  orderId: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  createdAt: string;
  estimatedDelivery?: string;
}

export class OrderApiClient extends ApiClient {
  private readonly region: Region;

  constructor(request: APIRequestContext, baseURL: string, region: Region) {
    super(request, baseURL);
    this.region = region;
  }

  async createOrder(payload: CreateOrderPayload): Promise<ApiOrder> {
    return this.post<ApiOrder>('/api/orders', {
      data: { ...payload, region: this.region.toLowerCase() },
    });
  }

  async getOrder(orderId: string): Promise<ApiOrder> {
    return this.get<ApiOrder>(`/api/orders/${orderId}`);
  }

  async getOrderByNumber(orderNumber: string): Promise<ApiOrder> {
    return this.get<ApiOrder>(`/api/orders/by-number/${orderNumber}`);
  }

  async getUserOrders(userId: string, page = 1): Promise<ApiOrder[]> {
    return this.get<ApiOrder[]>(`/api/users/${userId}/orders`, {
      params: { page },
    });
  }

  async cancelOrder(orderId: string, reason: string): Promise<void> {
    await this.post(`/api/orders/${orderId}/cancel`, { data: { reason } });
  }

  async trackOrder(orderNumber: string): Promise<{ status: string; events: unknown[] }> {
    return this.get(`/api/orders/track/${orderNumber}`);
  }
}
