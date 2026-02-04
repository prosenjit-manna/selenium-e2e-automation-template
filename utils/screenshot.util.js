const fs = require('fs');
const path = require('path');

/**
 * Take screenshot and save to screenshots directory
 * @param {WebDriver} driver
 * @param {string} fileName
 */
async function takeScreenshot(driver, fileName) {
  try {
    const screenshotsDir = path.join(process.cwd(), 'screenshots');
    
    // Create screenshots directory if it doesn't exist
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filePath = path.join(screenshotsDir, `${fileName}_${timestamp}.png`);
    
    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync(filePath, screenshot, 'base64');
    
    console.log(`Screenshot saved: ${filePath}`);
    return filePath;
  } catch (error) {
    console.error('Failed to take screenshot:', error);
  }
}

module.exports = { takeScreenshot };
