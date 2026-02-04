# Selenium E2E Automation Template

A comprehensive end-to-end testing template using Selenium WebDriver, Jest, and Allure reporting with modular architecture for cross-browser testing.

## Features

- ✅ **Selenium WebDriver 4** - Latest WebDriver implementation
- ✅ **Jest Testing Framework** - Powerful testing framework with built-in assertions
- ✅ **TypeScript Support** - Full TypeScript support with type definitions
- ✅ **Allure Reporting** - Beautiful and detailed test reports
- ✅ **Cross-Browser Support** - Chrome, Firefox, and Edge
- ✅ **Page Object Model** - Clean and maintainable test architecture
- ✅ **Modular Structure** - Organized codebase with separation of concerns
- ✅ **Screenshot on Failure** - Automatic screenshot capture for failed tests
- ✅ **Flexible Configuration** - Environment-based configuration
- ✅ **Headless Mode** - Run tests in headless mode for CI/CD
- ✅ **Parallel Execution** - Run tests in parallel for faster execution

## Project Structure

```
selenium-e2e-automation-template/
├── config/                    # Configuration files
│   ├── browser.config.js      # Browser settings
│   └── jest.setup.js          # Jest setup and Allure configuration
├── drivers/                   # WebDriver management
│   └── DriverManager.js       # Driver initialization and management
├── pages/                     # Page Object Models
│   ├── BasePage.js/.ts        # Base page with common methods
│   ├── GoogleHomePage.js/.ts  # Example: Google home page
│   └── GoogleSearchResultsPage.js/.ts
├── tests/                     # Test files
│   ├── google-search.test.js/.ts  # Example: Google search tests
│   └── example.test.js/.ts        # Example: Basic tests
├── helpers/                   # Test helpers
│   ├── TestBase.js/.ts        # Base test class
│   └── AllureHelper.js        # Allure reporting helper
├── utils/                     # Utility functions
│   ├── screenshot.util.js     # Screenshot utilities
│   └── helpers.util.js        # Common helper functions
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore file
├── tsconfig.json              # TypeScript configuration
└── package.json               # Project dependencies

Generated folders:
├── screenshots/               # Screenshots from failed tests
├── allure-results/            # Allure test results
└── allure-report/             # Generated Allure HTML report
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Chrome/Firefox/Edge browser installed
- Java (for Allure report generation)

## Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd selenium-e2e-automation-template
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` file to configure your test environment.

## Configuration

### Environment Variables (.env)

```env
BROWSER=chrome                 # Browser: chrome, firefox, edge
HEADLESS=false                 # Run in headless mode: true, false
WINDOW_WIDTH=1920              # Browser window width
WINDOW_HEIGHT=1080             # Browser window height
BASE_URL=https://example.com   # Base URL for tests
IMPLICIT_WAIT=10000            # Implicit wait timeout (ms)
EXPLICIT_WAIT=20000            # Explicit wait timeout (ms)
PAGE_LOAD_TIMEOUT=30000        # Page load timeout (ms)
SCREENSHOTS_ON_FAILURE=true    # Take screenshots on failure
ALLURE_RESULTS_DIR=allure-results
```

## Running Tests

### Run all tests (default browser: Chrome)
```bash
npm test
```

### Run tests in specific browser
```bash
npm run test:chrome
npm run test:firefox
npm run test:edge
```

### Run tests in headless mode
```bash
npm run test:headless
```

### Run tests in parallel
```bash
npm run test:parallel
```

### Run specific test file
```bash
npx jest tests/google-search.test.js
```

### Run tests with custom configuration
```bash
BROWSER=firefox HEADLESS=true npm test
```

## Allure Reports

### Generate and open Allure report
```bash
npm run allure:generate
npm run allure:open
```

### Generate and serve Allure report (one command)
```bash
npm run allure:serve
```

### Clean reports
```bash
npm run clean:reports
```

## Writing Tests

