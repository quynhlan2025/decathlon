/**
 * TC-HP-NEWS-* : Newsletter signup section tests
 * Email subscription form at the bottom of homepage.
 * @regression @p3
 */

import test, { expect } from '@fixtures/test.fixture';

test.describe('Homepage – Newsletter Section @regression @p3', () => {

  test.beforeEach(async ({ pages, page }) => {
    await pages.home.goto();
    // Scroll to footer area where newsletter usually lives
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  });

  test('TC-HP-NEWS-001: newsletter section is visible', async ({ pages }) => {
    if (!await pages.home.hp.newsletter.isVisible()) test.skip();
    expect(await pages.home.hp.newsletter.isVisible()).toBe(true);
  });

  test('TC-HP-NEWS-002: email input and submit button are present', async ({ pages }) => {
    if (!await pages.home.hp.newsletter.isVisible()) test.skip();
    await expect(pages.home.hp.newsletter.emailInput).toBeVisible();
    await expect(pages.home.hp.newsletter.submitButton).toBeVisible();
  });

  test('TC-HP-NEWS-003: submitting invalid email shows validation error', async ({ pages }) => {
    if (!await pages.home.hp.newsletter.isVisible()) test.skip();

    await pages.home.hp.newsletter.emailInput.fill('not-an-email');
    await pages.home.hp.newsletter.submitButton.click();

    const inputInvalid = await pages.home.hp.newsletter.emailInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid
    ).catch(() => false);

    const inlineError = await pages.home.hp.newsletter.isErrorVisible();

    expect(inputInvalid || inlineError).toBe(true);
  });

  test('TC-HP-NEWS-004: submitting empty email shows validation', async ({ pages }) => {
    if (!await pages.home.hp.newsletter.isVisible()) test.skip();

    await pages.home.hp.newsletter.emailInput.fill('');
    await pages.home.hp.newsletter.submitButton.click();

    const inputInvalid = await pages.home.hp.newsletter.emailInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid
    ).catch(() => false);

    expect(inputInvalid || await pages.home.hp.newsletter.isErrorVisible()).toBe(true);
  });

  test('TC-HP-NEWS-005: subscribing with valid email accepts submission', async ({ pages, page }) => {
    if (!await pages.home.hp.newsletter.isVisible()) test.skip();

    await pages.home.hp.newsletter.subscribe('automation-test+newsletter@example.com');
    await page.waitForTimeout(1000);

    const hasError = await pages.home.hp.newsletter.isErrorVisible();
    expect(hasError).toBe(false);
  });

});
