import { Page } from "@playwright/test";

export function setGlobalSettings(page: Page) {
    // Get navigation timeout from environment variable (default to '50000' if not set)
    const navigationTimeout = parseInt(process.env?.UI_AUTOMATION_NAVIGATION_TIMEOUT || '50000');

    // Get command timeout from environment variable (default to '30000' if not set)
    const commandTimeout = parseInt(process.env?.UI_AUTOMATION_COMMAND_TIMEOUT || '30000');

    //Set Global 'navigation' timeout
    page.setDefaultNavigationTimeout(navigationTimeout); //wait up to 50 seconds

    //Set Global 'command' timeout
    page.setDefaultTimeout(commandTimeout); //wait up to 30 seconds
}

//Override global 'navigation' timeout - Command Example:
// await page.goto('https://example.com', { timeout: 60000 });

//Override global 'command timeout' - Command Example:
// await page.waitForSelector('#my-element', { timeout: 60000 });
// await page.type('#my-input', 'Hello', { timeout: 60000 });
// await page.click('#my-button', { timeout: 60000 });

//MAKE SURE!!!!!!! - Cucumber timeouts value is always HIGHER!!!!!