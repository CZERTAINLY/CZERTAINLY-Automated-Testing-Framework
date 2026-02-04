import { Locator, Page, expect } from '@playwright/test';

export class Navigation {
  private readonly sidebarNav;
  private hasToggledSidebar = false;

  constructor(private readonly page: Page) {
    this.sidebarNav = this.page.getByTestId('sidebar-sticky');
  }

  private async ensureSidebarExpanded(): Promise<void> {
    await expect(this.sidebarNav).toBeVisible();
    if (this.hasToggledSidebar) {
      return;
    }

    const expandButton = this.sidebarNav.getByRole('button', {
      name: /collapse/i,
    });

    if (await expandButton.isVisible()) {
      await expandButton.click();
      this.hasToggledSidebar = true;
    }
  }

  private async ensureParentExpanded(parentButton: Locator): Promise<void> {
    const parentList = parentButton.locator('xpath=following-sibling::ul[1]');

    if ((await parentList.count()) === 0) {
      await parentButton.click();
      return;
    }

    const isExpanded = async () =>
      parentList.evaluate((el) => {
        const mh = getComputedStyle(el).maxHeight || '0';
        return parseFloat(mh) > 0;
      });

    if (!(await isExpanded())) {
      await parentButton.click();
    }

    await expect.poll(isExpanded).toBeTruthy();
  }

  async openViaSidebar(
    menuText: string,
    urlHint: RegExp,
    parentButtonName?: string
  ): Promise<void> {
    await this.ensureSidebarExpanded();

    if (parentButtonName) {
      const parentButton = this.sidebarNav.getByRole('button', {
        name: parentButtonName,
        exact: true,
      });

      await this.ensureParentExpanded(parentButton);
    }

    const targetLink = this.sidebarNav.getByRole('link', {
      name: menuText,
      exact: true,
    });

    await Promise.all([
      this.page.waitForURL(urlHint, { waitUntil: 'domcontentloaded' }),
      targetLink.click(),
    ]);
  }
}