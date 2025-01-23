import { exec } from "child_process";

// Setting retry value from environment variables or defaulting to '0' or '1'
const parallelValue = process.env?.PARALLEL || '1';
const retryValue = process.env?.RETRY || '0';  // Used for Cucumber, but not needed for Playwright here
const browserType = process.env.UI_AUTOMATION_BROWSER || 'chromium'; // Default to 'chromium'

// Define a common command string for running cucumber tests
const common = `./src/features/**/*.feature \
  --require-module ts-node/register \
  --require ./src/step-definitions/**/**/*.ts \
  --require ./src/utils/cucumber-timeout.ts \
  -f json:./reports/report.json \
  --format html:./reports/report.html \
  --parallel ${parallelValue} \
  --retry ${retryValue} \
  --tags "not @ignore"`;

// Define a command string for Playwright tests (without the --retry flag)
const playwrightCommon = `npx playwright test \
  --config=playwright.config.ts`;

// Define an interface for the profiles object
interface ProfileCommands {
  [key: string]: string;
}

// Define command strings for different test profiles
const profiles: ProfileCommands = {
  smoke: `${common} --tags "@smoke"`,
  regression: `${common} --tags "@regression"`,
  login: `${common} --tags "@login"`,
  contactUs: `${common} --tags "@contact-us"`,
  usersAPI: `${common} --tags "@users-api"`, // API profile
  playwright: `${playwrightCommon}`, // Playwright tests profile
};

// Get the third command-line argument and assign it to the profile
// i.e. smoke, regression, etc.
const profile = process.argv[2];

// Save the test profile / coverage name to an environment variable
process.env.TEST_PROFILE = profile;

// Construct the command string based on the selected profile
let command: string;
if (profile === 'playwright') {
  command = profiles.playwright;  // Run Playwright tests
} else {
  command = `npx cucumber-js ${profiles[profile as keyof ProfileCommands]}`; // Run Cucumber tests
}

// Print the constructed command (optional for debugging)
console.log(`Running command: ${command}`);

// Execute the command
const testProcess = exec(command, { encoding: 'utf-8' });

// Output the command's stdout in real-time
testProcess.stdout?.on('data', (data) => {
  console.log(data); // Print the real-time output from the test process
});

// Output any errors or stderr in real-time
testProcess.stderr?.on('data', (data) => {
  console.error(data); // Print any errors in real-time
});

// Handle when the process is completed
testProcess.on('close', (code) => {
  if (code !== 0) {
    throw new Error('⚠️ 💥 Some automation test(s) have failed! - Please review. ⚠️ 💥');
  }
  console.log('Tests completed successfully');
});
