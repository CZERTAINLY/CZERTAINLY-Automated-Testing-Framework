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
    const internal2 = this.page.locator('text=Internal2');
    const usernameInput = this.page.locator('#username');
    const passwordInput = this.page.locator('#password');
    const submitBtn = this.page.locator('input[type="submit"]');

    await expect(internal2).toBeVisible();
    await internal2.click();
    await expect(usernameInput).toBeVisible();
    await usernameInput.fill(this.env.username);
    await passwordInput.fill(this.env.password);
    await submitBtn.click();

    await expect(this.page.getByTestId('sidebar-sticky')).toBeVisible();
  }

  // private async loginOidc(): Promise<void> {
  //   await this.page.waitForLoadState('domcontentloaded');

  //   const usernameByLabel = this.page.getByLabel(process.env.OIDC_USERNAME_LABEL ?? 'Username');
  //   const passwordByLabel = this.page.getByLabel(process.env.OIDC_PASSWORD_LABEL ?? 'Password');

  //   await expect(usernameByLabel).toBeVisible();
  //   await usernameByLabel.fill(this.env.username);
  //   await passwordByLabel.fill(this.env.password);

  //   const signInButton =
  //     this.page.getByRole('button', { name: /sign in|log in|continue/i });

  //   await signInButton.click();

  //   await expect(this.page).toHaveURL(/.*\/(dashboard)?/);
  //   await expect(this.page.getByTestId('sidebar-sticky')).toBeVisible();
  // }
}