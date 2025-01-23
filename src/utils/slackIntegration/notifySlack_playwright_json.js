const fs = require('fs');
const { existsSync, readFileSync, writeFileSync } = require('fs');
// const path = 'playwright-report/results.json';
const path = 'reports/report.json'; //cucumber reports

let results;

// Read the test profile / coverage name to an environment variable
const npmTestProfile = process.env.TEST_PROFILE || 'default-script-name'; // Default value in case environment variable is not set

if (existsSync(path)) {
  results = JSON.parse(readFileSync(path, 'utf-8'));
  // Process results...
} else {
  console.error(`Error: ${path} does not exist.`);
  process.exit(1); // Exit with an error
}

// Calculate test stats
const totalTests = results.suites.reduce((acc, suite) => {
  return acc + suite.specs.reduce((suiteAcc, spec) => suiteAcc + spec.tests.length, 0);
}, 0);

const passedTests = results.suites.reduce((acc, suite) => {
  return acc + suite.specs.reduce((suiteAcc, spec) => {
    return suiteAcc + spec.tests.filter(test => test.results[0].status === 'passed').length;
  }, 0);
}, 0);

const failedTests = results.suites.reduce((acc, suite) => {
  return acc + suite.specs.reduce((suiteAcc, spec) => {
    return suiteAcc + spec.tests.filter(test => test.results[0].status === 'failed').length;
  }, 0);
}, 0);

const status = failedTests === 0 ? 'PASSED' : 'FAILED';
const color = failedTests === 0 ? process.env.SUCCESS_COLOR : process.env.FAILURE_COLOR;
const executionTime = `${(results.stats.duration / 60000).toFixed(2)} mins`;

// Construct Slack payload
const pipelineUrl = process.env.CI_PIPELINE_URL || 'Pipeline URL not available'; // Use your CI/CD environment variable for pipeline URL

const payload = {
  channel: process.env.SLACK_CHANNEL,
  text: `*Test Result Notification*\n\n*Status:* :${status === 'PASSED' ? 'white_check_mark' : 'x'}: *${status}*\n*Total Tests:* ${totalTests}\n*Total Steps:* ${totalSteps}\n*Passed Steps:* ${passedSteps}\n*Failed Steps:* ${failedSteps}\n*Passed Tests:* ${passedTests}\n*Failed Tests:* ${failedTests}\n*Execution Time:* ${formattedExecutionTime}\n*Pipeline URL:* <${pipelineUrl}|View Pipeline>\n*NPM Test Profile:* ${npmTestProfile}`,
  attachments: [
    {
      color: color,
      title: 'Playwright Test Result',
      text: `Pipeline URL: <${pipelineUrl}|View Pipeline>`,
      image_url: failedTests === 0 
        ? 'https://via.placeholder.com/300x100/36a64f/FFFFFF?text=Test+Pass' 
        : 'https://via.placeholder.com/300x100/ff0000/FFFFFF?text=Test+Fail',
      thumb_url: failedTests === 0 
        ? 'https://via.placeholder.com/75x75/36a64f/FFFFFF?text=Test+Pass' 
        : 'https://via.placeholder.com/75x75/ff0000/FFFFFF?text=Test+Fail'
    },
  ],
};

// Save payload to file
writeFileSync('payload.json', JSON.stringify(payload));