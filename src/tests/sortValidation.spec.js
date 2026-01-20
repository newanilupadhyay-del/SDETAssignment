/**
 * Sort Validation Test
 *
 * Test Case: Validate Sort functionality for products displayed
 * - Opens flipkart.com
 * - Searches for products (search term from data source)
 * - Applies sort by Price - Low to High (sort option from data source)
 * - Validates prices across multiple pages (page limit from data source)
 * - Asserts and displays products not following correct sort order
 */

const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const SearchResultsPage = require('../pages/SearchResultsPage');
const DataReader = require('../utils/dataReader');
const PriceHelper = require('../utils/priceHelper');

// Test configuration constants
const TEST_SCENARIO = 'sortValidation';

test.describe('Flipkart Sort Functionality Validation', () => {
  let homePage;
  let searchResultsPage;
  let testData;

  // Setup: Initialize pages and load test data before each test
  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    homePage = new HomePage(page);
    searchResultsPage = new SearchResultsPage(page);

    // Load test data from data source
    testData = DataReader.getTestData(TEST_SCENARIO);

    console.log('='.repeat(60));
    console.log('TEST DATA LOADED FROM DATA SOURCE:');
    console.log(`  Search Term: ${testData.searchTerm}`);
    console.log(`  Sort Option: ${testData.sortOption}`);
    console.log(`  Page Limit: ${testData.pageLimit}`);
    console.log('='.repeat(60));
  });

  test('Validate products are sorted by Price - Low to High across multiple pages', async ({ page }) => {
    // Step 1: Navigate to Flipkart homepage
    console.log('\n[STEP 1] Navigating to Flipkart.com...');
    await homePage.navigate();

    // Verify homepage is loaded
    const isLoaded = await homePage.isPageLoaded();
    expect(isLoaded, 'Flipkart homepage should be loaded').toBeTruthy();
    console.log('[STEP 1] ✓ Flipkart homepage loaded successfully');

    // Step 2: Search for product (search term from data source)
    console.log(`\n[STEP 2] Searching for "${testData.searchTerm}"...`);
    await homePage.searchProduct(testData.searchTerm);

    // Verify search results are displayed
    const resultsDisplayed = await searchResultsPage.areResultsDisplayed();
    expect(resultsDisplayed, 'Search results should be displayed').toBeTruthy();
    console.log(`[STEP 2] ✓ Search results displayed for "${testData.searchTerm}"`);

    // Step 3: Apply sort filter (sort option from data source)
    console.log(`\n[STEP 3] Applying sort: "${testData.sortOption}"...`);
    await searchResultsPage.applySortByPrice(testData.sortOption);
    console.log(`[STEP 3] ✓ Sort filter "${testData.sortOption}" applied`);

    // Step 4: Collect products from all pages (page limit from data source)
    console.log(`\n[STEP 4] Collecting products from ${testData.pageLimit} page(s)...`);
    const allProducts = await searchResultsPage.collectProductsFromPages(testData.pageLimit);

    console.log(`[STEP 4] ✓ Collected ${allProducts.length} products from ${testData.pageLimit} page(s)`);

    // Step 5: Validate sort order
    console.log('\n[STEP 5] Validating sort order...');
    console.log('='.repeat(60));
    console.log('PRODUCTS COLLECTED:');
    console.log('='.repeat(60));

    // Display all products with their prices
    allProducts.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.name} - ₹${product.price}`);
    });

    // Generate sort validation report
    const sortReport = PriceHelper.generateSortViolationReport(allProducts);

    console.log('\n' + '='.repeat(60));
    console.log('SORT VALIDATION REPORT:');
    console.log('='.repeat(60));
    console.log(`  Total Products Analyzed: ${sortReport.totalProducts}`);
    console.log(`  Correctly Sorted: ${sortReport.isCorrectlySorted ? 'YES ✓' : 'NO ✗'}`);
    console.log(`  Violations Found: ${sortReport.violationsFound}`);

    // Display violations if any
    if (sortReport.violationsFound > 0) {
      console.log('\n' + '='.repeat(60));
      console.log('PRODUCTS NOT FOLLOWING CORRECT SORT ORDER:');
      console.log('='.repeat(60));

      sortReport.violationDetails.forEach((detail, index) => {
        console.log(`  [VIOLATION ${index + 1}] ${detail}`);
      });

      console.log('\n' + '='.repeat(60));
      console.log('DETAILED VIOLATION INFORMATION:');
      console.log('='.repeat(60));

      sortReport.violations.forEach((violation, index) => {
        console.log(`\n  Violation #${index + 1}:`);
        console.log(`    Position: ${violation.position}`);
        console.log(`    Product: "${violation.productName}"`);
        console.log(`    Price: ₹${violation.productPrice}`);
        console.log(`    Previous Product: "${violation.previousProductName}"`);
        console.log(`    Previous Price: ₹${violation.previousProductPrice}`);
        console.log(`    Issue: Current price (₹${violation.productPrice}) is LESS than previous price (₹${violation.previousProductPrice})`);
      });
    }

    console.log('\n' + '='.repeat(60));

    // Assert that products are correctly sorted
    // This will fail if there are any violations, displaying the detailed report above
    expect(
      sortReport.isCorrectlySorted,
      `Sort order validation failed! Found ${sortReport.violationsFound} product(s) not following ascending price order.\n\n` +
      `VIOLATIONS:\n${sortReport.violationDetails.join('\n')}\n\n` +
      `Total Products: ${sortReport.totalProducts}\n` +
      `Pages Validated: ${testData.pageLimit}`
    ).toBeTruthy();

    console.log('\n[RESULT] ✓ All products are correctly sorted by Price - Low to High');
    console.log('='.repeat(60));
  });

  // Cleanup after test
  test.afterEach(async ({ page }) => {
    console.log('\n[CLEANUP] Test completed');
  });
});
