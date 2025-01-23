import { setDefaultTimeout } from "@cucumber/cucumber";

const customTimeout = parseInt(process.env?.CUCUMBER_CUSTOM_TIMEOUT || '60000');

//If too low this will affect playwright timeouts
//Example exception: 'Error: function timed out, ensure the promise resolves within 20000 milliseconds'
setDefaultTimeout(customTimeout); //60 seconds