const DriverManager = require('../drivers/DriverManager');
const { takeScreenshot } = require('../utils/screenshot.util');
const browserConfig = require('../config/browser.config');

class TestBase {
  constructor() {
    this.driverManager = null;
    this.driver = null;
  }

  /**
   * Setup test - runs before each test
   */
  async setup() {
    this.driverManager = new DriverManager();
    this.driver = await this.driverManager.initDriver();
  }

  /**
   * Teardown test - runs after each test
   * @param {object} testInfo - Test information from Jest
   */
  async teardown(testInfo = {}) {
    // Take screenshot on failure
    if (this.driver && browserConfig.screenshotsOnFailure && testInfo.testPath) {
      const testName = testInfo.testPath.split('/').pop().replace('.test.js', '');
      await takeScreenshot(this.driver, `${testName}_failure`);
    }

    // Quit driver
    if (this.driverManager) {
      await this.driverManager.quitDriver();
    }
  }

  /**
   * Get driver instance
   * @returns {WebDriver}
   */
  getDriver() {
    return this.driver;
  }
}

module.exports = TestBase;
