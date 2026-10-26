# SauceDemo – Playwright Test Automation

[![Playwright Automation Tests](https://github.com/prasikshya/Playwright-Automation-SauceDemo/actions/workflows/playwright.yml/badge.svg)](https://github.com/prasikshya/Playwright-Automation-SauceDemo/actions/workflows/playwright.yml)


A functional and end-to-end test automation project built using **Playwright and JavaScript** to validate critical e-commerce workflows on the SauceDemo demo application.

## Tech Stack

- Playwright
- JavaScript
- Node.js
- Page Object Model (POM)
- JSON-based element locators
- Chromium

## Test Coverage

The project contains **17 functional test cases** covering:

| Module | Test Cases |
|---|---|
| Login | TC01–TC03 |
| Products & Cart | TC04–TC11 |
| Checkout | TC12–TC16 |
| Logout | TC17 |
| End-to-End | E2E01 |

## Framework Features

- Page Object Model for reusable test methods
- Separate JSON files for element locators
- Data-driven negative testing
- Custom test tags (`@smoke`, `@negative`, `@e2e`)
- Screenshots on test failure
- Dedicated E2E shopping journey

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/prasikshya/SauceDemo-Playwright-Automation.git
cd SauceDemo-Playwright-Automation
npm install
npx playwright install chromium
```

## Running Tests

Run all tests:

```bash
npx playwright test
```

Run in headed mode:

```bash
npx playwright test --headed
```

Run smoke tests:

```bash
npx playwright test --grep "@smoke"
```

Run the E2E test:

```bash
npx playwright test --grep "@e2e"
```

Run a specific test case:

```bash
npx playwright test --grep "TC12"
```

## End-to-End Test Flow

Login → Product Selection → Add to Cart → Checkout → Order Confirmation → Logout

## Application Under Test

https://www.saucedemo.com/

**Note:** This is an independent educational QA automation project and is not affiliated with Sauce Labs.


## 🎥 Automation Demo

Watch the complete end-to-end shopping journey automated
using Playwright and JavaScript.

[▶ Watch E2E Automation Demo](COMING_SOON)

**Test Flow:**
Login → Add to Cart → Checkout → Order Confirmation → Logout