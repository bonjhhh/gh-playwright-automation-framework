import { chromium, Page } from 'playwright';
import { userPayloads } from '../../../fixtures/ui/loginData';
import { PageManager } from '../../../page-objects/base/PageManager';

export async function loginPageLoadTestFunction() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Create a new instance of PageManager directly from PageManager class
  const pageManager = Object.create(PageManager.prototype);
  pageManager.page = page as Page;

  for (const { username, password, expectedAlertText } of Object.values(userPayloads)) {
    const loginPage = pageManager.createLoginPage();

    // Step 1: Navigate to the login page
    await loginPage.navigateToLoginPage();

    // Step 2: Fill in username and password
    await loginPage.fillUsername(username);
    await loginPage.fillPassword(password);

    // Step 3: Handle dialog and click login button
    let alertText: string | undefined;

    page.on('dialog', async (dialog) => {
      alertText = dialog.message();
      await dialog.accept();
    });

    await loginPage.clickOnLoginButton();

    // Step 4: Validate alert text after login attempt
    if (alertText !== expectedAlertText) {
      console.error(`Expected alert text to be "${expectedAlertText}" but got "${alertText}"`);
    }
  }

  await page.close();
  await context.close();
  await browser.close();
}
