const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage.js');

class GoogleHomePage extends BasePage {
  constructor(driver) {
    super(driver);
    this.url = 'https://www.google.com';
    
    // Locators
    this.locators = {
      searchInput: By.name('q'),
      searchButton: By.name('btnK'),
      luckyButton: By.name('btnI'),
      logo: By.id('hplogo'),
    };
  }

  /**
   * Navigate to Google home page
   */
  async open() {
    await this.navigate(this.url);
  }

  /**
   * Perform search
   * @param {string} query
   */
  async search(query) {
    await this.type(this.locators.searchInput, query);
    await this.click(this.locators.searchButton);
  }

  /**
   * Check if logo is displayed
   * @returns {Promise<boolean>}
   */
  async isLogoDisplayed() {
    return await this.isDisplayed(this.locators.logo);
  }

  /**
   * Get search input placeholder
   * @returns {Promise<string>}
   */
  async getSearchPlaceholder() {
    return await this.getAttribute(this.locators.searchInput, 'placeholder');
  }
}

module.exports = GoogleHomePage;
