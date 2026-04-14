/**
 * ChatComponent - Live chat / support widget
 * Referenced by actor.ts
 */

import { Page, Locator } from '@playwright/test';
import BasePage from '../pages/BasePage';

export class ChatComponent extends BasePage {
  readonly chatButton: Locator;
  readonly chatInput: Locator;
  readonly sendButton: Locator;
  readonly chatWindow: Locator;

  constructor(page: Page) {
    super(page);
    this.chatButton = page.locator("[data-testid='chat-button'], [aria-label*='chat' i]");
    this.chatWindow = page.locator("[data-testid='chat-window'], [class*='chat-window']");
    this.chatInput = this.chatWindow.locator('input, textarea').first();
    this.sendButton = this.chatWindow.getByRole('button', { name: /send|gửi/i });
  }

  async openChat(): Promise<void> {
    await this.click(this.chatButton);
    await this.waitForVisible(this.chatWindow);
  }

  async sendMessage(message: string): Promise<void> {
    await this.sendText(this.chatInput, message);
    await this.click(this.sendButton);
  }

  async isChatOpen(): Promise<boolean> {
    return await this.chatWindow.isVisible();
  }
}
