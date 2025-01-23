interface LoginData {
  username: string;
  password: string;
  expectedAlertText: string;
  testCaseKey: string;
}

export const userPayloads: Record<string, LoginData> = {
  validLogin: {
    username: "webdriver",
    password: "webdriver123",
    expectedAlertText: "validation succeeded",
    testCaseKey: "SCRUM-T3",
  },
  invalidLogin: {
    username: "webdriver",
    password: "Password123",
    expectedAlertText: "validation failed",
    testCaseKey: "SCRUM-T4",
  },
  // Uncomment below for smoke tests
  // smokeLogin: {
  //   username: "webdriver",
  //   password: "webdriver123",
  //   expectedAlertText: "validation succeeded",
  //   testCaseKey: "SCRUM-T12",
  // },
};
