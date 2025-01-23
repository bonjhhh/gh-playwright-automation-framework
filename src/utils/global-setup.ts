import { chromium, firefox, webkit, Browser, BrowserContext, Page } from '@playwright/test';
import { pageFixture } from '../step-definitions/hooks/browserContextFixture';

declare global {
  var __BROWSER__: Browser;
  var __CONTEXT__: BrowserContext;
  var __PAGE__: Page;
}

export default async () => {
  const browserType = process.env.UI_AUTOMATION_BROWSER || 'chromium';
  const headless = process.env.HEADLESS === 'true';
  let browser;

  switch (browserType) {
    case 'chromium':
      browser = await chromium.launch({ headless });
      break;
    case 'firefox':
      browser = await firefox.launch({ headless });
      break;
    case 'webkit':
      browser = await webkit.launch({ headless });
      break;
    default:
      throw new Error(`Unsupported browser: ${browserType}`);
  }

  global.__BROWSER__ = browser;
  global.__CONTEXT__ = await browser.newContext();
  global.__PAGE__ = await global.__CONTEXT__.newPage();

  // Save the context and page in the fixture as well for backward compatibility
  pageFixture.context = global.__CONTEXT__;
  pageFixture.page = global.__PAGE__;

  // Optionally, close the browser when the test suite is done
  process.on('exit', async () => {
    await browser.close();
  });
};
