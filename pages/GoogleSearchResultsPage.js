const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage.js');

class GoogleSearchResultsPage extends BasePage {
  constructor(driver) {
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
   * @returns {Promise<boolean>}
   */
  async areResultsDisplayed() {
    return await this.isDisplayed(this.locators.results);
  }

  /**
   * Get result stats text
   * @returns {Promise<string>}
   */
  async getResultStats() {
    return await this.getText(this.locators.resultStats);
  }

  /**
   * Get first result title
   * @returns {Promise<string>}
   */
  async getFirstResultTitle() {
    return await this.getText(this.locators.firstResult);
  }

  /**
   * Click on first result
   */
  async clickFirstResult() {
    await this.click(this.locators.firstResult);
  }
}

module.exports = GoogleSearchResultsPage;