### JavaScript or TypeScript?

This template supports both JavaScript and TypeScript. Choose the language that best fits your project:

- **JavaScript (.js)**: Simpler setup, no compilation needed
- **TypeScript (.ts)**: Type safety, better IDE support, enhanced code quality

Both versions use the same architecture and can coexist in the same project.

### 1. Create a Page Object

#### JavaScript Version

Create a new page class in `pages/` directory:

```javascript
const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.url = 'https://example.com/login';
    
    this.locators = {
      usernameInput: By.id('username'),
      passwordInput: By.id('password'),
      loginButton: By.css('button[type="submit"]'),
    };
  }

  async open() {
    await this.navigate(this.url);
  }

  async login(username, password) {
    await this.type(this.locators.usernameInput, username);
    await this.type(this.locators.passwordInput, password);
    await this.click(this.locators.loginButton);
  }
}

module.exports = LoginPage;
```

#### TypeScript Version

```typescript
import { By, WebDriver } from 'selenium-webdriver';
import BasePage from './BasePage';

class LoginPage extends BasePage {
  private url: string;
  public locators: {
    usernameInput: By;
    passwordInput: By;
    loginButton: By;
  };

  constructor(driver: WebDriver) {
    super(driver);
    this.url = 'https://example.com/login';
    
    this.locators = {
      usernameInput: By.id('username'),
      passwordInput: By.id('password'),
      loginButton: By.css('button[type="submit"]'),
    };
  }

  async open(): Promise<void> {
    await this.navigate(this.url);
  }

  async login(username: string, password: string): Promise<void> {
    await this.type(this.locators.usernameInput, username);
    await this.type(this.locators.passwordInput, password);
    await this.click(this.locators.loginButton);
  }
}

export default LoginPage;
```

### 2. Create a Test

#### JavaScript Version

Create a new test file in `tests/` directory:

```javascript
const TestBase = require('../helpers/TestBase');
const LoginPage = require('../pages/LoginPage');
const AllureHelper = require('../helpers/AllureHelper');

describe('Login Tests', () => {
  let testBase;
  let driver;
  let loginPage;

  beforeEach(async () => {
    testBase = new TestBase();
    await testBase.setup();
    driver = testBase.getDriver();
    loginPage = new LoginPage(driver);
  });

  afterEach(async () => {
    await testBase.teardown({ testPath: __filename });
  });

  test('should login successfully', async () => {
    AllureHelper.addFeature('Authentication');
    AllureHelper.addStory('Login');
    AllureHelper.addSeverity('critical');
    AllureHelper.addTag('smoke');

    await AllureHelper.addStep('Open login page', async () => {
      await loginPage.open();
    });

    await AllureHelper.addStep('Enter credentials and login', async () => {
      await loginPage.login('testuser', 'password123');
    });

    await AllureHelper.addStep('Verify successful login', async () => {
      const url = await driver.getCurrentUrl();
      expect(url).toContain('/dashboard');
    });
  });
});
```

#### TypeScript Version

```typescript
import TestBase from '../helpers/TestBase';
import LoginPage from '../pages/LoginPage';
import AllureHelper from '../helpers/AllureHelper';
import { WebDriver } from 'selenium-webdriver';

describe('Login Tests', () => {
  let testBase: TestBase;
  let driver: WebDriver;
  let loginPage: LoginPage;

  beforeEach(async () => {
    testBase = new TestBase();
    await testBase.setup();
    driver = testBase.getDriver();
    loginPage = new LoginPage(driver);
  });

  afterEach(async () => {
    await testBase.teardown({ testPath: __filename });
  });

  test('should login successfully', async () => {
    AllureHelper.addFeature('Authentication');
    AllureHelper.addStory('Login');
    AllureHelper.addSeverity('critical');
    AllureHelper.addTag('smoke');

    await AllureHelper.addStep('Open login page', async () => {
      await loginPage.open();
    });

    await AllureHelper.addStep('Enter credentials and login', async () => {
      await loginPage.login('testuser', 'password123');
    });

    await AllureHelper.addStep('Verify successful login', async () => {
      const url: string = await driver.getCurrentUrl();
      expect(url).toContain('/dashboard');
    });
  });
});
```

