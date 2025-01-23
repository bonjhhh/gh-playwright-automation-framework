import { Given, When, Then } from "@cucumber/cucumber";
import APIClient from "../../utils/APIClient";
import logger from "../../logger/logger";
import { expect } from "@playwright/test";
import { userPayloads } from "../../fixtures/api/userPayloads";

// Define the valid keys for userPayloads
type UserPayloadKeys = keyof typeof userPayloads;

let response: any;
let requestBody: any;

Given("I set the API endpoint to {string}", function (endpoint: string) {
  this.apiEndpoint = endpoint;
  logger.info(`API endpoint set to: ${endpoint}`);
});

Given("I set the request body to:", function (body: string) {
  try {
    requestBody = JSON.parse(body);
    logger.info(`Request body set to: ${JSON.stringify(requestBody)}`);
  } catch (error) {
    logger.error("Invalid JSON in request body");
    throw new Error("Request body must be valid JSON.");
  }
});

Given("I set the request body using {string} payload", function (payloadKey: UserPayloadKeys) {
  if (userPayloads[payloadKey]) {
    requestBody = userPayloads[payloadKey];
    logger.info(`Request body set to payload: ${JSON.stringify(requestBody)}`);
  } else {
    logger.error(`Payload with key "${payloadKey}" not found in userPayloads.`);
    throw new Error(`Payload with key "${payloadKey}" not found.`);
  }
});

When("I send a GET request to the endpoint", async function () {
  try {
    response = await APIClient.get(this.apiEndpoint);
    logger.info(`GET request response received with status: ${response.status}`);
    logger.debug(`Response body: ${JSON.stringify(response.data)}`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`GET request failed: ${error.message}`);
      throw error;
    } else {
      logger.error("An unknown error occurred during GET request.");
      throw new Error("Unknown error occurred during GET request.");
    }
  }
});

When("I send a POST request to the endpoint", async function () {
  try {
    response = await APIClient.post(this.apiEndpoint, requestBody);
    logger.info(`POST request response received with status: ${response.status}`);
    logger.debug(`Response body: ${JSON.stringify(response.data)}`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`POST request failed: ${error.message}`);
      throw error;
    } else {
      logger.error("An unknown error occurred during POST request.");
      throw new Error("Unknown error occurred during POST request.");
    }
  }
});

When("I send a PUT request to the endpoint", async function () {
  try {
    response = await APIClient.put(this.apiEndpoint, requestBody);
    logger.info(`PUT request response received with status: ${response.status}`);
    logger.debug(`Response body: ${JSON.stringify(response.data)}`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`PUT request failed: ${error.message}`);
      throw error;
    } else {
      logger.error("An unknown error occurred during PUT request.");
      throw new Error("Unknown error occurred during PUT request.");
    }
  }
});

Then("the response should include the updated user", function () {
  try {
    expect(response.data.name).toBeDefined();
    expect(response.data.job).toBeDefined();
    logger.info(`Updated user details validated: ${JSON.stringify(response.data)}`);
  } catch (error) {
    logger.error("Response does not include expected updated user details.");
    throw error;
  }
});


Then("the response status should be {int}", function (expectedStatus: number) {
  try {
    expect(response.status).toBe(expectedStatus);
    logger.info(`Response status matched expected status: ${expectedStatus}`);
  } catch (error) {
    logger.error(`Expected status ${expectedStatus} but got ${response.status}`);
    throw error;
  }
});

Then("the response should include a list of users", function () {
  try {
    expect(response.data.data).toBeDefined();
    expect(Array.isArray(response.data.data)).toBe(true);
    logger.info("Response contains a valid list of users.");
  } catch (error) {
    logger.error("Response does not include a valid list of users.");
    throw error;
  }
});

Then("the response should include the created user", function () {
  try {
    expect(response.data.name).toBeDefined();
    expect(response.data.job).toBeDefined();
    logger.info(`Created user details validated: ${JSON.stringify(response.data)}`);
  } catch (error) {
    logger.error("Response does not include expected created user details.");
    throw error;
  }
});
