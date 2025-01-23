import { test as base, Browser, BrowserContext, chromium, firefox, Page, webkit } from '@playwright/test';
import { PageManager } from '../../page-objects/base/PageManager';
import { pageFixture } from '../../step-definitions/hooks/browserContextFixture';

export type TestFixtures = {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  pageManager: PageManager;
};

export const test = base.extend<TestFixtures>({
  browser: async ({ }: any, use: (arg0: Browser) => any) => {
    const browser = await (process.env.UI_AUTOMATION_BROWSER === 'firefox' ? firefox :
      process.env.UI_AUTOMATION_BROWSER === 'webkit' ? webkit :
        chromium).launch({ headless: process.env.HEADLESS === 'true' });
    await use(browser);
    await browser.close();
  },

  context: async ({ browser }, use) => {
    const context = await browser.newContext();
    await use(context);
    await context.close();
  },

  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
    await page.close();
  },

  pageManager: async ({ page }, use) => {
    // Here we manually set the page for the PageManager
    const pageManager = new PageManager();
    pageFixture.page = page; // Update pageFixture to ensure compatibility
    await use(pageManager);
  },
});

export { expect } from '@playwright/test';
