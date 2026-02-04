require('dotenv').config();

const browserConfig = {
  browser: process.env.BROWSER || 'chrome',
  headless: process.env.HEADLESS === 'true',
  windowWidth: parseInt(process.env.WINDOW_WIDTH) || 1920,
  windowHeight: parseInt(process.env.WINDOW_HEIGHT) || 1080,
  implicitWait: parseInt(process.env.IMPLICIT_WAIT) || 10000,
  explicitWait: parseInt(process.env.EXPLICIT_WAIT) || 20000,
  pageLoadTimeout: parseInt(process.env.PAGE_LOAD_TIMEOUT) || 30000,
  baseUrl: process.env.BASE_URL || 'https://example.com',
  screenshotsOnFailure: process.env.SCREENSHOTS_ON_FAILURE === 'true',
};

module.exports = browserConfig;
