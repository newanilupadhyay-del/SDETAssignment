/**
 * Search Results Page Object
 * Handles product listing, sorting, and pagination on Flipkart search results
 * Implements Page Object Model pattern
 */

const BasePage = require('./BasePage');
const PriceHelper = require('../utils/priceHelper');

class SearchResultsPage extends BasePage {
  /**
   * Initialize SearchResultsPage with page object and define locators
   * @param {import('@playwright/test').Page} page - Playwright page instance
   */
  constructor(page) {
    super(page);

    // Locators for Search Results Page elements
    this.locators = {
      // Product cards container
      productContainer: 'div[data-id]',

      // Product price selectors (Flipkart uses various price elements)
      productPrice: 'div._30jeq3',

      // Product title/name
      productTitle: 'div._4rR01T, a.s1Q9rs, a.IRpwTa',

      // Sort options
      sortByPriceLowToHigh: 'div._10UF8M:has-text("Price -- Low to High")',

      // Sort option container
      sortContainer: 'div._6t1WkM',

      // Pagination - Next page button
      nextPageButton: 'a._1LKTO3:has-text("Next")',

      // Pagination - Page navigation
      paginationNav: 'nav._1ypTlJ',

      // Current page indicator
      currentPage: 'span._2UI27E',

      // Product link
      productLink: 'a._1fQZEK, a.s1Q9rs, a.CGtC98',

      // All products wrapper
      productsWrapper: 'div._1AtVbE',

      // Price element alternatives
      priceElements: 'div._30jeq3._1_WHN1, div._30jeq3'
    };
  }

  /**
   * Apply sort filter by price low to high
   * @param {string} sortOption - Sort option text from data source
   */
  async applySortByPrice(sortOption) {
    // Wait for sort options to be available
    await this.wait(2000);

    // Find and click the sort option
    const sortLocator = this.page.locator(`div._10UF8M, div.sHCOk2`).filter({ hasText: sortOption });

    // Click on the sort option
    await sortLocator.first().click();

    // Wait for page to reload with sorted results
    await this.wait(3000);
    await this.waitForNavigation();
  }

  /**
   * Get all product prices from the current page
   * @returns {Promise<Object[]>} Array of product objects with name and price
   */
  async getProductsWithPrices() {
    await this.wait(2000);

    const products = [];

    // Get all product containers
    const productCards = this.page.locator('div[data-id], div._1AtVbE > div');

    const count = await productCards.count();

    for (let i = 0; i < count; i++) {
      try {
        const card = productCards.nth(i);

        // Try to get product title
        const titleLocator = card.locator('div._4rR01T, a.s1Q9rs, a.IRpwTa, a.WKTcLC');
        let title = '';

        if (await titleLocator.count() > 0) {
          title = await titleLocator.first().textContent() || '';
        }

        // Try to get price
        const priceLocator = card.locator('div._30jeq3');
        let priceText = '';

        if (await priceLocator.count() > 0) {
          priceText = await priceLocator.first().textContent() || '';
        }

        // Only add if we have both title and price
        if (title && priceText) {
          const price = PriceHelper.extractPrice(priceText);
          if (price > 0) {
            products.push({
              name: title.trim().substring(0, 50),
              price: price,
              priceText: priceText.trim()
            });
          }
        }
      } catch (error) {
        // Skip this product if there's an error extracting data
        continue;
      }
    }

    return products;
  }

  /**
   * Get only prices from current page
   * @returns {Promise<number[]>} Array of numeric prices
   */
  async getPricesOnly() {
    await this.wait(1500);

    const prices = [];
    const priceElements = this.page.locator('div._30jeq3');
    const count = await priceElements.count();

    for (let i = 0; i < count; i++) {
      try {
        const priceText = await priceElements.nth(i).textContent();
        const price = PriceHelper.extractPrice(priceText);
        if (price > 0) {
          prices.push(price);
        }
      } catch (error) {
        continue;
      }
    }

    return prices;
  }

  /**
   * Navigate to next page
   * @returns {Promise<boolean>} True if navigation was successful
   */
  async goToNextPage() {
    try {
      const nextButton = this.page.locator('a._1LKTO3, a._9QVEpD').filter({ hasText: 'Next' });

      if (await nextButton.isVisible({ timeout: 5000 })) {
        await nextButton.click();
        await this.wait(3000);
        await this.waitForNavigation();
        return true;
      }
      return false;
    } catch (error) {
      console.log('Could not navigate to next page:', error.message);
      return false;
    }
  }

  /**
   * Get current page number
   * @returns {Promise<number>} Current page number
   */
  async getCurrentPageNumber() {
    try {
      const pageIndicator = this.page.locator('span._2UI27E');
      const pageText = await pageIndicator.textContent();
      const match = pageText.match(/Page\s+(\d+)/i);
      return match ? parseInt(match[1]) : 1;
    } catch (error) {
      return 1;
    }
  }

  /**
   * Collect products from multiple pages
   * @param {number} pageLimit - Number of pages to collect from (from data source)
   * @returns {Promise<Object[]>} Array of all products from specified pages
   */
  async collectProductsFromPages(pageLimit) {
    const allProducts = [];

    for (let page = 1; page <= pageLimit; page++) {
      console.log(`Collecting products from page ${page}...`);

      // Get products from current page
      const pageProducts = await this.getProductsWithPrices();
      allProducts.push(...pageProducts);

      console.log(`Found ${pageProducts.length} products on page ${page}`);

      // Navigate to next page if not on last page
      if (page < pageLimit) {
        const navigated = await this.goToNextPage();
        if (!navigated) {
          console.log(`Could not navigate to page ${page + 1}`);
          break;
        }
      }
    }

    return allProducts;
  }

  /**
   * Click on a product by its position in the list
   * @param {number} position - 1-indexed position of the product
   * @returns {Promise<Object>} Product info (name and price)
   */
  async clickProductByPosition(position) {
    await this.wait(2000);

    // Get product info before clicking
    const products = await this.getProductsWithPrices();

    if (position > products.length) {
      throw new Error(`Product at position ${position} not found. Only ${products.length} products available.`);
    }

    const productInfo = products[position - 1];

    // Click on the product link
    const productLinks = this.page.locator('a._1fQZEK, a.s1Q9rs, a.CGtC98, a._2rpwqI');
    const validLinks = [];

    const count = await productLinks.count();
    for (let i = 0; i < count; i++) {
      const href = await productLinks.nth(i).getAttribute('href');
      if (href && href.includes('/p/')) {
        validLinks.push(productLinks.nth(i));
      }
    }

    if (validLinks.length >= position) {
      // Open in new tab and return product info
      const [newPage] = await Promise.all([
        this.page.context().waitForEvent('page'),
        validLinks[position - 1].click()
      ]);

      return {
        productInfo,
        newPage
      };
    }

    throw new Error(`Could not click on product at position ${position}`);
  }

  /**
   * Verify search results are displayed
   * @returns {Promise<boolean>} True if results are displayed
   */
  async areResultsDisplayed() {
    try {
      await this.wait(2000);
      const prices = await this.getPricesOnly();
      return prices.length > 0;
    } catch (error) {
      return false;
    }
  }
}

module.exports = SearchResultsPage;
