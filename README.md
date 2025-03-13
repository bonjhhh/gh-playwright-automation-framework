# Playwright Automation Framework

## Overview

This repository contains a test automation framework built using Playwright, Cucumber, and Artillery. It is designed to automate UI and API testing, providing a robust and scalable solution for end-to-end testing.

## Project Structure

```
.env
.gitignore
.gitlab-ci.yml
package.json
playwright-report.json
playwright.config.gitlab.ci-cd.ts
playwright.config.ts
results.json
storageState.json
tsconfig.json
.github/
  workflows/
    ci_cd.yml
.vscode/
  settings.json
code_archive/
  .gitlab-ci-v1.yml
  hooks_v1.ts
playwright-report/
  index.html
reports/
  report.html
  report.json
src/
  index.ts
  artillery-tests/
    readme.io
    api/
    ui/
  features/
    api/
    ui/
  fixtures/
    config/
    api/
    ui/
  logger/
  page-objects/
  playwright-tests/
  step-definitions/
  utils/
```

## Key Components

### Configuration Files

- **.env**: Contains environment variables for configuring the test framework.
- **package.json**: Defines project dependencies and scripts.
- **playwright.config.ts**: Configuration for Playwright tests.
- **tsconfig.json**: TypeScript configuration.

### Source Code

- **src/index.ts**: Entry point for running tests.
- **src/artillery-tests/**: Contains Artillery load test configurations and scripts.
- **src/features/**: Contains Cucumber feature files for defining test scenarios.
- **src/fixtures/**: Contains test data and configurations.
- **src/logger/**: Logger setup using Winston.
- **src/page-objects/**: Page Object Model (POM) classes for UI tests.
- **src/playwright-tests/**: Playwright test scripts.
- **src/step-definitions/**: Step definitions for Cucumber tests.
- **src/utils/**: Utility functions and custom reporters.

## Running Tests

### Prerequisites

- Node.js (version 20 or later)
- Playwright

### Setup

1. Install dependencies:

    ```sh
    npm ci
    ```

2. Install Playwright browsers:

    ```sh
    npx playwright install --with-deps
    ```

### Running Tests

#### Cucumber Tests

To run Cucumber tests, use the following command:

```sh
npm run cucumber <profile>
```

Replace `<profile>` with the desired test profile (e.g., `smoke`, `regression`).

#### Playwright Tests

To run Playwright tests, use the following command:

```sh
npm run playwright-tests
```

### CI/CD Integration

The project includes CI/CD configurations for GitLab and GitHub Actions:

- **.gitlab-ci.yml**: GitLab CI/CD pipeline configuration.
- **.github/workflows/ci_cd.yml**: GitHub Actions workflow configuration.

## Environment Variables

The `.env` file contains environment variables for configuring the test framework. Key variables include:

- `UI_AUTOMATION_BROWSER`: Browser to use for UI tests (e.g., `chromium`).
- `HEADLESS`: Run tests in headless mode (`true` or `false`).
- `LOG_LEVEL`: Logging level (`error`, `warn`, `info`).
- `ZEPHYR_BASE_URL`: Base URL for Zephyr Scale API.
- `ZEPHYR_API_TOKEN`: API token for Zephyr Scale.
- `SLACK_WEBHOOK_URL`: Webhook URL for Slack notifications.

## Logging

Logging is configured using Winston. The log level can be set using the `LOG_LEVEL` environment variable.