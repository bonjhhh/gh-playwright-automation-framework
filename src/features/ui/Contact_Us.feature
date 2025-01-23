@regression @contact-us
Feature: WebdriverUniversity.com - Contact Us Page

    Background: Pre conditions
        Given I navigate to the webdriveruniversity homepage
        When I click on the contact us button
        And I switch to the new browser tab

    @zephyr:SCRUM-T1
    Scenario: Valid Contact Us Form Submission
        And I type a first name
        And I type a last name
        And I enter an email address
        And I type a comment
        And I click on the submit button
        Then I should be presented with a successful contact us submission message

    @zephyr:SCRUM-T2
    Scenario: Invalid Contact Us Form Submission
        And I type a first name
        And I type a last name
        #And I enter an email address
        And I type a comment
        And I click on the submit button
        Then I should be presented with a unsuccessful contact us message

    @zephyr:SCRUM-T5
    Scenario: Valid Contact Us Form Submission - Using Specific Data
        And I type a specific first name "Sarah"
        And I type a specific last name "Woods"
        And I enter a specific email address "sarah_woods@example.com"
        And I type specific text "Hello world" and a number 2 within the comment input field
        And I click on the submit button
        Then I should be presented with a successful contact us submission message

    @zephyr:SCRUM-T6
    Scenario: Contact Us Form Submission - Using Random Data
        And I type a random first name
        And I type a random last name
        And I enter a random email address
        #And I type a comment
        And I type a random comment
        And I click on the submit button
        Then I should be presented with a successful contact us submission message

    @smoke
    Scenario Outline: Validate Contact Us Page
        And I type a first name <firstName> and a last name <lastName>
        And I type a email address '<emailAddress>' and a comment '<comment>'
        And I click on the submit button
        Then I should be presented with header text '<message>'

        Examples:
            | firstName | lastName  | emailAddress              | comment                 | message                     | testCaseKey |
            | John      | Jones     | john_jones@example.com    | Hello world?            | Thank You for your Message! | SCRUM-T7    |
            | Mia       | Carter    | mia_carter123@example.com | Test123 Test123         | Thank You for your Message! | SCRUM-T8    |
            | Grace     | Hudson    | grace_hudson              | Do you create websites? | Invalid email address       | SCRUM-T9    |
            | ""        | Vamos     | Belly@yahoo.com           | No first name           | all fields are required     | SCRUM-T13   |
            | Bentot    | undefined | Bellya@yahoo.com          | No last name            | all fields are required     | SCRUM-T14   |
            | Bentot    | Cccc      | Bellyc@yahoo.com          |                         | all fields are required     | SCRUM-T15   |
            | Bentot    | Cccc      |                           | No email                | Invalid email address       | SCRUM-T16   |