import { Browser, BrowserContext, Page } from '@playwright/test';

declare global {
  var __BROWSER__: Browser;
  var __CONTEXT__: BrowserContext;
  var __PAGE__: Page;
}
