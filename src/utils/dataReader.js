/**
 * Data Reader Utility
 * Handles reading test data from JSON data source files
 */

const fs = require('fs');
const path = require('path');

class DataReader {
  /**
   * Read and parse JSON data file
   * @param {string} fileName - Name of the JSON file (without path)
   * @returns {Object} Parsed JSON data
   */
  static readJsonFile(fileName) {
    const filePath = path.join(__dirname, '..', 'data', fileName);
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
  }

  /**
   * Get test data for a specific test scenario
   * @param {string} scenario - The test scenario key (e.g., 'sortValidation', 'addToCart')
   * @returns {Object} Test data for the specified scenario
   */
  static getTestData(scenario) {
    const testData = this.readJsonFile('testData.json');
    if (!testData[scenario]) {
      throw new Error(`Test data for scenario '${scenario}' not found`);
    }
    return testData[scenario];
  }

  /**
   * Get search term from data source
   * @param {string} scenario - The test scenario key
   * @returns {string} Search term
   */
  static getSearchTerm(scenario) {
    return this.getTestData(scenario).searchTerm;
  }

  /**
   * Get sort option from data source
   * @param {string} scenario - The test scenario key
   * @returns {string} Sort option text
   */
  static getSortOption(scenario) {
    return this.getTestData(scenario).sortOption;
  }

  /**
   * Get page limit from data source
   * @param {string} scenario - The test scenario key
   * @returns {number} Page limit for validation
   */
  static getPageLimit(scenario) {
    return this.getTestData(scenario).pageLimit;
  }

  /**
   * Get products to add to cart from data source
   * @param {string} scenario - The test scenario key
   * @returns {number[]} Array of product indices to add
   */
  static getProductsToAdd(scenario) {
    return this.getTestData(scenario).productsToAdd;
  }
}

module.exports = DataReader;
