import { By, WebDriver } from 'selenium-webdriver';
import BasePage from './BasePage';

class GoogleSearchResultsPage extends BasePage {
  public locators: {
    searchInput: By;
    results: By;
    resultStats: By;
    firstResult: By;
  };

  constructor(driver: WebDriver) {
    super(driver);
    
    // Locators
    this.locators = {
      searchInput: By.name('q'),
      results: By.id('search'),
      resultStats: By.id('result-stats'),
      firstResult: By.css('#search .g:first-child h3'),
    };
  }

  /**
   * Check if results are displayed
   */
  async areResultsDisplayed(): Promise<boolean> {
    return await this.isDisplayed(this.locators.results);
  }

  /**
   * Get result stats text
   */
  async getResultStats(): Promise<string> {
    return await this.getText(this.locators.resultStats);
  }

  /**
   * Get first result title
   */
  async getFirstResultTitle(): Promise<string> {
    return await this.getText(this.locators.firstResult);
  }

  /**
   * Click on first result
   */
  async clickFirstResult(): Promise<void> {
    await this.click(this.locators.firstResult);
  }
}

export default GoogleSearchResultsPage;
