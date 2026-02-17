import { Page, expect } from '@playwright/test';
import { TestEnv } from '../utils/env';

export class LoginPage {
  constructor(private readonly page: Page, private readonly env: TestEnv) { }

  async goto(): Promise<void> {
    await this.page.goto(this.env.baseUrl);
  }

  async login(): Promise<void> {
    if (this.env.authMode === 'local') {
      await this.loginLocal();
    } else {
      // await this.loginOidc();
    }
  }

  private async loginLocal(): Promise<void> {
    const providerName = this.env.localAuthProviderName ?? 'Internal2';
    const internal2 = this.page.locator(`text=${providerName}`);
    const usernameInput = this.page.getByRole('textbox', { name: 'Username' });
    const passwordInput = this.page.getByRole('textbox', { name: 'Password' });
    const submitBtn = this.page.getByRole('button', { name: /sign in/i });

    await expect(internal2).toBeVisible();
    await internal2.click();
    await expect(usernameInput).toBeVisible();
    await usernameInput.fill(this.env.username);
    await passwordInput.fill(this.env.password);
    await submitBtn.click();

    await expect(this.page.getByTestId('sidebar-sticky')).toBeVisible();
  }
}