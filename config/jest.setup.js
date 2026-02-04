require('dotenv').config();

// Set default test timeout
jest.setTimeout(parseInt(process.env.EXPLICIT_WAIT) || 60000);

// Global test hooks
beforeAll(() => {
  console.log('Starting test suite execution...');
});

afterAll(() => {
  console.log('Test suite execution completed.');
});
