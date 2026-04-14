/**
 * Logger — lightweight structured logger for test framework
 * Wraps console with level filtering and optional test context tagging.
 *
 * Usage:
 *   import { logger } from '@utils/logger';
 *   logger.info('AddToCartTask', 'added product to cart', { url, qty });
 *   logger.warn('BuyerActor', 'cart was empty, skipping');
 *   logger.error('CheckoutFlow', 'order confirmation not found');
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const MIN_LEVEL: LogLevel = (process.env.LOG_LEVEL as LogLevel) ?? 'info';

function shouldLog(level: LogLevel): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[MIN_LEVEL];
}

function format(level: LogLevel, context: string, message: string, data?: unknown): string {
  const ts = new Date().toISOString().slice(11, 23);
  const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
  return `[${ts}] [${level.toUpperCase().padEnd(5)}] [${context}] ${message}${dataStr}`;
}

export const logger = {
  debug(context: string, message: string, data?: unknown): void {
    if (shouldLog('debug')) console.debug(format('debug', context, message, data));
  },

  info(context: string, message: string, data?: unknown): void {
    if (shouldLog('info')) console.info(format('info', context, message, data));
  },

  warn(context: string, message: string, data?: unknown): void {
    if (shouldLog('warn')) console.warn(format('warn', context, message, data));
  },

  error(context: string, message: string, data?: unknown): void {
    if (shouldLog('error')) console.error(format('error', context, message, data));
  },

  step(context: string, step: string): void {
    if (shouldLog('info')) console.info(format('info', context, `→ ${step}`));
  },
};
