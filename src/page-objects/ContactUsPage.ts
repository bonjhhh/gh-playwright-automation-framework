import { BasePage } from "../page-objects/base/BasePage"

export class ContactUsPage extends BasePage {
    //type a first name
    public async fillFirstName(firstName?: string | null): Promise<void> {
        const firstNameField = this.page.getByPlaceholder('First Name');
    
        // Wait for the field to be visible
        await firstNameField.waitFor({ state: 'visible' });
    
        // Clear the field or fill with the provided value
        if (!firstName) {
            console.log("Filling with no value (empty input)");
            await firstNameField.fill(''); // Clear the field or leave it empty
        } else {
            console.log(`Filling with value: ${firstName}`);
            await firstNameField.fill(firstName); // Fill with the provided value
        }
    }
    
    

    //type a last name
    public async fillLastName(lastName: string | null | undefined): Promise<void> {
        const lastNameField = this.page.locator('[placeholder="Last Name"]'); // Locator for the last name field
    
        // Wait for the field to be visible before interacting
        await lastNameField.waitFor({ state: 'visible' });
    
        // Check if lastName is null, empty string, or undefined, and fill accordingly
        if (lastName === null || lastName === "" || lastName === undefined) {
            console.log("Filling with no value (empty input)");
            await lastNameField.fill(''); // Clear the field or leave it empty
        } else {
            console.log(`Filling with value: ${lastName}`);
            await lastNameField.fill(lastName); // Fill the field with the provided value
        }
    }
    

    //type am email address
    public async fillEmailAddress(emailAddress: string): Promise<void> {
        const emailAddressField = this.page.getByPlaceholder('Email Address');
        if (emailAddress === "null" || emailAddress === "") {
            await emailAddressField.fill('');
        } else {
            await emailAddressField.fill(emailAddress);
        }
    }

    //type a comment
    public async fillComment(comment: string): Promise<void> {
        const commentsField = this.page.getByPlaceholder('Comments');
        if (comment === "null" || comment === "") {
            await commentsField.fill('');
        } else {
            await commentsField.fill(comment);
        }
    }


    //click on submit button
    public async clickOnSubmitButton(): Promise<void> {
        await this.page.waitForSelector('input[value="SUBMIT"]');
        await this.page.click('input[value="SUBMIT"]');
    }

    //get successful message
    public async getSuccessfulMessage(): Promise<string> {
        await this.page.waitForSelector('#contact_reply h1', { timeout: 60000 });
        return await this.page.innerText('#contact_reply h1');
    }

    //get error page
    public async getErrorMessage(): Promise<string> {
        await this.page.waitForSelector("body");
        const bodyElement = await this.page.locator("body");
        const bodyText = await bodyElement.textContent();
        return bodyText ?? ''; //If bodyText is null, return an empty string
    }

    //get header text
    public async getHeaderText(message: string): Promise<string> {
        //wait for the target elements
        await this.page.waitForSelector("//h1 | //body", { state: 'visible' });

        //get all elements
        const elements = await this.page.locator("//h1 | //body").elementHandles();

        let foundElementText = '';

        //loop through each of the elements
        for (let element of elements) {
            //get the inner text of the element
            let text = await element.innerText();

            //if statement to check whether text includes expected text
            if (text.includes(message)) {
                foundElementText = text;
                break;
            }
        }
        return foundElementText;
    }
}