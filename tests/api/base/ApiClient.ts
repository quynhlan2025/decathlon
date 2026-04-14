/**
 * ApiClient — base HTTP client for API-layer tests
 * Wraps Playwright's APIRequestContext for consistent:
 *   - Base URL injection
 *   - Auth header management
 *   - Response validation
 *   - Error reporting
 */

import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { logger } from '@utils/logger';

export interface RequestOptions {
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  data?: unknown;
  timeout?: number;
}

export class ApiClient {
  constructor(
    protected readonly request: APIRequestContext,
    protected readonly baseURL: string
  ) {}

  // ─── HTTP Methods ─────────────────────────────────────────────

  async get<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
    const fullUrl = this.url(path);
    logger.debug('ApiClient', `GET ${fullUrl}`, options.params);
    const response = await this.request.get(fullUrl, {
      params: options.params as Record<string, string>,
      headers: options.headers,
      timeout: options.timeout ?? 30_000,
    });
    return this.parse<T>(response, 'GET', path);
  }

  async post<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
    const response = await this.request.post(this.url(path), {
      data: options.data,
      headers: options.headers,
      timeout: options.timeout ?? 30_000,
    });
    return this.parse<T>(response, 'POST', path);
  }

  async put<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
    const response = await this.request.put(this.url(path), {
      data: options.data,
      headers: options.headers,
      timeout: options.timeout ?? 30_000,
    });
    return this.parse<T>(response, 'PUT', path);
  }

  async patch<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
    const response = await this.request.patch(this.url(path), {
      data: options.data,
      headers: options.headers,
      timeout: options.timeout ?? 30_000,
    });
    return this.parse<T>(response, 'PATCH', path);
  }

  async delete(path: string, options: RequestOptions = {}): Promise<void> {
    const response = await this.request.delete(this.url(path), {
      headers: options.headers,
      timeout: options.timeout ?? 30_000,
    });
    await expect(response).toBeOK();
  }

  // ─── Assertion helpers ────────────────────────────────────────

  async expectStatus(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    path: string,
    expectedStatus: number,
    options: RequestOptions = {}
  ): Promise<APIResponse> {
    const response = await this.request[method.toLowerCase() as 'get'](this.url(path), {
      data: options.data,
      headers: options.headers,
    });
    expect(response.status(), `Expected ${method} ${path} to return ${expectedStatus}`).toBe(
      expectedStatus
    );
    return response;
  }

  // ─── Private ─────────────────────────────────────────────────

  private url(path: string): string {
    return `${this.baseURL}${path.startsWith('/') ? '' : '/'}${path}`;
  }

  private async parse<T>(response: APIResponse, method: string, path: string): Promise<T> {
    if (!response.ok()) {
      const body = await response.text().catch(() => '(unreadable)');
      throw new Error(
        `API ${method} ${path} failed: ${response.status()} ${response.statusText()}\n${body}`
      );
    }
    return (await response.json()) as T;
  }
}
