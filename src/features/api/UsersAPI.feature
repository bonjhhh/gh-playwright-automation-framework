@regression @users-api
Feature: Users API Tests

  @zephyr:SCRUM-T17
  Scenario: Get a list of users
    Given I set the API endpoint to "https://reqres.in/api/users?page=2"
    When I send a GET request to the endpoint
    Then the response status should be 200
    And the response should include a list of users

  @zephyr:SCRUM-T18
  Scenario: Create a new user
    Given I set the API endpoint to "https://reqres.in/api/users"
    And I set the request body using "createUser" payload
    When I send a POST request to the endpoint
    Then the response status should be 201
    And the response should include the created user

  @zephyr:SCRUM-T19
  Scenario: Update an existing user
    Given I set the API endpoint to "https://reqres.in/api/users/2"
    And I set the request body using "updateUser" payload
    When I send a PUT request to the endpoint
    Then the response status should be 200
    And the response should include the updated user
