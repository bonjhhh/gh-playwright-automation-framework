const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');  // Use csv-writer package
require('dotenv').config(); // Load environment variables from .env file

// API Key
const API_KEY = process.env.API_KEY;

// Validate environment variables
if (!API_KEY) {
    console.error('ERROR: API_KEY is not defined.');
    process.exit(1); // Exit if critical env vars are missing
}

// Log the created pet
async function logCreatedPet(context, events, next) { 
    try {
        console.log('logCreatedPet function called');

        const createdPetId = context.vars.createdPetId;

        if (createdPetId) {
            const filePath = path.join(__dirname, 'created_pets.csv');
            
            // Check if the file exists
            let isFileExist = fs.existsSync(filePath);

            // Initialize CSV writer with header
            const csvWriter = createObjectCsvWriter({
                path: filePath,
                header: [
                    { id: 'petId', title: 'PET_ID' }  // Define the column title for the header
                ],
                append: true  // Append new rows if the file exists
            });

            // Prepare pet data as an array of objects
            const petData = [{ petId: createdPetId }];

            if (isFileExist) {
                // If the file exists, simply append the new pet ID
                await csvWriter.writeRecords(petData);
                console.log(`POST pet ID written to existing file: ${filePath}`);
            } else {
                // If the file doesn't exist, create it with the header and the pet ID
                await csvWriter.writeRecords(petData);
                console.log(`POST pet ID written to new file: ${filePath}`);
            }
        } else {
            console.error('Failed to create pet');
        }
    } catch (err) {
        console.error('Error in logCreatedPet:', err.message);
    }

    // Check if next is a function before calling it
    if (typeof next === 'function') {
        next(); // Ensure next is called only if it's a valid function
    } else {
        console.warn('next is not a function');
    }
}

// Set JSON body for requests
function setJSONBody(requestParams, context, events, next) {
    try {
        const filePath = path.join(__dirname, 'pet_payload.json');
        const jsonBody = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        jsonBody.id = generateRandomId();
        jsonBody.name = generateRandomName();
        jsonBody.category.id = generateRandomId();
        jsonBody.category.name = generateRandomName();

        requestParams.body = JSON.stringify(jsonBody);
        requestParams.headers = {
            ...requestParams.headers,
            'api_key': API_KEY
        };

        console.log('Request body set:', requestParams.body);
    } catch (err) {
        console.error('Error in setJSONBody:', err.message);
    }

    // Check if next is a function before calling it
    if (typeof next === 'function') {
        next(); // Ensure next is called only if it's a valid function
    } else {
        console.warn('next is not a function');
    }
}

// Generate random values
function generateRandomId() {
    return Math.floor(Math.random() * 1000000);
}

function generateRandomName() {
    const names = ['Fluffy', 'Buddy', 'Max', 'Bella', 'Charlie', 'Luna', 'Rocky', 'Milo'];
    return names[Math.floor(Math.random() * names.length)];
}

module.exports = {
    logCreatedPet,    
    setJSONBody
};