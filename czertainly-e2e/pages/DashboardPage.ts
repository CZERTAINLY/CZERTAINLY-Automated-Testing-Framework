import { Page } from '@playwright/test';

export class DashboardPage {
    readonly sidebarNav;
    readonly topTiles;
    readonly bottomTiles;
    readonly header;
    readonly footer;

    constructor(private readonly page: Page) {
        this.sidebarNav = this.page.getByTestId('sidebar-sticky');
        this.topTiles = this.page.getByTestId('dashboard-counts');
        this.bottomTiles = this.page.getByTestId('dashboard-charts');
        this.header = this.page.getByTestId('header');
        this.footer = this.page.getByTestId('footer');
    }
}