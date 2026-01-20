# Flipkart Automation Test Suite

Automated test suite for Flipkart e-commerce website using **Node.js** and **Playwright**.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Test Cases Covered](#test-cases-covered)
5. [Prerequisites](#prerequisites)
6. [Step-by-Step Installation Guide](#step-by-step-installation-guide)
7. [Running Tests](#running-tests)
8. [Test Data Configuration](#test-data-configuration)
9. [Design Principles Applied](#design-principles-applied)
10. [Browser Configuration](#browser-configuration)
11. [AI Usage Disclosure](#ai-usage-disclosure)
12. [Time to Complete](#time-to-complete)

---

## Project Overview

This project contains automated tests for validating:

| Test Case | Description |
|-----------|-------------|
| **Sort Validation** | Validates products are correctly sorted by "Price - Low to High" across multiple pages |
| **Add to Cart** | Validates products can be added to cart with correct prices and total calculation |

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Playwright** | Test automation framework |
| **JavaScript** | Programming language |
| **Chrome** | Browser (Incognito mode) |
| **JSON** | Test data source |

---

## Project Structure

```
SDETAssignment/
│
├── src/
│   ├── pages/                        # Page Object Model classes
│   │   ├── BasePage.js              # Base class with common methods
│   │   ├── HomePage.js              # Flipkart homepage interactions
│   │   ├── SearchResultsPage.js     # Search results, sorting, pagination
│   │   ├── ProductPage.js           # Individual product page actions
│   │   ├── CartPage.js              # Cart page validations
│   │   └── index.js                 # Page objects export
│   │
│   ├── tests/                        # Test specifications
│   │   ├── sortValidation.spec.js   # Sort functionality test
│   │   └── addToCart.spec.js        # Add to cart functionality test
│   │
│   ├── data/                         # Test data source files
│   │   └── testData.json            # Externalized test parameters
│   │
│   └── utils/                        # Utility helper functions
│       ├── dataReader.js            # JSON data reader utility
│       └── priceHelper.js           # Price parsing and validation
│
├── playwright.config.js              # Playwright configuration
├── package.json                      # NPM dependencies and scripts
├── .gitignore                        # Git ignore rules
└── README.md                         # Project documentation
```

---

## Test Cases Covered

### Test Case 1: Validate Sort Functionality

| Step | Action | Data Source |
|------|--------|-------------|
| 1 | Open flipkart.com | - |
| 2 | Type search term in search textbox | `testData.json` → `searchTerm` |
| 3 | Click on Search button | - |
| 4 | Click on Sort option: Price - Low to High | `testData.json` → `sortOption` |
| 5 | Validate prices for products on Page 1 & Page 2 | `testData.json` → `pageLimit` |
| 6 | Assert and display products not following correct sort order | Automatic validation |

**Expected Result:** All products should be displayed in ascending order of price.

### Test Case 2: Validate Add to Cart Functionality

| Step | Action | Data Source |
|------|--------|-------------|
| 1 | Open flipkart.com | - |
| 2 | Type search term in search textbox | `testData.json` → `searchTerm` |
| 3 | Click on Search button | - |
| 4 | Click on Sort option: Price - Low to High | `testData.json` → `sortOption` |
| 5 | Click on 2nd product, Add to cart | `testData.json` → `productsToAdd[0]` |
| 6 | Click on 3rd product, Add to cart | `testData.json` → `productsToAdd[1]` |
| 7 | Go to Cart | - |
| 8 | Validate correct products with correct prices | Automatic validation |
| 9 | Validate Total sum | Automatic calculation |

**Expected Result:** Cart should contain selected products with correct prices and total.

---

## Prerequisites

Before running the tests, ensure you have the following installed:

| Requirement | Version | Download Link |
|-------------|---------|---------------|
| Node.js | v16.x or higher | [nodejs.org](https://nodejs.org/) |
| npm | v7.x or higher | Comes with Node.js |
| Git | Latest | [git-scm.com](https://git-scm.com/) |

**Verify installations:**
```bash
node --version
npm --version
git --version
```

---

## Step-by-Step Installation Guide

### Step 1: Clone the Repository

```bash
git clone https://github.com/newanilupadhyay-del/SDETAssignment.git
```

### Step 2: Navigate to Project Directory

```bash
cd SDETAssignment
```

### Step 3: Install Dependencies

```bash
npm install
```

This will install all required dependencies from `package.json`:
- `@playwright/test` - Playwright testing framework

### Step 4: Install Playwright Browsers

```bash
npx playwright install chromium
```

This downloads the Chromium browser required for testing.

### Step 5: Verify Installation

```bash
npx playwright test --list
```

**Expected Output:**
```
Listing tests:
  [chromium] › addToCart.spec.js › Flipkart Add to Cart Functionality Validation › ...
  [chromium] › sortValidation.spec.js › Flipkart Sort Functionality Validation › ...
Total: 2 tests in 2 files
```

---

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Sort Validation Test Only
```bash
npm run test:sort
```

### Run Add to Cart Test Only
```bash
npm run test:cart
```

### Run Tests in Headed Mode (Visible Browser)
```bash
npm run test:headed
```

### Run Tests in Debug Mode
```bash
npm run test:debug
```

### Run Tests with Playwright UI
```bash
npm run test:ui
```

### View HTML Test Report
```bash
npm run test:report
```

---

## Test Data Configuration

All test parameters are externalized in `src/data/testData.json`:

```json
{
  "sortValidation": {
    "searchTerm": "shoes",
    "sortOption": "Price -- Low to High",
    "pageLimit": 2
  },
  "addToCart": {
    "searchTerm": "shoes",
    "sortOption": "Price -- Low to High",
    "productsToAdd": [2, 3]
  }
}
```

### How to Modify Test Data

| Parameter | Location | Description |
|-----------|----------|-------------|
| `searchTerm` | `testData.json` | Product to search (e.g., "shoes", "mobiles") |
| `sortOption` | `testData.json` | Sort filter text (e.g., "Price -- Low to High") |
| `pageLimit` | `testData.json` | Number of pages to validate |
| `productsToAdd` | `testData.json` | Array of product positions to add to cart |

---

## Design Principles Applied

| Principle | Implementation |
|-----------|----------------|
| **Page Object Model (POM)** | All page interactions encapsulated in separate page classes |
| **Data-Driven Testing** | Test data externalized in JSON files |
| **Single Responsibility** | Each class has one well-defined purpose |
| **DRY (Don't Repeat Yourself)** | Common functionality in BasePage class |
| **Separation of Concerns** | Tests, pages, data, and utilities in separate directories |
| **Configurable** | Browser settings, timeouts, and test data are configurable |

---

## Browser Configuration

As per assignment requirements:

| Setting | Value |
|---------|-------|
| Browser | Chrome |
| Mode | Incognito (Private browsing) |
| Window | Maximized |

**Configuration in `playwright.config.js`:**
```javascript
{
  channel: 'chrome',
  launchOptions: {
    args: [
      '--incognito',
      '--start-maximized',
      '--disable-blink-features=AutomationControlled'
    ]
  },
  viewport: null  // Enables true maximized window
}
```

---

## AI Usage Disclosure

| Aspect | Details |
|--------|---------|
| **AI Tool Used** | Claude Code (Claude Opus 4.5 by Anthropic) |
| **Purpose** | Accelerate development and ensure best practices |

### AI Assistance Areas:
- Project structure design and scaffolding
- Page Object Model implementation
- Test case implementation
- Utility functions for price parsing and validation
- Documentation and README creation

### Human Oversight:
- All code was reviewed for correctness
- Test logic validated against requirements
- Final testing and verification performed manually

---

## Time to Complete

| Task | Time Spent |
|------|------------|
| Project setup and configuration | ~15 minutes |
| Page Object classes | ~30 minutes |
| Test implementations | ~30 minutes |
| Utilities and data handling | ~15 minutes |
| Documentation and README | ~15 minutes |
| **Total** | **~1.5-2 hours** |

---

## Troubleshooting

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| `npm install` fails | Ensure Node.js v16+ is installed |
| Browser not found | Run `npx playwright install chromium` |
| Tests timeout | Check internet connection; increase timeout in config |
| Login popup blocks test | Handled automatically in `HomePage.js` |

### Getting Help

If you encounter issues:
1. Check the console output for error messages
2. Run tests in debug mode: `npm run test:debug`
3. View the HTML report: `npm run test:report`

---

## Author

**SDET Assignment Solution**

---

## License

ISC

---

## Repository

GitHub: [https://github.com/newanilupadhyay-del/SDETAssignment](https://github.com/newanilupadhyay-del/SDETAssignment)
