/**
 * Price Helper Utility
 * Handles price extraction, parsing, and validation operations
 */

class PriceHelper {
  /**
   * Extract numeric price from a price string
   * Handles formats like "₹1,299", "Rs. 1,299", "1299", etc.
   * @param {string} priceString - Price string with currency symbol
   * @returns {number} Numeric price value
   */
  static extractPrice(priceString) {
    if (!priceString) return 0;

    // Remove currency symbols, commas, spaces and non-numeric characters except decimal
    const cleanedPrice = priceString
      .replace(/[₹Rs.,\s]/gi, '')
      .replace(/[^\d.]/g, '');

    const price = parseFloat(cleanedPrice);
    return isNaN(price) ? 0 : price;
  }

  /**
   * Validate if prices are in ascending order
   * @param {number[]} prices - Array of numeric prices
   * @returns {Object} Validation result with details
   */
  static validateAscendingOrder(prices) {
    const violations = [];
    let isValid = true;

    for (let i = 1; i < prices.length; i++) {
      if (prices[i] < prices[i - 1]) {
        isValid = false;
        violations.push({
          index: i,
          previousPrice: prices[i - 1],
          currentPrice: prices[i],
          message: `Product at index ${i} has price ₹${prices[i]} which is less than previous product price ₹${prices[i - 1]}`
        });
      }
    }

    return {
      isValid,
      violations,
      totalProducts: prices.length,
      violationCount: violations.length
    };
  }

  /**
   * Format price for display
   * @param {number} price - Numeric price
   * @returns {string} Formatted price string
   */
  static formatPrice(price) {
    return `₹${price.toLocaleString('en-IN')}`;
  }

  /**
   * Calculate total of prices
   * @param {number[]} prices - Array of prices
   * @returns {number} Sum of all prices
   */
  static calculateTotal(prices) {
    return prices.reduce((sum, price) => sum + price, 0);
  }

  /**
   * Generate detailed report of sort order violations
   * @param {Object[]} products - Array of product objects with name and price
   * @returns {Object} Detailed report
   */
  static generateSortViolationReport(products) {
    const violations = [];

    for (let i = 1; i < products.length; i++) {
      if (products[i].price < products[i - 1].price) {
        violations.push({
          position: i + 1,
          productName: products[i].name,
          productPrice: products[i].price,
          previousProductName: products[i - 1].name,
          previousProductPrice: products[i - 1].price
        });
      }
    }

    return {
      totalProducts: products.length,
      violationsFound: violations.length,
      isCorrectlySorted: violations.length === 0,
      violations: violations,
      violationDetails: violations.map(v =>
        `Position ${v.position}: "${v.productName}" (₹${v.productPrice}) < "${v.previousProductName}" (₹${v.previousProductPrice})`
      )
    };
  }
}

module.exports = PriceHelper;
