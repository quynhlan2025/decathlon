/**
 * Routes — centralized URL paths (UI routes, not full URLs)
 * Complements constants/urls.ts which stores baseURLs.
 * Region-specific paths are in PATHS (urls.ts); this file covers shared routes.
 */

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  ACCOUNT: '/account',
  ACCOUNT_ORDERS: '/account/orders',
  ACCOUNT_PROFILE: '/account/profile',
  ACCOUNT_ADDRESSES: '/account/addresses',
  WISHLIST: '/wishlist',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_CONFIRMATION: '/order-confirmation',
  SEARCH: '/search',
  STORE_LOCATOR: '/stores',
  TRACK_ORDER: '/track-order',
  RETURN_EXCHANGE: '/returns',
  DELIVERY_INFO: '/delivery',
  HELP: '/help',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
