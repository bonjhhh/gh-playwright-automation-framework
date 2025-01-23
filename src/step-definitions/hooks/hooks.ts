import { After, AfterAll, Before, BeforeAll, Status } from "@cucumber/cucumber"; 
import { Browser, chromium, firefox, webkit, BrowserType } from "@playwright/test";
import { pageFixture } from "./browserContextFixture";
import { setGlobalSettings } from "../../utils/playwright-timeouts";
import { PageManager } from "../../page-objects/base/PageManager";
import ZephyrInteractor from "../../utils/ZephyrInteractor";
import logger from '../../logger/logger';
import { FeatureChild, TableCell } from "@cucumber/messages";

const config = {
  headless: process.env?.HEADLESS === "true",
  browser: process.env?.UI_AUTOMATION_BROWSER || "chromium",
  width: parseInt(process.env?.BROWSER_WIDTH || "1920"),
  height: parseInt(process.env?.BROWSER_HEIGHT || "1080"),
  zephyrBaseUrl: process.env.ZEPHYR_BASE_URL || "",
  zephyrApiToken: process.env.ZEPHYR_API_TOKEN || "",
  zephyrProjectKey: process.env.ZEPHYR_PROJECT_KEY || "",  
  zephyrTestCycleName: process.env.ZEPHYR_TEST_CYCLE_NAME || `Automated Cycle - ${process.env.TEST_PROFILE} - ${new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Adelaide',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date())}`,
  reportResultInZephyr: process.env.REPORT_RESULT_IN_ZEPHYR === "true", // Feature flag
};

const browsers: { [key: string]: BrowserType } = {
  chromium: chromium,
  firefox: firefox,
  webkit: webkit,
};

let browserInstance: Browser | null = null;
let testCycleKey: string | null = null;
let testCycleCreated = false;

const zephyrInteractor = new ZephyrInteractor(
  config.zephyrBaseUrl,
  config.zephyrApiToken,
  config.zephyrProjectKey
);

async function initializeBrowserContext(selectedBrowser: string): Promise<Browser> {
  const launchBrowser = browsers[selectedBrowser];
  if (!launchBrowser) {
    logger.error(`Invalid browser selected: ${selectedBrowser}`);
    throw new Error(`Invalid browser selected: ${selectedBrowser}`);
  }
  logger.info(`Launching browser: ${selectedBrowser}`);
  return await launchBrowser.launch({ headless: config.headless });
}

async function initializePage(): Promise<void> {
  if (!browserInstance) {
    logger.error("Browser instance is null");
    throw new Error("Browser instance is null");
  }
  pageFixture.context = await browserInstance.newContext({ ignoreHTTPSErrors: true });
  pageFixture.page = await pageFixture.context.newPage();
  setGlobalSettings(pageFixture.page);
  await pageFixture.page.setViewportSize({ width: config.width, height: config.height });
  logger.info(`Initialized page with viewport size: ${config.width}x${config.height}`);
}

BeforeAll(async function () {
  if (config.reportResultInZephyr && !testCycleCreated) {
    logger.info("\nExecuting test suite...");
    try {
      const existingCycleKey = await zephyrInteractor.getExistingTestCycle(config.zephyrTestCycleName);
      if (existingCycleKey) {
        testCycleKey = existingCycleKey;
        logger.info(`Using existing Zephyr test cycle with key: ${testCycleKey}`);
      } else {
        testCycleKey = await zephyrInteractor.createTestCycle(config.zephyrTestCycleName);
        logger.info(`Created new Zephyr test cycle with key: ${testCycleKey}`);
      }
      testCycleCreated = true;
    } catch (error) {
      logger.error("Error creating or retrieving test cycle in Zephyr Scale:", error);
    }
  } else {
    logger.info("Skipping Zephyr test cycle creation (feature flag disabled).");
  }
});

AfterAll(async function () {
  logger.info("\nFinished execution of test suite!");
});

Before(async function ({ pickle, gherkinDocument }) {
  try {
    browserInstance = await initializeBrowserContext(config.browser);
    logger.info(`Browser context initialized for: ${config.browser}`);
    await initializePage();

    this.pageManager = new PageManager();
    this.basePage = this.pageManager.createBasePage();
    this.homePage = this.pageManager.createHomePage();
    this.contactUsPage = this.pageManager.createContactUsPage();
    this.loginPage = this.pageManager.createLoginPage();

    let testCaseKey: string | null = null;

    const zephyrTag = pickle.tags.find((tag) => tag.name.startsWith("@zephyr:"));
    if (zephyrTag) {
      testCaseKey = zephyrTag.name.replace("@zephyr:", "");
      logger.info(`Found testCaseKey in tags: ${testCaseKey}`);
    }

    if (!testCaseKey && pickle.astNodeIds && gherkinDocument?.feature?.children) {
      for (const child of gherkinDocument.feature.children) {
        if (isScenarioOutline(child)) {
          const examples = child.scenario?.examples || [];
          for (const example of examples) {
            for (const row of example.tableBody) {
              if (pickle.astNodeIds.includes(row.id)) {
                const testCaseKeyIndex = example.tableHeader.cells.findIndex(
                  (cell: TableCell) => cell.value === "testCaseKey"
                );
                if (testCaseKeyIndex !== -1) {
                  testCaseKey = row.cells[testCaseKeyIndex].value;
                  logger.info(`Found testCaseKey in Scenario Outline example: ${testCaseKey}`);
                  break;
                }
              }
            }
            if (testCaseKey) break;
          }
        }
      }
    }

    this.testCaseKey = testCaseKey;
    this.startTime = new Date(); 
    logger.info(`Derived Test Case Key: ${this.testCaseKey || "None"}`);
  } catch (error) {
    logger.error("Browser context initialization failed:", error);
  }
});

After(async function ({ pickle, result }) {
  const endTime = new Date();
  const executionTime = endTime.getTime() - (this.startTime?.getTime() || endTime.getTime());
  const actualEndDate = endTime.toISOString();

  if (result?.status === Status.FAILED) {
    if (pageFixture.page) {
      const screenshotPath = `./reports/screenshots/${pickle.name}-${Date.now()}.png`;
      const image = await pageFixture.page.screenshot({
        path: screenshotPath,
        type: "png",
      });
      await this.attach(image, "image/png");
      logger.error(`Test failed, screenshot saved at: ${screenshotPath}`);
    } else {
      logger.error("pageFixture.page is undefined");
    }
  }

  if (browserInstance) {
    await pageFixture.page?.close();
    await browserInstance.close();
    logger.info("Closed browser and page instance");
  }

  if (config.reportResultInZephyr && this.testCaseKey) {
    const status = result?.status === Status.PASSED ? "PASS" : "FAIL";
    const comment = result?.status === Status.PASSED ? "Test passed successfully" : "Test failed";

    try {
      if (testCycleKey) {
        await zephyrInteractor.createTestExecution(testCycleKey, this.testCaseKey, status, comment, actualEndDate, executionTime);
        logger.info(`Logged test execution for ${this.testCaseKey}`);
      } else {
        logger.error("Test cycle key is null; cannot log test execution.");
      }
    } catch (error) {
      logger.error(`Error logging test execution for ${this.testCaseKey}:`, error);
    }
  } else {
    logger.info("Skipping Zephyr result reporting (feature flag disabled).");
  }
});

function isScenarioOutline(child: FeatureChild): child is FeatureChild & { scenario: { examples: any[] } } {
  return child.scenario?.examples !== undefined;
}
