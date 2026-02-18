import { Page, Locator } from '@playwright/test';

export class DashboardPage {
    readonly sidebarNav: Locator;
    readonly topTiles: Locator;
    readonly bottomTiles: Locator;
    readonly header: Locator;
    readonly footer: Locator;

    constructor(private readonly page: Page) {
        this.sidebarNav = this.page.getByTestId('sidebar-sticky');
        this.topTiles = this.page.getByTestId('dashboard-counts');
        this.bottomTiles = this.page.getByTestId('dashboard-charts');
        this.header = this.page.getByTestId('header');
        this.footer = this.page.getByTestId('footer');
    }
}