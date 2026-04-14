import BasePage from './BasePage';

/**
 * BasePageObject — Abstract base dành riêng cho Page Objects.
 * Enforce contract: mọi Page Object phải implement goto().
 *
 * Hierarchy:
 *   BasePage (helpers)
 *   └── BasePageObject (+ abstract goto()) ← Pages extend
 *
 * Components extend BasePage trực tiếp (không cần goto).
 */
export default abstract class BasePageObject extends BasePage {
  /**
   * Điều hướng đến URL của page này.
   * Mỗi Page Object bắt buộc implement — enforce nhất quán, không có page "mồ côi".
   */
  abstract goto(...args: unknown[]): Promise<void>;
}
