import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../utils/Logger';

const logger = new Logger('TablePage');

export class TablePage {
    readonly page: Page;
    readonly table: Locator;
    readonly rows: Locator;
    readonly selectAllCheckbox: Locator;
    readonly deleteButton: Locator;
    readonly confirmModal: Locator;
    readonly confirmDeleteButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.table = page.locator('table');
        this.rows = this.table.locator('tbody tr');
        this.selectAllCheckbox = this.table.locator('thead input[type="checkbox"]').first();
        this.deleteButton = page.locator('button').filter({ has: page.locator('svg.lucide-trash-2') }).first();
        this.confirmModal = page.locator('div[role="dialog"]');
        this.confirmDeleteButton = this.confirmModal.locator('button').filter({ hasText: /delete|confirm|yes/i }).first();
    }

    async visit(url: string) {
        await this.page.goto(url);
        await expect(this.page.locator('main')).toBeVisible();
    }

    async hasData(): Promise<boolean> {
        try {
            await expect(this.table).toBeVisible({ timeout: 10000 });
        } catch {
            return false;
        }

        await this.page.waitForTimeout(2000);

        const count = await this.rows.count();
        if (count === 0) return false;

        const firstRowText = await this.rows.first().textContent();
        if (firstRowText?.includes('No data')) return false;

        return true;
    }

    async bulkDelete(logName: string) {
        logger.info(`Attempting bulk delete for ${logName}`);

        if (!(await this.hasData())) {
            logger.info(`No data found to delete for ${logName}`);
            return;
        }

        if (await this.selectAllCheckbox.isVisible()) {
            await this.selectAllCheckbox.check();
            logger.info(`Selected all items for ${logName}`);

            await expect(this.deleteButton).toBeVisible();
            await this.deleteButton.click();
            logger.info(`Clicked delete button for ${logName}`);

            await expect(this.confirmModal).toBeVisible();
            await this.confirmDeleteButton.click();

            await expect(this.confirmModal).not.toBeVisible();
            logger.info(`Confirmed deletion for ${logName}`);
        } else {
            logger.warn(`Select all checkbox not visible for ${logName}`);
        }
    }
}
