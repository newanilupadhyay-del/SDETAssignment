/**
 * Page Objects Index
 * Exports all page object classes for easy importing
 */

const BasePage = require('./BasePage');
const HomePage = require('./HomePage');
const SearchResultsPage = require('./SearchResultsPage');
const ProductPage = require('./ProductPage');
const CartPage = require('./CartPage');

module.exports = {
  BasePage,
  HomePage,
  SearchResultsPage,
  ProductPage,
  CartPage
};
