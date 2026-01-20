/**
 * Cart Page Object
 * Handles cart validation, product verification, and total calculation
 * Implements Page Object Model pattern
 */

const BasePage = require('./BasePage');
const PriceHelper = require('../utils/priceHelper');

class CartPage extends BasePage {
  /**
   * Initialize CartPage with page object and define locators
   * @param {import('@playwright/test').Page} page - Playwright page instance
   */
  constructor(page) {
    super(page);

    // Locators for Cart Page elements
    this.locators = {
      // Cart item container
      cartItem: 'div._1AtVbE, div[class*="cart-item"]',

      // Product name in cart
      cartProductName: 'a._2Kn22P, div._36ESq6, a.s1Q9rs',

      // Product price in cart
      cartProductPrice: 'div._30jeq3, span._2-ut7f',

      // Cart total amount
      cartTotal: 'div._3dqZjq, span._2-ut7f',

      // Place Order button
      placeOrderButton: 'button._3AWRsL, button:has-text("Place Order")',

      // Remove button
      removeButton: 'div._1u3nMK, div:has-text("Remove")',

      // Empty cart message
      emptyCartMessage: 'div._1AtVbE:has-text("Your cart is empty")',

      // Cart items wrapper
      cartItemsWrapper: 'div._1gYhVI',

      // Total price display
      totalPriceAmount: 'div._3dqZjq span._2-ut7f',

      // Price details section
      priceDetailsSection: 'div._3tDPqS'
    };
  }

  /**
   * Navigate directly to cart page
   */
  async navigateToCart() {
    await this.navigateTo('/viewcart');
    await this.wait(3000);
    await this.waitForNavigation();
  }

  /**
   * Get all products in the cart with their details
   * @returns {Promise<Object[]>} Array of cart items with name and price
   */
  async getCartItems() {
    await this.wait(2000);

    const cartItems = [];

    // Try to find cart items
    try {
      // Get product names
      const nameElements = this.page.locator('a._2Kn22P, a.s1Q9rs, div._36ESq6');
      const priceElements = this.page.locator('div._3fSRat span._2-ut7f, div._30jeq3._1_WHN1');

      const nameCount = await nameElements.count();

      for (let i = 0; i < nameCount; i++) {
        try {
          const name = await nameElements.nth(i).textContent() || '';

          // Try to get corresponding price
          let price = 0;
          let priceText = '';

          if (i < await priceElements.count()) {
            priceText = await priceElements.nth(i).textContent() || '';
            price = PriceHelper.extractPrice(priceText);
          }

          if (name) {
            cartItems.push({
              name: name.trim().substring(0, 50),
              price: price,
              priceText: priceText.trim()
            });
          }
        } catch (error) {
          continue;
        }
      }
    } catch (error) {
      console.log('Error getting cart items:', error.message);
    }

    return cartItems;
  }

  /**
   * Get the total amount displayed in cart
   * @returns {Promise<number>} Total cart amount
   */
  async getCartTotal() {
    try {
      // Look for the total amount in price details
      const totalElement = this.page.locator('div._3dqZjq span._2-ut7f, div._2Tpdn3 span._2-ut7f').last();

      if (await totalElement.isVisible({ timeout: 5000 })) {
        const totalText = await totalElement.textContent();
        return PriceHelper.extractPrice(totalText);
      }

      // Alternative: Look for Total Amount text
      const totalRow = this.page.locator('div:has-text("Total Amount") span._2-ut7f');
      if (await totalRow.count() > 0) {
        const totalText = await totalRow.last().textContent();
        return PriceHelper.extractPrice(totalText);
      }
    } catch (error) {
      console.log('Could not get cart total:', error.message);
    }

    return 0;
  }

  /**
   * Calculate expected total from individual product prices
   * @returns {Promise<number>} Calculated total
   */
  async calculateExpectedTotal() {
    const items = await this.getCartItems();
    return PriceHelper.calculateTotal(items.map(item => item.price));
  }

  /**
   * Validate cart contents against expected products
   * @param {Object[]} expectedProducts - Array of expected products with name and price
   * @returns {Promise<Object>} Validation result
   */
  async validateCartContents(expectedProducts) {
    const cartItems = await this.getCartItems();

    const validationResult = {
      passed: true,
      cartItems: cartItems,
      expectedProducts: expectedProducts,
      matches: [],
      mismatches: []
    };

    // Check if all expected products are in cart
    for (const expected of expectedProducts) {
      // Find matching item in cart (fuzzy match on name)
      const matchingItem = cartItems.find(item =>
        item.name.toLowerCase().includes(expected.name.toLowerCase().substring(0, 20)) ||
        expected.name.toLowerCase().includes(item.name.toLowerCase().substring(0, 20))
      );

      if (matchingItem) {
        // Check price match (allow small variation due to taxes/discounts)
        const priceDiff = Math.abs(matchingItem.price - expected.price);
        const priceMatch = priceDiff < 100 || expected.price === 0; // Allow ₹100 variation

        if (priceMatch) {
          validationResult.matches.push({
            expected: expected,
            actual: matchingItem,
            status: 'MATCH'
          });
        } else {
          validationResult.passed = false;
          validationResult.mismatches.push({
            expected: expected,
            actual: matchingItem,
            status: 'PRICE_MISMATCH',
            message: `Price mismatch: Expected ₹${expected.price}, Got ₹${matchingItem.price}`
          });
        }
      } else {
        validationResult.passed = false;
        validationResult.mismatches.push({
          expected: expected,
          actual: null,
          status: 'NOT_FOUND',
          message: `Product "${expected.name}" not found in cart`
        });
      }
    }

    return validationResult;
  }

  /**
   * Validate the total sum in cart
   * @param {number} expectedTotal - Expected total amount
   * @returns {Promise<Object>} Validation result
   */
  async validateTotal(expectedTotal) {
    const displayedTotal = await this.getCartTotal();
    const calculatedTotal = await this.calculateExpectedTotal();

    // Allow small variation for taxes, delivery charges, etc.
    const tolerance = expectedTotal * 0.1; // 10% tolerance

    return {
      displayedTotal: displayedTotal,
      calculatedTotal: calculatedTotal,
      expectedTotal: expectedTotal,
      isDisplayedCorrect: Math.abs(displayedTotal - expectedTotal) <= tolerance,
      isCalculatedCorrect: Math.abs(calculatedTotal - expectedTotal) <= tolerance,
      message: `Displayed: ₹${displayedTotal}, Calculated: ₹${calculatedTotal}, Expected: ₹${expectedTotal}`
    };
  }

  /**
   * Check if cart is empty
   * @returns {Promise<boolean>} True if cart is empty
   */
  async isCartEmpty() {
    try {
      const emptyMessage = this.page.locator('div:has-text("Your cart is empty"), div:has-text("Missing Cart items")');
      return await emptyMessage.isVisible({ timeout: 3000 });
    } catch (error) {
      // If no empty message, check if there are items
      const items = await this.getCartItems();
      return items.length === 0;
    }
  }

  /**
   * Get number of items in cart
   * @returns {Promise<number>} Number of items
   */
  async getCartItemCount() {
    const items = await this.getCartItems();
    return items.length;
  }

  /**
   * Remove all items from cart
   */
  async clearCart() {
    try {
      const removeButtons = this.page.locator('div:has-text("Remove")');
      const count = await removeButtons.count();

      for (let i = 0; i < count; i++) {
        await removeButtons.first().click();
        await this.wait(2000);
      }
    } catch (error) {
      console.log('Error clearing cart:', error.message);
    }
  }
}

module.exports = CartPage;
