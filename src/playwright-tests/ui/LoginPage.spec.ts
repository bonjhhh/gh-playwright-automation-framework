import { test, expect } from '../fixtures/fixtures'; // Import from your fixtures file
import { userPayloads } from '../../fixtures/ui/loginData';
import { PageManager } from '../../page-objects/base/PageManager';

// Define the type for the fixtures
interface TestFixtures {
  pageManager: PageManager;
}

test.describe('WebdriverUniversity - Login Tests', () => {
  // Iterate through each user payload and create tests dynamically
  for (const [key, { username, password, expectedAlertText, testCaseKey }] of Object.entries(userPayloads)) {
    test(`Validate login - ${testCaseKey}`, async ({ pageManager }: TestFixtures) => {
      const loginPage = pageManager.createLoginPage(); // Create a new instance of LoginPage

      // Step 1: Navigate to the login page
      await loginPage.navigateToLoginPage();

      // Step 2: Fill in username and password
      await loginPage.fillUsername(username);
      await loginPage.fillPassword(password);

      // Step 3: Handle dialog and click login button
      let alertText: string | undefined;

      // Listen for the dialog event
      pageManager.page.on('dialog', async (dialog) => {
        alertText = dialog.message();
        await dialog.accept();
      });

      // Click the login button
      await loginPage.clickOnLoginButton();

      // Step 4: Validate alert text after login attempt
      expect(alertText).toBeDefined();
      expect(alertText).toBe(expectedAlertText);
    });
  }
});
