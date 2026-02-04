const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const edge = require('selenium-webdriver/edge');
const browserConfig = require('../config/browser.config');

class DriverManager {
  constructor() {
    this.driver = null;
  }

  /**
   * Initialize WebDriver based on configuration
   * @returns {Promise<WebDriver>}
   */
  async initDriver() {
    const { browser, headless, windowWidth, windowHeight, implicitWait, pageLoadTimeout } = browserConfig;

    let builder = new Builder().forBrowser(browser);

    // Configure browser-specific options
    switch (browser.toLowerCase()) {
      case 'chrome':
        const chromeOptions = new chrome.Options();
        if (headless) {
          chromeOptions.addArguments('--headless');
          chromeOptions.addArguments('--disable-gpu');
        }
        chromeOptions.addArguments('--no-sandbox');
        chromeOptions.addArguments('--disable-dev-shm-usage');
        chromeOptions.addArguments(`--window-size=${windowWidth},${windowHeight}`);
        builder.setChromeOptions(chromeOptions);
        break;

      case 'firefox':
        const firefoxOptions = new firefox.Options();
        if (headless) {
          firefoxOptions.addArguments('-headless');
        }
        firefoxOptions.setPreference('width', windowWidth);
        firefoxOptions.setPreference('height', windowHeight);
        builder.setFirefoxOptions(firefoxOptions);
        break;

      case 'edge':
        const edgeOptions = new edge.Options();
        if (headless) {
          edgeOptions.addArguments('--headless');
        }
        edgeOptions.addArguments(`--window-size=${windowWidth},${windowHeight}`);
        builder.setEdgeOptions(edgeOptions);
        break;

      default:
        throw new Error(`Unsupported browser: ${browser}`);
    }

    this.driver = await builder.build();

    // Set timeouts
    await this.driver.manage().setTimeouts({
      implicit: implicitWait,
      pageLoad: pageLoadTimeout,
    });

    // Maximize window if not headless
    if (!headless) {
      await this.driver.manage().window().maximize();
    }

    return this.driver;
  }

  /**
   * Get current driver instance
   * @returns {WebDriver}
   */
  getDriver() {
    if (!this.driver) {
      throw new Error('Driver not initialized. Call initDriver() first.');
    }
    return this.driver;
  }

  /**
   * Quit driver instance
   * @returns {Promise<void>}
   */
  async quitDriver() {
    if (this.driver) {
      await this.driver.quit();
      this.driver = null;
    }
  }
}

module.exports = DriverManager;
