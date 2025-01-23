const fs = require('fs');
const { existsSync, readFileSync, writeFileSync } = require('fs');

// Path to Cucumber report.json
const path = 'reports/report.json';

let results;

// Read the test profile / coverage name to an environment variable
const npmTestProfile = process.env.TEST_PROFILE || 'default-script-name'; // Default value in case environment variable is not set

if (existsSync(path)) {
  results = JSON.parse(readFileSync(path, 'utf-8'));
} else {
  console.error(`Error: ${path} does not exist.`);
  process.exit(1); // Exit with an error
}

// Calculate test stats
const totalTests = results.reduce((acc, feature) => acc + feature.elements.length, 0);

const passedTests = results.reduce((acc, feature) => {
  return acc + feature.elements.filter(element =>
    element.steps.every(step => step.result.status === 'passed')
  ).length;
}, 0);

const failedTests = results.reduce((acc, feature) => {
  return acc + feature.elements.filter(element =>
    element.steps.some(step => step.result.status === 'failed')
  ).length;
}, 0);

// Calculate step stats
const totalSteps = results.reduce((acc, feature) => {
  return acc + feature.elements.reduce((elemAcc, element) => {
    return elemAcc + element.steps.length;
  }, 0);
}, 0);

const passedSteps = results.reduce((acc, feature) => {
  return acc + feature.elements.reduce((elemAcc, element) => {
    return elemAcc + element.steps.filter(step => step.result.status === 'passed').length;
  }, 0);
}, 0);

const failedSteps = results.reduce((acc, feature) => {
  return acc + feature.elements.reduce((elemAcc, element) => {
    return elemAcc + element.steps.filter(step => step.result.status === 'failed').length;
  }, 0);
}, 0);

const status = failedTests === 0 ? 'PASSED' : 'FAILED';
const color = failedTests === 0 ? process.env.SUCCESS_COLOR : process.env.FAILURE_COLOR;
const executionTime = results.reduce((acc, feature) => {
  return acc + feature.elements.reduce((elemAcc, element) => {
    return elemAcc + element.steps.reduce((stepAcc, step) => {
      return stepAcc + (step.result.duration || 0);
    }, 0);
  }, 0);
}, 0);

const durationInMilliseconds = executionTime / 1000000; // Convert to milliseconds
const durationInSeconds = durationInMilliseconds / 1_000; // Convert to seconds
const formattedExecutionTime = `${(durationInMilliseconds / 60000).toFixed(2)} mins`; // Convert to minutes

console.log(`Duration in milliseconds: ${durationInMilliseconds} ms`);
console.log(`Duration in seconds: ${durationInSeconds.toFixed(2)} seconds`);
console.log(`Duration in minutes: ${formattedExecutionTime} minutes`);

// Construct Slack payload
const pipelineUrl = process.env.CI_PIPELINE_URL || 'Pipeline URL not available';

const payload = {
  channel: process.env.SLACK_CHANNEL,
  text: `*Test Result Notification*\n\n*Status:* :${status === 'PASSED' ? 'white_check_mark' : 'x'}: *${status}*\n*Total Tests:* ${totalTests}\n*Total Steps:* ${totalSteps}\n*Passed Steps:* ${passedSteps}\n*Failed Steps:* ${failedSteps}\n*Passed Tests:* ${passedTests}\n*Failed Tests:* ${failedTests}\n*Execution Time:* ${formattedExecutionTime}\n*Pipeline URL:* <${pipelineUrl}|View Pipeline>\n*NPM Test Profile:* ${npmTestProfile}`,
  attachments: [
    {
      color: color,
      title: 'Cucumber Test Result',
      text: `Pipeline URL: <${pipelineUrl}|View Pipeline>`,
      image_url: failedTests === 0
        ? 'https://via.placeholder.com/300x100/36a64f/FFFFFF?text=Test+Pass'
        : 'https://via.placeholder.com/300x100/ff0000/FFFFFF?text=Test+Fail',
      thumb_url: failedTests === 0
        ? 'https://via.placeholder.com/75x75/36a64f/FFFFFF?text=Test+Pass'
        : 'https://via.placeholder.com/75x75/ff0000/FFFFFF?text=Test+Fail',
    },
  ],
};

// Save payload to file
writeFileSync('payload.json', JSON.stringify(payload));