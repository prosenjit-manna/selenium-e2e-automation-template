import { By, until, WebDriver, WebElement } from 'selenium-webdriver';
import browserConfig from '../config/browser.config';
import { takeScreenshot } from '../utils/screenshot.util';

class BasePage {
  protected driver: WebDriver;
  protected timeout: number;

  constructor(driver: WebDriver) {
    this.driver = driver;
    this.timeout = browserConfig.explicitWait;
  }

  /**
   * Navigate to URL
   */
  async navigate(url: string): Promise<void> {
    await this.driver.get(url);
  }

  /**
   * Wait for element to be located
   */
  async waitForElement(locator: By, timeout: number = this.timeout): Promise<WebElement> {
    return await this.driver.wait(until.elementLocated(locator), timeout);
  }

  /**
   * Wait for element to be visible
   */
  async waitForVisible(locator: By, timeout: number = this.timeout): Promise<WebElement> {
    const element = await this.waitForElement(locator, timeout);
    return await this.driver.wait(until.elementIsVisible(element), timeout);
  }

  /**
   * Wait for element to be clickable
   */
  async waitForClickable(locator: By, timeout: number = this.timeout): Promise<WebElement> {
    const element = await this.waitForElement(locator, timeout);
    await this.driver.wait(until.elementIsVisible(element), timeout);
    await this.driver.wait(until.elementIsEnabled(element), timeout);
    return element;
  }

  /**
   * Click on element
   */
  async click(locator: By): Promise<void> {
    const element = await this.waitForClickable(locator);
    await element.click();
  }

  /**
   * Type text into element
   */
  async type(locator: By, text: string): Promise<void> {
    const element = await this.waitForVisible(locator);
    await element.clear();
    await element.sendKeys(text);
  }

  /**
   * Get text from element
   */
  async getText(locator: By): Promise<string> {
    const element = await this.waitForVisible(locator);
    return await element.getText();
  }

  /**
   * Get attribute value from element
   */
  async getAttribute(locator: By, attribute: string): Promise<string> {
    const element = await this.waitForVisible(locator);
    return await element.getAttribute(attribute);
  }

  /**
   * Check if element is displayed
   */
  async isDisplayed(locator: By): Promise<boolean> {
    try {
      const element = await this.driver.findElement(locator);
      return await element.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if element is enabled
   */
  async isEnabled(locator: By): Promise<boolean> {
    const element = await this.waitForElement(locator);
    return await element.isEnabled();
  }

  /**
   * Wait for element to disappear
   */
  async waitForElementToDisappear(locator: By, timeout: number = this.timeout): Promise<void> {
    await this.driver.wait(until.stalenessOf(await this.driver.findElement(locator)), timeout);
  }

  /**
   * Execute JavaScript
   */
  async executeScript<T>(script: string, ...args: any[]): Promise<T> {
    return await this.driver.executeScript<T>(script, ...args);
  }

  /**
   * Scroll to element
   */
  async scrollToElement(locator: By): Promise<void> {
    const element = await this.waitForElement(locator);
    await this.executeScript('arguments[0].scrollIntoView(true);', element);
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return await this.driver.getCurrentUrl();
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.driver.getTitle();
  }

  /**
   * Switch to iframe
   */
  async switchToFrame(frame: By | number | WebElement): Promise<void> {
    if (typeof frame === 'number') {
      await this.driver.switchTo().frame(frame);
    } else if (frame instanceof By) {
      const element = await this.waitForElement(frame);
      await this.driver.switchTo().frame(element);
    } else {
      await this.driver.switchTo().frame(frame);
    }
  }

  /**
   * Switch to default content
   */
  async switchToDefaultContent(): Promise<void> {
    await this.driver.switchTo().defaultContent();
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(fileName: string): Promise<void> {
    await takeScreenshot(this.driver, fileName);
  }

  /**
   * Refresh page
   */
  async refresh(): Promise<void> {
    await this.driver.navigate().refresh();
  }

  /**
   * Go back
   */
  async goBack(): Promise<void> {
    await this.driver.navigate().back();
  }

  /**
   * Go forward
   */
  async goForward(): Promise<void> {
    await this.driver.navigate().forward();
  }
}

export default BasePage;
