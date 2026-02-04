import { By, WebDriver } from 'selenium-webdriver';
import BasePage from './BasePage';

class GoogleHomePage extends BasePage {
  private url: string;
  public locators: {
    searchInput: By;
    searchButton: By;
    luckyButton: By;
    logo: By;
  };

  constructor(driver: WebDriver) {
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
  async open(): Promise<void> {
    await this.navigate(this.url);
  }

  /**
   * Perform search
   * @param query - Search query string
   */
  async search(query: string): Promise<void> {
    await this.type(this.locators.searchInput, query);
    await this.click(this.locators.searchButton);
  }

  /**
   * Check if logo is displayed
   */
  async isLogoDisplayed(): Promise<boolean> {
    return await this.isDisplayed(this.locators.logo);
  }

  /**
   * Get search input placeholder
   */
  async getSearchPlaceholder(): Promise<string> {
    return await this.getAttribute(this.locators.searchInput, 'placeholder');
  }
}

export default GoogleHomePage;
