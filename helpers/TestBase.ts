import { WebDriver } from 'selenium-webdriver';
import DriverManager from '../drivers/DriverManager';
import { takeScreenshot } from '../utils/screenshot.util';
import browserConfig from '../config/browser.config';

interface TestInfo {
  testPath?: string;
  testName?: string;
}

class TestBase {
  private driverManager: DriverManager | null;
  protected driver: WebDriver | null;

  constructor() {
    this.driverManager = null;
    this.driver = null;
  }

  /**
   * Setup test - runs before each test
   */
  async setup(): Promise<void> {
    this.driverManager = new DriverManager();
    this.driver = await this.driverManager.initDriver();
  }

  /**
   * Teardown test - runs after each test
   */
  async teardown(testInfo: TestInfo = {}): Promise<void> {
    // Take screenshot on failure
    if (this.driver && browserConfig.screenshotsOnFailure && testInfo.testPath) {
      const testName = testInfo.testPath.split('/').pop()?.replace('.test.ts', '') || 'test';
      await takeScreenshot(this.driver, `${testName}_failure`);
    }

    // Quit driver
    if (this.driverManager) {
      await this.driverManager.quitDriver();
    }
  }

  /**
   * Get driver instance
   */
  getDriver(): WebDriver {
    if (!this.driver) {
      throw new Error('Driver not initialized. Call setup() first.');
    }
    return this.driver;
  }
}

export default TestBase;
