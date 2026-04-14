/**
 * Bản đồ link - Data-driven URLs
 * HOME, CATEGORIES, ADMIN
 * Hỗ trợ môi trường: dev | prod
 * Hỗ trợ region: VN | SG
 */

export type Region = 'VN' | 'SG';
export type Environment = 'dev' | 'prod';

export interface UrlConfig {
  baseURL: string;
  locale: string;
}

export interface RegionPaths {
  HOME: string;
  LOGIN: string;
  ACCOUNT: string;
  SEARCH: string;
  CATEGORIES: {
    RUNNING: string;
    SPORTSWEAR: string;
    CYCLING: string;
  };
  ADMIN: string;
}

const URL_MAP: Record<Environment, Record<Region, UrlConfig>> = {
  dev: {
    VN: { baseURL: 'https://dev.decathlon.vn', locale: 'vi-VN' },
    SG: { baseURL: 'https://dev.decathlon.sg', locale: 'en-SG' },
  },
  prod: {
    VN: { baseURL: 'https://www.decathlon.vn', locale: 'vi-VN' },
    SG: { baseURL: 'https://www.decathlon.sg', locale: 'en-SG' },
  },
};

/** Lấy config theo env (mặc định prod) và region */
export function getUrlConfig(
  region: Region,
  env: Environment = (process.env.ENV as Environment) || 'prod'
): UrlConfig {
  return URL_MAP[env][region];
}

/** Giữ tương thích - URL_CONFIGS cho prod */
export const URL_CONFIGS: Record<Region, UrlConfig> = URL_MAP.prod;

/** Region-aware paths */
export const PATHS: Record<Region, RegionPaths> = {
  VN: {
    HOME: '/',
    LOGIN: '/login',
    ACCOUNT: '/account',
    SEARCH: '/search',
    CATEGORIES: {
      RUNNING: '/vn/c0/ban-chay',
      SPORTSWEAR: '/vn/c0/ao-quan-the-thao',
      CYCLING: '/vn/c0/xe-dap',
    },
    ADMIN: '/admin',
  },
  SG: {
    HOME: '/',
    LOGIN: '/login',
    ACCOUNT: '/account',
    SEARCH: '/search',
    CATEGORIES: {
      RUNNING: '/sg/c0/running',
      SPORTSWEAR: '/sg/c0/sports-apparel',
      CYCLING: '/sg/c0/cycling',
    },
    ADMIN: '/admin',
  },
};

export function getPaths(region: Region): RegionPaths {
  return PATHS[region];
}
