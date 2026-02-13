import { test, expect, loginAsSmokeUser } from '../../fixtures/testFixtures';
import { Navigation } from '../../pages/Navigation';
import { navigableSidebarItems } from './smokeData';

test.describe('@smoke navigation', () => {
  test('SMK-002: key pages load without critical crashes', async ({ page, env }) => {
    const serverErrors: string[] = [];

    const onResponse = (response: any) => {
      const request = response.request();
      const resourceType = request.resourceType();
      const status = response.status();

      if ((resourceType === 'xhr' || resourceType === 'fetch') && status >= 500) {
        serverErrors.push(`Error ${status} on ${request.method()} ${request.url()}`);
      }
    };
    page.on('response', onResponse);

    await loginAsSmokeUser(page, env);

    const nav = new Navigation(page);

    for (const item of navigableSidebarItems) {
      serverErrors.length = 0;
      await nav.openViaSidebar(item.name, item.urlHint, item.parentButtonName);

      const mainContent = page.locator('main');
      await expect(mainContent, `Main content visible for ${item.name}`).toBeVisible();

      await expect(
        mainContent.getByText(/something went wrong/i),
        `Error state detected on ${item.name}`
      ).toHaveCount(0);

      await expect(
        mainContent.getByText(/internal server error/i),
        `Internal server error message detected on ${item.name}`
      ).toHaveCount(0);

      await page.waitForLoadState('networkidle', { timeout: 2000 }).catch(() => { });

      expect(
        serverErrors,
        `5xx API responses detected after navigating to "${item.name}":\n${serverErrors.join('\n')}`
      ).toEqual([]);
    }

    page.off('response', onResponse);
  });
});
