import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import ZephyrInteractor from './ZephyrInteractor';
import logger from '../logger/logger';

class ZephyrReporter implements Reporter {
    private zephyrInteractor: ZephyrInteractor;
    private testCycleKey: string;
    private shouldReport: boolean;

    constructor() {
        // Initialize ZephyrInteractor with environment variables
        const zephyrBaseUrl = process.env.ZEPHYR_BASE_URL || 'https://api.zephyrscale.smartbear.com/v2';
        const zephyrAuthToken = process.env.ZEPHYR_API_TOKEN || '';
        const projectKey = process.env.ZEPHYR_PROJECT_KEY || 'SCRUM';
        this.zephyrInteractor = new ZephyrInteractor(zephyrBaseUrl, zephyrAuthToken, projectKey);
        this.testCycleKey = '';
        this.shouldReport = process.env.REPORT_RESULT_IN_ZEPHYR === 'true';
    }

    async onBegin() {
        if (this.shouldReport) {
            // Create or fetch test cycle at the beginning of the test run
            const cycleName = process.env.ZEPHYR_TEST_CYCLE_NAME || `Automated Cycle - ${process.env.TEST_PROFILE} - ${new Intl.DateTimeFormat('en-AU', {
                timeZone: 'Australia/Adelaide',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }).format(new Date())}`;
            this.testCycleKey = await this.zephyrInteractor.getExistingTestCycle(cycleName) || await this.zephyrInteractor.createTestCycle(cycleName);
            logger.info(`Using test cycle: ${this.testCycleKey}`);
        } else {
            logger.info('Reporting to Zephyr Scale is disabled.');
        }
    }

    async onTestEnd(test: TestCase, result: TestResult) {
        if (this.shouldReport) {
            const status = result.status === 'passed' ? 'PASS' : 'FAIL';
            const testCaseKey = test.title.split(' - ').pop(); // Extract the testCaseKey from the test title
            const executionTime = result.duration;
            const actualEndDate = new Date(result.startTime.getTime() + executionTime).toISOString();

            try {
                await this.zephyrInteractor.createTestExecution(
                    this.testCycleKey,
                    testCaseKey || 'Unknown Test Case', // Provide a default value
                    status,
                    result.error?.message || '', // Provide a default value
                    actualEndDate,
                    executionTime
                );
                logger.info(`Test execution logged for ${testCaseKey} with status: ${status}`);
            } catch (error) {
                logger.error(`Failed to log test execution for ${testCaseKey}:`, error);
            }
        }
    }
}

export default ZephyrReporter;