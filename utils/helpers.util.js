/**
 * Wait for specified time
 * @param {number} ms - milliseconds to wait
 */
async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate random string
 * @param {number} length
 * @returns {string}
 */
function randomString(length = 10) {
  return Math.random().toString(36).substring(2, length + 2);
}

/**
 * Generate random email
 * @returns {string}
 */
function randomEmail() {
  return `test_${randomString(8)}@example.com`;
}

/**
 * Format date to string
 * @param {Date} date
 * @param {string} format - 'YYYY-MM-DD', 'DD/MM/YYYY', etc.
 * @returns {string}
 */
function formatDate(date = new Date(), format = 'YYYY-MM-DD') {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day);
}

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Initial delay in ms
 * @returns {Promise<any>}
 */
async function retryWithBackoff(fn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await wait(delay * Math.pow(2, i));
    }
  }
}

module.exports = {
  wait,
  randomString,
  randomEmail,
  formatDate,
  retryWithBackoff,
};
