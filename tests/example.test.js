const TestBase = require('../helpers/TestBase.js');
const { By } = require('selenium-webdriver');
const BasePage = require('../pages/BasePage.js');
const AllureHelper = require('../helpers/AllureHelper.js');

describe('Example.com Tests', () => {
  let testBase;
  let driver;
  let page;

  beforeEach(async () => {
    testBase = new TestBase();
    await testBase.setup();
    driver = testBase.getDriver();
    page = new BasePage(driver);
  });

  afterEach(async () => {
    await testBase.teardown({ testPath: __filename });
  });

  test('should load example.com and verify title', async () => {
    // Add Allure metadata
    AllureHelper.addFeature('Basic Navigation');
    AllureHelper.addStory('Page Load');
    AllureHelper.addSeverity('critical');
    AllureHelper.addDescription('Verify that example.com loads successfully');
    AllureHelper.addTag('smoke');

    await AllureHelper.addStep('Navigate to example.com', async () => {
      await page.navigate('https://example.com');
    });

    await AllureHelper.addStep('Verify page title', async () => {
      const title = await page.getTitle();
      expect(title).toBe('Example Domain');
    });

    await AllureHelper.addStep('Verify URL', async () => {
      const url = await page.getCurrentUrl();
      expect(url).toContain('example.com');
    });
  });

  test('should verify heading text on example.com', async () => {
    // Add Allure metadata
    AllureHelper.addFeature('Basic Navigation');
    AllureHelper.addStory('Content Verification');
    AllureHelper.addSeverity('normal');
    AllureHelper.addDescription('Verify heading text on example.com');

    await AllureHelper.addStep('Navigate to example.com', async () => {
      await page.navigate('https://example.com');
    });

    await AllureHelper.addStep('Verify heading text', async () => {
      const heading = await page.getText(By.css('h1'));
      expect(heading).toBe('Example Domain');
    });
  });

  test('should verify link is present on example.com', async () => {
    // Add Allure metadata
    AllureHelper.addFeature('Basic Navigation');
    AllureHelper.addStory('Link Verification');
    AllureHelper.addSeverity('minor');
    AllureHelper.addDescription('Verify that "More information" link is present');

    await AllureHelper.addStep('Navigate to example.com', async () => {
      await page.navigate('https://example.com');
    });

    await AllureHelper.addStep('Verify link is displayed', async () => {
      const isLinkDisplayed = await page.isDisplayed(By.linkText('More information...'));
      expect(isLinkDisplayed).toBe(true);
    });
  });
});
