import { Page } from 'playwright';
import { expect } from '@playwright/test';

export async function helloFlow(page: Page) {
  await page.goto('https://www.artillery.io/', { waitUntil: 'networkidle' });
  const homeLink = page.locator('a[href="/"][class*="font-mono uppercase sss"]');
  await expect(homeLink).toBeVisible({ timeout: 10000 });
}
