import { test, expect, loginAsSmokeUser } from '../../fixtures/testFixtures';
import { Navigation } from '../../pages/Navigation';
import { navigableSidebarItems } from './smokeData';

test.describe('@smoke navigation', () => {
  test('SMK-002: key pages load without critical crashes', async ({ page, env }) => {
    await loginAsSmokeUser(page, env);

    const nav = new Navigation(page);

    for (const item of navigableSidebarItems) {
      await nav.openViaSidebar(item.name, item.urlHint, item.parentButtonName);

      const mainContent = page.locator('main');
      await expect(mainContent, `Main content visible for ${item.name}`).toBeVisible();
      await expect(mainContent, `Main content has text for ${item.name}`).toContainText(/\S/);
    }
  });
});
