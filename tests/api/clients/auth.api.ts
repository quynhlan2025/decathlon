/**
 * AuthApiClient — Login, register, token management
 */

import { APIRequestContext } from '@playwright/test';
import { ApiClient } from '../base/ApiClient';

export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  acceptMarketing?: boolean;
}

export class AuthApiClient extends ApiClient {
  constructor(request: APIRequestContext, baseURL: string) {
    super(request, baseURL);
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    return this.post<LoginResponse>('/api/auth/login', {
      data: { email, password },
    });
  }

  async register(payload: RegisterPayload): Promise<LoginResponse> {
    return this.post<LoginResponse>('/api/auth/register', { data: payload });
  }

  async logout(token: string): Promise<void> {
    await this.post('/api/auth/logout', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async refreshToken(refreshToken: string): Promise<{ token: string; expiresIn: number }> {
    return this.post('/api/auth/refresh', { data: { refreshToken } });
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    return this.post('/api/auth/forgot-password', { data: { email } });
  }

  async verifyToken(token: string): Promise<{ valid: boolean; userId: string }> {
    return this.get('/api/auth/verify', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
