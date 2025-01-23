import axios from 'axios';
import logger from '../logger/logger';

class ZephyrInteractor {
    private baseUrl: string;
    private authToken: string;
    private projectKey: string;

    constructor(baseUrl: string, authToken: string, projectKey: string) {
        this.baseUrl = baseUrl;
        this.authToken = authToken;
        this.projectKey = projectKey;
    }

    private getHeaders() {
        return {
            Authorization: `Bearer ${this.authToken}`,
            'Content-Type': 'application/json',
        };
    }

    // Fetch existing test cycles to check if a cycle with the given name already exists
    async getExistingTestCycle(cycleName: string): Promise<string | null> {
        const endpoint = `${this.baseUrl}/testcycles?projectKey=${this.projectKey}`;
        try {
            const response = await axios.get(endpoint, {
                headers: this.getHeaders(),
            });
            const cycles = response.data.values || [];
            const existingCycle = cycles.find((cycle: { name: string }) => cycle.name === cycleName);

            if (existingCycle) {
                logger.info(`Found existing test cycle: ${existingCycle.key}`);
                return existingCycle.key;
            }
            return null;
        } catch (error) {
            logger.error("Error fetching test cycles:", error);
            throw new Error('Failed to fetch test cycles');
        }
    }

    // Create a new test cycle in Zephyr
    async createTestCycle(cycleName: string): Promise<string> {
        const endpoint = `${this.baseUrl}/testcycles`;
        const payload = {
            name: cycleName,
            projectKey: this.projectKey,
        };

        try {
            const response = await axios.post(endpoint, payload, {
                headers: this.getHeaders(),
            });
            logger.info(`Test cycle created with key: ${response.data.key}`);
            return response.data.key; // Returns the test cycle key
        } catch (error) {
            logger.error("Error creating test cycle:", error);
            throw new Error('Failed to create test cycle');
        }
    }

    // Log test execution results in Zephyr
    async createTestExecution(
        cycleKey: string,
        testCaseKey: string,
        status: string,
        comment?: string,
        actualEndDate?: string,
        executionTime?: number
    ): Promise<void> {
        const zephyrUserAccountId = process.env?.ZEPHYR_ACCOUNT_ID || "712020:205e842a-930d-4ec7-826a-68f75e141653";  // hard coded as I only have 1 user in a free trail account of Zephyr Scale
        const endpoint = `${this.baseUrl}/testexecutions`;
        const payload = {
            projectKey: this.projectKey,
            testCycleKey: cycleKey,
            testCaseKey: testCaseKey,
            executedById: zephyrUserAccountId,
            assignedToId: zephyrUserAccountId,
            statusName: status, // Ensure status matches Zephyr's valid statuses (e.g., "PASS", "FAIL")
            comment: comment || '',
            actualEndDate: actualEndDate || new Date().toISOString(),
            executionTime: executionTime || 0, // In milliseconds
        };

        try {
            const response = await axios.post(endpoint, payload, {
                headers: this.getHeaders(),
            });
            logger.info(
                `Test execution logged for ${testCaseKey} with status: ${status}, end date: ${actualEndDate}, execution time: ${executionTime} ms`
            );
        } catch (error) {
            logger.error(`Error logging test execution for ${testCaseKey}:`, error);
            throw new Error(`Failed to log test execution for ${testCaseKey}`);
        }
    }
}

export default ZephyrInteractor;