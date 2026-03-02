import { test as base, Page, APIRequestContext, Browser, request as playwrightRequest, expect } from '@playwright/test';
import { loadEnv, TestEnv } from '../utils/env';
import { LoginPage } from '../pages/LoginPage';
import { Logger } from '../utils/Logger';

const logger = new Logger('TestFixtures');

export { expect };

/**
 * Direct API authentication via Keycloak (Resource Owner Password Credentials flow).
 * Returns an APIRequestContext authorized with the Bearer token.
 */
export async function getAuthenticatedApiContext(request: APIRequestContext, env: TestEnv): Promise<APIRequestContext> {
  const authBase = env.authBaseUrl ? env.authBaseUrl.replace(/\/$/, '') : `${env.baseUrl.replace(/\/$/, '')}/kc`;
  const tokenUrl = `${authBase}/realms/${env.authRealm}/protocol/openid-connect/token`;

  logger.debug(`Fetching access token from: ${tokenUrl} for user: ${env.username}`);

  const response = await request.post(tokenUrl, {
    form: {
      grant_type: 'password',
      client_id: env.authClientId,
      client_secret: env.clientSecret,
      username: env.username,
      password: env.password,
    }
  });

  if (!response.ok()) {
    const errorBody = await response.text();
    logger.error(`Failed to get access token! Status: ${response.status()} ${response.statusText()}`);
    throw new Error(`Failed to get access token! Status: ${response.status()} ${response.statusText()} \nBody: ${errorBody}`);
  }

  const tokenData = await response.json();
  const accessToken = tokenData.access_token;

  if (!accessToken) {
    logger.error('Keycloak response did not contain access_token!');
    throw new Error('Keycloak response did not contain access_token!');
  }

  logger.info('Successfully obtained access token via API.');

  return await playwrightRequest.newContext({
    baseURL: env.baseUrl,
    extraHTTPHeaders: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
    ignoreHTTPSErrors: true
  });
}

export const test = base.extend<{ env: TestEnv }>({
  env: async ({ }, use) => {
    const env = loadEnv();
    await use(env);
  },
});

export async function loginAsSmokeUser(page: Page, env: TestEnv): Promise<void> {
  const loginPage = new LoginPage(page, env);
  logger.info(`Logging in to UI as ${env.username}`);
  await loginPage.goto();
  await loginPage.login();
}