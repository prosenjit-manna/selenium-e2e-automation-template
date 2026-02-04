class AllureHelper {

  /**
   * Add description to test
   * @param {string} description
   */
  static addDescription(description) {
    // Allure metadata is added via docblock comments in tests
  }

  /**
   * Add severity to test
   * @param {string} severity - 'blocker', 'critical', 'normal', 'minor', 'trivial'
   */
  static addSeverity(severity) {
    // Allure metadata is added via docblock comments in tests
  }

  /**
   * Add feature label
   * @param {string} feature
   */
  static addFeature(feature) {
    // Allure metadata is added via docblock comments in tests
  }

  /**
   * Add story label
   * @param {string} story
   */
  static addStory(story) {
    // Allure metadata is added via docblock comments in tests
  }

  /**
   * Add epic label
   * @param {string} epic
   */
  static addEpic(epic) {
    // Allure metadata is added via docblock comments in tests
  }

  /**
   * Add tag to test
   * @param {string} tag
   */
  static addTag(tag) {
    // Allure metadata is added via docblock comments in tests
  }

  /**
   * Add attachment to test
   * @param {string} name
   * @param {Buffer|string} content
   * @param {string} type - MIME type
   */
  static addAttachment(name, content, type = 'text/plain') {
    // Attachments can be added via allure-jest reporter
  }

  /**
   * Add step to test
   * @param {string} name
   * @param {Function} body
   */
  static async addStep(name, body) {
    // Steps are automatically captured by allure-jest
    await body();
  }
}

module.exports = AllureHelper;
