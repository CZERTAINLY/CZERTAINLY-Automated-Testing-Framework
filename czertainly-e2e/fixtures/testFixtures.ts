import { test as base, Page } from '@playwright/test';
import { loadEnv, TestEnv } from '../utils/env';
import { LoginPage } from '../pages/LoginPage';

export const test = base.extend<{
  env: TestEnv;
}>({
  env: async ({ }, use) => {
    const env = loadEnv();
    await use(env);
  },
});

// test.afterEach(async ({ context }) => {
//   await context.close();
// });

// test.afterAll(async ({ browser }) => {
//   await browser.close();
// });

export { expect } from '@playwright/test';

export async function loginAsSmokeUser(page: Page, env: TestEnv): Promise<void> {
  const loginPage = new LoginPage(page, env);
  await loginPage.goto();
  await loginPage.login();
}