### 3. Run TypeScript Tests

```bash
# Run all tests (both .js and .ts)
npm test

# Run only TypeScript tests
npx jest tests/*.test.ts

# Run specific TypeScript test file
npx jest tests/google-search.test.ts
```

## BasePage Methods

The `BasePage` class provides common methods for interacting with web elements:

- `navigate(url)` - Navigate to URL
- `click(locator)` - Click element
- `type(locator, text)` - Type text into input
- `getText(locator)` - Get element text
- `getAttribute(locator, attribute)` - Get attribute value
- `isDisplayed(locator)` - Check if element is visible
- `isEnabled(locator)` - Check if element is enabled
- `waitForElement(locator)` - Wait for element to be present
- `waitForVisible(locator)` - Wait for element to be visible
- `waitForClickable(locator)` - Wait for element to be clickable
- `scrollToElement(locator)` - Scroll to element
- `executeScript(script, ...args)` - Execute JavaScript
- `takeScreenshot(fileName)` - Take screenshot
- `switchToFrame(frame)` - Switch to iframe
- `getCurrentUrl()` - Get current URL
- `getTitle()` - Get page title
- `refresh()` - Refresh page
- `goBack()` - Navigate back
- `goForward()` - Navigate forward

## Allure Helper Methods

Add metadata and organize your test reports:

- `AllureHelper.addFeature(feature)` - Add feature label
- `AllureHelper.addStory(story)` - Add story label
- `AllureHelper.addEpic(epic)` - Add epic label
- `AllureHelper.addSeverity(severity)` - Add severity (blocker, critical, normal, minor, trivial)
- `AllureHelper.addTag(tag)` - Add tag
- `AllureHelper.addDescription(description)` - Add description
- `AllureHelper.addStep(name, body)` - Add test step
- `AllureHelper.addAttachment(name, content, type)` - Add attachment

## Utility Functions

Located in `utils/helpers.util.js`:

- `wait(ms)` - Wait for specified time
- `randomString(length)` - Generate random string
- `randomEmail()` - Generate random email
- `formatDate(date, format)` - Format date
- `retryWithBackoff(fn, maxRetries, delay)` - Retry with exponential backoff

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: BROWSER=chrome HEADLESS=true npm test
      
      - name: Generate Allure Report
        if: always()
        run: npm run allure:generate
      
      - name: Upload Allure Results
        if: always()
        uses: actions/upload-artifact@v2
        with:
          name: allure-results
          path: allure-results/
```

## Best Practices

1. **Use Page Object Model** - Keep page logic separate from tests
2. **Use Explicit Waits** - Avoid hardcoded sleeps, use WebDriver waits
3. **Independent Tests** - Each test should be able to run independently
4. **Descriptive Names** - Use clear, descriptive names for tests and methods
5. **Add Allure Metadata** - Use features, stories, and severity for better reporting
6. **Handle Exceptions** - Add proper error handling and logging
7. **Clean Up** - Always quit driver in afterEach
8. **Environment Config** - Use environment variables for configuration
9. **Reusable Components** - Create reusable helper functions
10. **Screenshots** - Enable automatic screenshots on failure

## Troubleshooting

### WebDriver Issues

If you encounter driver issues:
```bash
npm install chromedriver@latest
npm install geckodriver@latest
```

### Allure Report Not Generating

Make sure Java is installed:
```bash
java -version
```

Install Allure CLI globally:
```bash
npm install -g allure-commandline
```

### Port Already in Use

If Allure report server fails to start, kill the process:
```bash
lsof -ti:port_number | xargs kill -9
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this template for your projects.

## Support

For issues and questions, please open an issue in the repository.