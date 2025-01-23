import { PlaywrightTestConfig } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Define the valid browser names
type BrowserName = 'chromium' | 'firefox' | 'webkit';

// Read environment variables with defaults
const browserType = (process.env.UI_AUTOMATION_BROWSER || 'chromium') as BrowserName;
const isHeadless = process.env.HEADLESS === 'true';
const viewportWidth = parseInt(process.env.BROWSER_WIDTH || '1920', 10);
const viewportHeight = parseInt(process.env.BROWSER_HEIGHT || '1080', 10);
const parallelWorkers = parseInt(process.env.PARALLEL || '1', 10);
const retries = parseInt(process.env.RETRY || '0', 10);

const config: PlaywrightTestConfig = {
  globalSetup: require.resolve('./src/utils/global-setup.ts'), // Add global setup
  globalTeardown: require.resolve('./src/utils/global-teardown'),
  projects: [
    {
      name: browserType, // Use the environment variable for the browser type
      use: {
        browserName: browserType,
        headless: isHeadless,
        viewport: {
          width: viewportWidth,
          height: viewportHeight,
        },
      },
    },
  ],
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report.json' }],
    [require.resolve('./src/utils/ZephyrReporter')], // Add custom ZephyrReporter
  ],
  timeout: 60000, // Timeout for tests
  retries: retries, // Number of retries
  workers: parallelWorkers, // Number of parallel workers
};

export default config;
