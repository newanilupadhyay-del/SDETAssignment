/**
 * Product Page Object
 * Handles individual product details and Add to Cart functionality
 * Implements Page Object Model pattern
 */

const BasePage = require('./BasePage');
const PriceHelper = require('../utils/priceHelper');

class ProductPage extends BasePage {
  /**
   * Initialize ProductPage with page object and define locators
   * @param {import('@playwright/test').Page} page - Playwright page instance
   */
  constructor(page) {
    super(page);

    // Locators for Product Page elements
    this.locators = {
      // Add to Cart button
      addToCartButton: 'button._2KpZ6l._2U9uOA._3v1-ww, button:has-text("Add to cart"), button:has-text("ADD TO CART")',

      // Buy Now button
      buyNowButton: 'button._2KpZ6l._2U9uOA._3v1-ww._1nKUhw, button:has-text("Buy Now"), button:has-text("BUY NOW")',

      // Product title
      productTitle: 'span.B_NuCI, h1._9E25nV',

      // Product price
      productPrice: 'div._30jeq3._16Jk6d, div._30jeq3',

      // Size selection (for shoes/clothing)
      sizeOption: 'a._1fGeJ5, a._3V2wfe',

      // Go to Cart button (appears after adding to cart)
      goToCartButton: 'a:has-text("Go to cart"), a:has-text("GO TO CART")',

      // Pincode input
      pincodeInput: 'input#pincodeInputId',

      // View Cart link
      viewCartLink: 'a[href*="viewcart"]',

      // Added to cart confirmation
      addedConfirmation: 'div:has-text("Added to Cart")'
    };
  }

  /**
   * Get product details from the product page
   * @returns {Promise<Object>} Product details including name and price
   */
  async getProductDetails() {
    await this.wait(2000);
    await this.waitForNavigation();

    let productName = '';
    let productPrice = 0;
    let priceText = '';

    // Get product title
    try {
      const titleLocator = this.page.locator('span.B_NuCI, h1._9E25nV, span.VU-ZEz');
      if (await titleLocator.count() > 0) {
        productName = await titleLocator.first().textContent() || '';
      }
    } catch (error) {
      console.log('Could not get product title');
    }

    // Get product price
    try {
      const priceLocator = this.page.locator('div._30jeq3._16Jk6d, div._30jeq3');
      if (await priceLocator.count() > 0) {
        priceText = await priceLocator.first().textContent() || '';
        productPrice = PriceHelper.extractPrice(priceText);
      }
    } catch (error) {
      console.log('Could not get product price');
    }

    return {
      name: productName.trim(),
      price: productPrice,
      priceText: priceText.trim()
    };
  }

  /**
   * Select size if size selection is available (for shoes/clothing)
   */
  async selectSizeIfAvailable() {
    try {
      // Wait briefly for size options to appear
      const sizeOptions = this.page.locator('a._1fGeJ5._3V2wfe, a._3V2wfe, a[class*="size"]');

      if (await sizeOptions.count() > 0) {
        // Click on the first available size
        await sizeOptions.first().click();
        console.log('Size selected successfully');
        await this.wait(1000);
      }
    } catch (error) {
      console.log('No size selection required or available');
    }
  }

  /**
   * Click Add to Cart button
   * @returns {Promise<boolean>} True if successfully added to cart
   */
  async addToCart() {
    await this.wait(2000);

    // First, try to select size if needed (for shoes)
    await this.selectSizeIfAvailable();

    // Find and click Add to Cart button
    try {
      const addToCartBtn = this.page.locator('button:has-text("Add to cart"), button:has-text("ADD TO CART")').first();

      if (await addToCartBtn.isVisible({ timeout: 10000 })) {
        await addToCartBtn.click();
        await this.wait(3000);
        console.log('Clicked Add to Cart button');
        return true;
      }
    } catch (error) {
      console.log('Add to Cart button not found, trying alternative locator');
    }

    // Try alternative button locator
    try {
      const altButton = this.page.locator('button._2KpZ6l._2U9uOA, button[class*="add-to-cart"]').first();
      if (await altButton.isVisible({ timeout: 5000 })) {
        await altButton.click();
        await this.wait(3000);
        return true;
      }
    } catch (error) {
      console.log('Could not add product to cart');
      return false;
    }

    return false;
  }

  /**
   * Check if product was successfully added to cart
   * @returns {Promise<boolean>} True if added successfully
   */
  async isAddedToCart() {
    try {
      // Check for "Go to Cart" button or "Added to Cart" message
      const goToCartBtn = this.page.locator('a:has-text("Go to cart"), a:has-text("GO TO CART"), span:has-text("Go to cart")');
      return await goToCartBtn.isVisible({ timeout: 5000 });
    } catch (error) {
      return false;
    }
  }

  /**
   * Click on Go to Cart button
   */
  async goToCart() {
    try {
      const goToCartBtn = this.page.locator('a:has-text("Go to cart"), a:has-text("GO TO CART"), span:has-text("Go to cart")').first();

      if (await goToCartBtn.isVisible({ timeout: 5000 })) {
        await goToCartBtn.click();
        await this.wait(2000);
        await this.waitForNavigation();
      }
    } catch (error) {
      // Navigate directly to cart page
      await this.navigateTo('/viewcart');
      await this.wait(2000);
    }
  }
}

module.exports = ProductPage;
