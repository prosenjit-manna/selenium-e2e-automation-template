import TestBase from '../helpers/TestBase';
import GoogleHomePage from '../pages/GoogleHomePage';
import GoogleSearchResultsPage from '../pages/GoogleSearchResultsPage';
import AllureHelper from '../helpers/AllureHelper';
import { WebDriver } from 'selenium-webdriver';

describe('Google Search Tests (TypeScript)', () => {
  let testBase: TestBase;
  let driver: WebDriver;
  let homePage: GoogleHomePage;
  let resultsPage: GoogleSearchResultsPage;

  beforeEach(async () => {
    testBase = new TestBase();
    await testBase.setup();
    driver = testBase.getDriver();
    homePage = new GoogleHomePage(driver);
    resultsPage = new GoogleSearchResultsPage(driver);
  });

  afterEach(async () => {
    await testBase.teardown({ testPath: __filename });
  });

  test('should load Google home page successfully', async () => {
    // Add Allure metadata
    AllureHelper.addFeature('Search');
    AllureHelper.addStory('Google Home Page');
    AllureHelper.addSeverity('critical');
    AllureHelper.addDescription('Verify that Google home page loads successfully');

    await AllureHelper.addStep('Open Google home page', async () => {
      await homePage.open();
    });

    await AllureHelper.addStep('Verify logo is displayed', async () => {
      const isLogoDisplayed = await homePage.isLogoDisplayed();
      expect(isLogoDisplayed).toBe(true);
    });

    await AllureHelper.addStep('Verify page title', async () => {
      const title = await homePage.getTitle();
      expect(title).toContain('Google');
    });
  });

  test('should perform search and display results', async () => {
    // Add Allure metadata
    AllureHelper.addFeature('Search');
    AllureHelper.addStory('Search Functionality');
    AllureHelper.addSeverity('critical');
    AllureHelper.addDescription('Verify that search functionality works correctly');
    AllureHelper.addTag('smoke');

    const searchQuery = 'Selenium WebDriver TypeScript';

    await AllureHelper.addStep('Open Google home page', async () => {
      await homePage.open();
    });

    await AllureHelper.addStep(`Search for "${searchQuery}"`, async () => {
      await homePage.search(searchQuery);
    });

    await AllureHelper.addStep('Verify search results are displayed', async () => {
      const areResultsDisplayed = await resultsPage.areResultsDisplayed();
      expect(areResultsDisplayed).toBe(true);
    });

    await AllureHelper.addStep('Verify result stats are displayed', async () => {
      const resultStats = await resultsPage.getResultStats();
      expect(resultStats).toBeTruthy();
    });
  });

  test('should display search input on home page', async () => {
    // Add Allure metadata
    AllureHelper.addFeature('Search');
    AllureHelper.addStory('UI Elements');
    AllureHelper.addSeverity('normal');
    AllureHelper.addDescription('Verify search input is visible and functional');

    await AllureHelper.addStep('Open Google home page', async () => {
      await homePage.open();
    });

    await AllureHelper.addStep('Verify search input is displayed', async () => {
      const isDisplayed = await homePage.isDisplayed(homePage.locators.searchInput);
      expect(isDisplayed).toBe(true);
    });

    await AllureHelper.addStep('Verify search input is enabled', async () => {
      const isEnabled = await homePage.isEnabled(homePage.locators.searchInput);
      expect(isEnabled).toBe(true);
    });
  });
});
