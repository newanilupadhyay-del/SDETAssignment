/**
 * Base Page Class
 * Contains common methods and utilities shared across all page objects
 * Implements the Page Object Model design pattern
 */

class BasePage {
  /**
   * Initialize base page with Playwright page object
   * @param {import('@playwright/test').Page} page - Playwright page instance
   */
  constructor(page) {
    this.page = page;
    this.defaultTimeout = 30000;
  }

  /**
   * Navigate to a specific URL
   * @param {string} url - URL to navigate to
   */
  async navigateTo(url) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Wait for element to be visible
   * @param {string} selector - Element selector
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForElement(selector, timeout = this.defaultTimeout) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Click on an element with retry logic
   * @param {string} selector - Element selector
   */
  async click(selector) {
    await this.page.click(selector);
  }

  /**
   * Type text into an input field
   * @param {string} selector - Input selector
   * @param {string} text - Text to type
   */
  async type(selector, text) {
    await this.page.fill(selector, text);
  }

  /**
   * Get text content of an element
   * @param {string} selector - Element selector
   * @returns {Promise<string>} Text content
   */
  async getText(selector) {
    return await this.page.textContent(selector);
  }

  /**
   * Wait for page navigation to complete
   */
  async waitForNavigation() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Wait for network to be idle
   */
  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Take screenshot for debugging
   * @param {string} name - Screenshot name
   */
  async takeScreenshot(name) {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  /**
   * Close any popup/modal if present
   * @param {string} closeButtonSelector - Selector for close button
   */
  async closePopupIfPresent(closeButtonSelector) {
    try {
      const closeButton = this.page.locator(closeButtonSelector);
      if (await closeButton.isVisible({ timeout: 3000 })) {
        await closeButton.click();
      }
    } catch (error) {
      // Popup not present, continue
    }
  }

  /**
   * Scroll element into view
   * @param {string} selector - Element selector
   */
  async scrollIntoView(selector) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Wait for a specific time (use sparingly)
   * @param {number} ms - Milliseconds to wait
   */
  async wait(ms) {
    await this.page.waitForTimeout(ms);
  }
}

module.exports = BasePage;
