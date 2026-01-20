// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright Configuration
 * Configured for Chrome browser in incognito mode with maximized window
 * as per assignment requirements
 */
module.exports = defineConfig({
  // Test directory
  testDir: './src/tests',

  // Run tests in files in parallel
  fullyParallel: false,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry failed tests
  retries: process.env.CI ? 2 : 0,

  // Limit parallel workers
  workers: 1,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],

  // Shared settings for all projects
  use: {
    // Base URL for Flipkart
    baseURL: 'https://www.flipkart.com',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video recording
    video: 'retain-on-failure',

    // Default timeout for actions
    actionTimeout: 30000,

    // Navigation timeout
    navigationTimeout: 60000,
  },

  // Configure projects for Chrome browser
  projects: [
    {
      name: 'chromium',
      use: {
        // Use Chrome channel for actual Chrome browser
        channel: 'chrome',

        // Launch browser in incognito/private mode with maximized viewport
        launchOptions: {
          args: [
            '--incognito',
            '--start-maximized',
            '--disable-blink-features=AutomationControlled'
          ]
        },

        // Maximize viewport
        viewport: null, // null viewport with --start-maximized for true maximized window
      },
    },
  ],

  // Global timeout
  timeout: 120000,

  // Expect timeout
  expect: {
    timeout: 10000
  },
});
