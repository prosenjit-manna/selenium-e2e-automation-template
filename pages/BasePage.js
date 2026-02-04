const { By, until } = require('selenium-webdriver');
const browserConfig = require('../config/browser.config');
const { takeScreenshot } = require('../utils/screenshot.util');

class BasePage {
  constructor(driver) {
    this.driver = driver;
    this.timeout = browserConfig.explicitWait;
  }

  /**
   * Navigate to URL
   * @param {string} url
   */
  async navigate(url) {
    await this.driver.get(url);
  }

  /**
   * Wait for element to be located
   * @param {By} locator
   * @param {number} timeout
   * @returns {Promise<WebElement>}
   */
  async waitForElement(locator, timeout = this.timeout) {
    return await this.driver.wait(until.elementLocated(locator), timeout);
  }

  /**
   * Wait for element to be visible
   * @param {By} locator
   * @param {number} timeout
   * @returns {Promise<WebElement>}
   */
  async waitForVisible(locator, timeout = this.timeout) {
    const element = await this.waitForElement(locator, timeout);
    return await this.driver.wait(until.elementIsVisible(element), timeout);
  }

  /**
   * Wait for element to be clickable
   * @param {By} locator
   * @param {number} timeout
   * @returns {Promise<WebElement>}
   */
  async waitForClickable(locator, timeout = this.timeout) {
    const element = await this.waitForElement(locator, timeout);
    await this.driver.wait(until.elementIsVisible(element), timeout);
    await this.driver.wait(until.elementIsEnabled(element), timeout);
    return element;
  }

  /**
   * Click on element
   * @param {By} locator
   */
  async click(locator) {
    const element = await this.waitForClickable(locator);
    await element.click();
  }

  /**
   * Type text into element
   * @param {By} locator
   * @param {string} text
   */
  async type(locator, text) {
    const element = await this.waitForVisible(locator);
    await element.clear();
    await element.sendKeys(text);
  }

  /**
   * Get text from element
   * @param {By} locator
   * @returns {Promise<string>}
   */
  async getText(locator) {
    const element = await this.waitForVisible(locator);
    return await element.getText();
  }

  /**
   * Get attribute value from element
   * @param {By} locator
   * @param {string} attribute
   * @returns {Promise<string>}
   */
  async getAttribute(locator, attribute) {
    const element = await this.waitForVisible(locator);
    return await element.getAttribute(attribute);
  }

  /**
   * Check if element is displayed
   * @param {By} locator
   * @returns {Promise<boolean>}
   */
  async isDisplayed(locator) {
    try {
      const element = await this.driver.findElement(locator);
      return await element.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if element is enabled
   * @param {By} locator
   * @returns {Promise<boolean>}
   */
  async isEnabled(locator) {
    const element = await this.waitForElement(locator);
    return await element.isEnabled();
  }

  /**
   * Wait for element to disappear
   * @param {By} locator
   * @param {number} timeout
   */
  async waitForElementToDisappear(locator, timeout = this.timeout) {
    await this.driver.wait(until.stalenessOf(await this.driver.findElement(locator)), timeout);
  }

  /**
   * Execute JavaScript
   * @param {string} script
   * @param {...any} args
   * @returns {Promise<any>}
   */
  async executeScript(script, ...args) {
    return await this.driver.executeScript(script, ...args);
  }

  /**
   * Scroll to element
   * @param {By} locator
   */
  async scrollToElement(locator) {
    const element = await this.waitForElement(locator);
    await this.executeScript('arguments[0].scrollIntoView(true);', element);
  }

  /**
   * Get current URL
   * @returns {Promise<string>}
   */
  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }

  /**
   * Get page title
   * @returns {Promise<string>}
   */
  async getTitle() {
    return await this.driver.getTitle();
  }

  /**
   * Switch to iframe
   * @param {By|number|WebElement} frame
   */
  async switchToFrame(frame) {
    if (typeof frame === 'number') {
      await this.driver.switchTo().frame(frame);
    } else if (frame.constructor.name === 'By') {
      const element = await this.waitForElement(frame);
      await this.driver.switchTo().frame(element);
    } else {
      await this.driver.switchTo().frame(frame);
    }
  }

  /**
   * Switch to default content
   */
  async switchToDefaultContent() {
    await this.driver.switchTo().defaultContent();
  }

  /**
   * Take screenshot
   * @param {string} fileName
   */
  async takeScreenshot(fileName) {
    await takeScreenshot(this.driver, fileName);
  }

  /**
   * Refresh page
   */
  async refresh() {
    await this.driver.navigate().refresh();
  }

  /**
   * Go back
   */
  async goBack() {
    await this.driver.navigate().back();
  }

  /**
   * Go forward
   */
  async goForward() {
    await this.driver.navigate().forward();
  }
}

module.exports = BasePage;
