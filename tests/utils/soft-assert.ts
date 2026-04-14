/**
 * SoftAssert — Collects assertion failures instead of stopping at first failure.
 * Useful for: form validation tests, PLP card checks, visual audits.
 *
 * Usage:
 *   const soft = new SoftAssert();
 *   soft.assert(() => expect(x).toBe(1), 'x should be 1');
 *   soft.assert(() => expect(y).toBe(2), 'y should be 2');
 *   soft.throwIfFailed(); // throws aggregated report if any failed
 */

export class SoftAssert {
  private readonly failures: string[] = [];

  assert(fn: () => void, label: string): void {
    try {
      fn();
    } catch (e) {
      this.failures.push(`✗ ${label}: ${(e as Error).message}`);
    }
  }

  async assertAsync(fn: () => Promise<void>, label: string): Promise<void> {
    try {
      await fn();
    } catch (e) {
      this.failures.push(`✗ ${label}: ${(e as Error).message}`);
    }
  }

  get failureCount(): number {
    return this.failures.length;
  }

  hasFailed(): boolean {
    return this.failures.length > 0;
  }

  throwIfFailed(): void {
    if (this.failures.length > 0) {
      throw new Error(
        `SoftAssert: ${this.failures.length} assertion(s) failed:\n${this.failures.join('\n')}`
      );
    }
  }

  reset(): void {
    this.failures.length = 0;
  }
}
