import { Page, expect } from '@playwright/test';
import { TestEnv } from '../utils/env';
import { Logger } from '../utils/Logger';

const logger = new Logger('LoginPage');

export class LoginPage {
  constructor(private readonly page: Page, private readonly env: TestEnv) { }

  async goto(): Promise<void> {
    await this.page.goto(this.env.baseUrl + 'administrator/');
  }

  async login(): Promise<void> {
    if (this.env.authMode === 'local') {
      await this.loginLocal();
    } else {
      // await this.loginOidc();
    }
  }

  private async loginLocal(): Promise<void> {
    const usernameInput = this.page.getByRole('textbox', { name: 'Username' });
    const passwordInput = this.page.getByRole('textbox', { name: 'Password' });
    const submitBtn = this.page.getByRole('button', { name: /sign in/i });

    try {
      await usernameInput.waitFor({ state: 'visible', timeout: 2000 });
      logger.info('Login form visible immediately. Skipping provider selection.');
    } catch {
      const providerName = this.env.localAuthProviderName ?? 'Internal';
      const providerBtn = this.page.getByText(providerName);

      logger.info(`Login form not visible. Expecting provider selection: "${providerName}"`);
      await expect(providerBtn, `Provider "${providerName}" button should be visible`).toBeVisible();
      await providerBtn.click();

      await expect(usernameInput).toBeVisible();
    }

    await usernameInput.fill(this.env.username);
    await passwordInput.fill(this.env.password);
    await submitBtn.click();

    await expect(this.page.getByTestId('sidebar-sticky')).toBeVisible();
  }
}