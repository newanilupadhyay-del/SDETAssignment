/**
 * Home Page Object
 * Represents the Flipkart home page with search functionality
 * Implements Page Object Model pattern
 */

const BasePage = require('./BasePage');

class HomePage extends BasePage {
  /**
   * Initialize HomePage with page object and define locators
   * @param {import('@playwright/test').Page} page - Playwright page instance
   */
  constructor(page) {
    super(page);

    // Locators for Home Page elements
    this.locators = {
      // Search box input field
      searchBox: 'input[name="q"]',

      // Search button/icon
      searchButton: 'button[type="submit"]',

      // Login popup close button (appears on first visit)
      loginPopupCloseButton: 'button._2KpZ6l._2doB4z',

      // Alternative close button selector
      closeButtonAlt: '[class*="close"]',

      // Flipkart logo
      logo: 'img[alt="Flipkart"]'
    };
  }

  /**
   * Navigate to Flipkart home page
   */
  async navigate() {
    await this.navigateTo('/');
    await this.waitForNavigation();
    // Handle login popup that appears on first visit
    await this.handleLoginPopup();
  }

  /**
   * Handle the login popup that appears on Flipkart homepage
   * Closes the popup if it appears
   */
  async handleLoginPopup() {
    try {
      // Wait briefly for popup to appear
      const closeButton = this.page.locator('button._2KpZ6l._2doB4z, span[role="button"]:has-text("✕"), button:has-text("✕")');
      await closeButton.first().click({ timeout: 5000 });
      console.log('Login popup closed successfully');
    } catch (error) {
      // Popup may not appear, continue with test
      console.log('No login popup detected or already closed');
    }
  }

  /**
   * Search for a product
   * @param {string} searchTerm - Product to search for (retrieved from data source)
   */
  async searchProduct(searchTerm) {
    // Wait for search box to be visible
    await this.waitForElement(this.locators.searchBox);

    // Clear any existing text and type search term
    await this.page.fill(this.locators.searchBox, '');
    await this.page.fill(this.locators.searchBox, searchTerm);

    // Click search button
    await this.page.click(this.locators.searchButton);

    // Wait for search results to load
    await this.waitForNavigation();
  }

  /**
   * Verify home page is loaded
   * @returns {Promise<boolean>} True if page is loaded
   */
  async isPageLoaded() {
    try {
      await this.waitForElement(this.locators.searchBox, 10000);
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = HomePage;
