import { Page, Locator, expect } from "@playwright/test";

/**
 * BasePage — Shared interaction helpers dùng chung cho cả Pages và Components.
 * Không có abstract goto() để Components có thể extend mà không bị ép implement.
 *
 * Hierarchy:
 *   BasePage          ← Components extend trực tiếp
 *   └── BasePageObject ← Page Objects extend (có abstract goto())
 */
export default class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ─── Navigation ───────────────────────────────────────────────

  async navigate(url: string, waitUntil: 'load' | 'domcontentloaded' | 'networkidle' = 'load'): Promise<void> {
    await this.page.goto(url, { waitUntil });
  }

  /**
   * Chờ page load xong.
   * Mặc định dùng 'load' thay vì 'networkidle' để tránh flaky trên SPA/WebSocket.
   * Dùng 'networkidle' chỉ khi cần đảm bảo hết request (ví dụ: trang search có lazy load).
   */
  async waitForPageLoad(state: 'load' | 'domcontentloaded' | 'networkidle' = 'load'): Promise<void> {
    await this.page.waitForLoadState(state);
  }

  async reload(waitUntil: 'load' | 'domcontentloaded' | 'networkidle' = 'load'): Promise<void> {
    await this.page.reload({ waitUntil });
  }

  async goBack(waitUntil: 'load' | 'domcontentloaded' | 'networkidle' = 'load'): Promise<void> {
    await this.page.goBack({ waitUntil });
  }

  async goForward(waitUntil: 'load' | 'domcontentloaded' | 'networkidle' = 'load'): Promise<void> {
    await this.page.goForward({ waitUntil });
  }

  async getURL(): Promise<string> {
    return this.page.url();
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  // ─── Click ────────────────────────────────────────────────────

  async click(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.click();
  }

  async clickByText(text: string): Promise<void> {
    await this.click(this.page.getByText(text));
  }

  async clickByRole(role: Parameters<Page["getByRole"]>[0], name: string): Promise<void> {
    await this.click(this.page.getByRole(role, { name }));
  }

  async doubleClick(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.dblclick();
  }

  /**
   * Click nếu element đang visible — dùng cho popup/banner tuỳ chọn.
   * @returns true nếu đã click, false nếu không visible
   */
  async clickIfVisible(locator: Locator): Promise<boolean> {
    if (await locator.isVisible()) {
      await locator.click();
      return true;
    }
    return false;
  }

  // ─── Input ────────────────────────────────────────────────────

  async sendText(locator: Locator, text: string): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.clear();
    await locator.fill(text);
  }

  async sendTextByLabel(label: string, text: string): Promise<void> {
    await this.sendText(this.page.getByLabel(label), text);
  }

  async clearInput(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.clear();
  }

  async pressKey(locator: Locator, key: string): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.press(key);
  }

  async sendTextAndPressEnter(locator: Locator, text: string): Promise<void> {
    await this.sendText(locator, text);
    await locator.press("Enter");
  }

  /**
   * Gõ từng ký tự giống người dùng thật — dùng khi form validation
   * listen vào keydown/keyup/input events mà fill() không trigger được.
   * @param delay - ms giữa mỗi ký tự (default: 50ms)
   */
  async typeSlowly(locator: Locator, text: string, delay = 50): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.clear();
    await locator.pressSequentially(text, { delay });
  }

  async focus(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.focus();
  }

  async blur(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.blur();
  }

  async uploadFile(locator: Locator, filePaths: string | string[]): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.setInputFiles(filePaths);
  }

  // ─── Select / Dropdown ────────────────────────────────────────

  async selectOption(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.selectOption(value);
  }

  async selectOptionByLabel(locator: Locator, label: string): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.selectOption({ label });
  }

  // ─── Checkbox / Radio ─────────────────────────────────────────

  async check(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.check();
  }

  async uncheck(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.uncheck();
  }

  async isChecked(locator: Locator): Promise<boolean> {
    return await locator.isChecked();
  }

  // ─── Wait ─────────────────────────────────────────────────────

  async waitForVisible(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "visible" });
  }

  async waitForHidden(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "hidden" });
  }

  async waitForURL(urlPattern: string | RegExp): Promise<void> {
    await this.page.waitForURL(urlPattern);
  }

  async waitForMilliseconds(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  // ─── Get Value ────────────────────────────────────────────────

  /**
   * Trả về visible text của element (dùng innerText thay vì textContent).
   * innerText chỉ lấy text đang hiển thị, bỏ qua display:none — chính xác hơn cho assertions.
   */
  async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: "visible" });
    return (await locator.innerText()).trim();
  }

  async getInputValue(locator: Locator): Promise<string> {
    await locator.waitFor({ state: "visible" });
    return await locator.inputValue();
  }

  async getAttribute(locator: Locator, attr: string): Promise<string | null> {
    return await locator.getAttribute(attr);
  }

  // ─── Visibility ───────────────────────────────────────────────

  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  async isEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  // ─── Assert ───────────────────────────────────────────────────

  async assertVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  async assertHidden(locator: Locator): Promise<void> {
    await expect(locator).toBeHidden();
  }

  async assertNotVisible(locator: Locator): Promise<void> {
    await expect(locator).not.toBeVisible();
  }

  async assertText(locator: Locator, expected: string): Promise<void> {
    await expect(locator).toHaveText(expected);
  }

  async assertContainsText(locator: Locator, expected: string): Promise<void> {
    await expect(locator).toContainText(expected);
  }

  async assertURL(urlPattern: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(urlPattern);
  }

  async assertEnabled(locator: Locator): Promise<void> {
    await expect(locator).toBeEnabled();
  }

  async assertDisabled(locator: Locator): Promise<void> {
    await expect(locator).toBeDisabled();
  }

  async assertChecked(locator: Locator): Promise<void> {
    await expect(locator).toBeChecked();
  }

  async assertUnchecked(locator: Locator): Promise<void> {
    await expect(locator).not.toBeChecked();
  }

  async assertFocused(locator: Locator): Promise<void> {
    await expect(locator).toBeFocused();
  }

  async assertAttributeContains(locator: Locator, attr: string, value: string): Promise<void> {
    await expect(locator).toHaveAttribute(attr, new RegExp(value));
  }

  async assertInputValue(locator: Locator, expected: string): Promise<void> {
    await expect(locator).toHaveValue(expected);
  }

  async assertTitleContains(text: string): Promise<void> {
    await expect(this.page).toHaveTitle(new RegExp(text, 'i'));
  }

  async assertTitle(expected: string): Promise<void> {
    await expect(this.page).toHaveTitle(expected);
  }

  // ─── Count ────────────────────────────────────────────────────

  async getCount(locator: Locator): Promise<number> {
    return await locator.count();
  }

  async assertCount(locator: Locator, expected: number): Promise<void> {
    await expect(locator).toHaveCount(expected);
  }

  async assertAtLeastOne(locator: Locator): Promise<void> {
    const count = await locator.count();
    expect(count).toBeGreaterThan(0);
  }

  // ─── Scroll ───────────────────────────────────────────────────

  async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async scrollBy(deltaX: number, deltaY: number): Promise<void> {
    await this.page.evaluate(
      ([x, y]: number[]) => window.scrollBy(x, y),
      [deltaX, deltaY]
    );
  }

  // ─── Hover ────────────────────────────────────────────────────

  async hover(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.hover();
  }

  async hoverAndWait(locator: Locator, target: Locator): Promise<void> {
    await this.hover(locator);
    await target.waitFor({ state: 'visible' });
  }

  // ─── Drag ─────────────────────────────────────────────────────

  async dragTo(source: Locator, target: Locator): Promise<void> {
    await source.dragTo(target);
  }

  // ─── Network ──────────────────────────────────────────────────

  /**
   * Chờ response khớp urlPattern trong khi thực hiện action.
   * Dùng Promise.all để đăng ký listener TRƯỚC khi action trigger request.
   */
  async waitForResponse(
    urlPattern: string | RegExp,
    action: () => Promise<void>,
    options: { status?: number; timeout?: number } = {}
  ): Promise<void> {
    const { status = 200, timeout = 30_000 } = options;
    await Promise.all([
      this.page.waitForResponse(
        (res) => {
          const match =
            typeof urlPattern === 'string'
              ? res.url().includes(urlPattern)
              : urlPattern.test(res.url());
          return match && res.status() === status;
        },
        { timeout }
      ),
      action(),
    ]);
  }

  /**
   * Chờ request gửi đi khớp urlPattern trong khi thực hiện action.
   * Dùng khi cần verify payload được gửi đúng (analytics, tracking events).
   */
  async waitForRequest(
    urlPattern: string | RegExp,
    action: () => Promise<void>,
    options: { timeout?: number } = {}
  ): Promise<void> {
    const { timeout = 30_000 } = options;
    await Promise.all([
      this.page.waitForRequest(
        (req) =>
          typeof urlPattern === 'string'
            ? req.url().includes(urlPattern)
            : urlPattern.test(req.url()),
        { timeout }
      ),
      action(),
    ]);
  }

  // ─── New Tab ──────────────────────────────────────────────────

  /**
   * Xử lý link/button mở tab mới — dùng cho payment gateway redirect.
   * @returns Page object của tab mới, đã load xong
   *
   * @example
   * const newTab = await basePage.waitForNewTab(() => paymentButton.click());
   * await newTab.waitForURL(/payment-gateway/);
   */
  async waitForNewTab(action: () => Promise<void>): Promise<Page> {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      action(),
    ]);
    await newPage.waitForLoadState('load');
    return newPage;
  }

  // ─── Screenshot ───────────────────────────────────────────────

  /**
   * Chụp screenshot và lưu vào test-results (Playwright artifact).
   * Tự động attach vào HTML report.
   */
  async takeScreenshot(name: string): Promise<Buffer> {
    return await this.page.screenshot({
      path: `test-results/screenshots/${name}.png`,
      fullPage: false,
    });
  }

  async takeFullPageScreenshot(name: string): Promise<Buffer> {
    return await this.page.screenshot({
      path: `test-results/screenshots/${name}-full.png`,
      fullPage: true,
    });
  }
}
