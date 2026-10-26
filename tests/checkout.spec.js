const { test, expect } = require('@playwright/test');

const LoginPage = require('../pages/LoginPage');
const ProductsPage = require('../pages/ProductsPage');
const CartPage = require('../pages/CartPage');
const CheckoutPage = require('../pages/CheckOutPage');
const testData = require('../test-data/testData');
const checkoutLocators = require('../locators/checkout.json');
const locators = require('../locators/products.json');
const productLocators = require('../locators/products.json');

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);

  await page.goto('/');

  await loginPage.login(
    testData.validUser.username,
    testData.validUser.password
  );

  await expect(page).toHaveURL(/inventory.html/);
});

test('TC12 - Complete checkout with valid details @smoke', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  // Add product
  await productsPage.addBackpackToCart();

  // Open cart
  await cartPage.openCart();
  await expect(page).toHaveURL(/cart.html/);

  // Start checkout
  await checkoutPage.startCheckout();
  await expect(page).toHaveURL(/checkout-step-one.html/);

  // Fill customer information
  await checkoutPage.fillCustomerDetails(
    testData.checkoutUser.firstName,
    testData.checkoutUser.lastName,
    testData.checkoutUser.postalCode
  );

  // Continue to checkout overview
  await checkoutPage.continueCheckout();
  await expect(page).toHaveURL(/checkout-step-two.html/);

  // Complete order
  await checkoutPage.finishCheckout();

  // Verify order confirmation
  await expect(page).toHaveURL(/checkout-complete.html/);

  await expect(
    page.locator(checkoutLocators.confirmationMessage)
  ).toHaveText('Thank you for your order!');

  console.log('TC12 passed: Checkout completed successfully');
});

test.describe('TC13 - Checkout required field validation @negative', () => {

  const scenarios = [
    {
      name: 'Empty first name',
      firstName: '',
      lastName: 'Doe',
      postalCode: '44600',
      error: 'Error: First Name is required'
    },
    {
      name: 'Empty last name',
      firstName: 'John',
      lastName: '',
      postalCode: '44600',
      error: 'Error: Last Name is required'
    },
    {
      name: 'Empty postal code',
      firstName: 'John',
      lastName: 'Doe',
      postalCode: '',
      error: 'Error: Postal Code is required'
    }
  ];

  for (const scenario of scenarios) {
    test(scenario.name, async ({ page }) => {
      const productsPage = new ProductsPage(page);
      const cartPage = new CartPage(page);
      const checkoutPage = new CheckoutPage(page);

      // Add product and navigate to checkout
      await productsPage.addBackpackToCart();
      await cartPage.openCart();
      await checkoutPage.startCheckout();

      await expect(page).toHaveURL(/checkout-step-one.html/);

      // Fill customer details
      await checkoutPage.fillCustomerDetails(
        scenario.firstName,
        scenario.lastName,
        scenario.postalCode
      );

      // Submit form
      await checkoutPage.continueCheckout();

      // Verify validation error
      await checkoutPage.verifyCheckoutError(scenario.error);

      // Verify user stays on checkout information page
      await expect(page).toHaveURL(/checkout-step-one.html/);
    });
  }
});

test('TC14 - Verify checkout subtotal, tax and total', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  // Add two products
  await productsPage.addBackpackToCart();
  await productsPage.addBikeLightToCart();

  // Navigate to checkout
  await cartPage.openCart();
  await checkoutPage.startCheckout();

  // Enter valid customer information
  await checkoutPage.fillCustomerDetails(
    testData.checkoutUser.firstName,
    testData.checkoutUser.lastName,
    testData.checkoutUser.postalCode
  );

  await checkoutPage.continueCheckout();

  await expect(page).toHaveURL(/checkout-step-two.html/);

  // Retrieve checkout amounts
  const amounts = await checkoutPage.getCheckoutAmounts();

  // Calculate expected subtotal from individual product prices
  const expectedSubtotal = amounts.itemPrices.reduce(
    (sum, price) => sum + Math.round(price * 100),
    0
  ) / 100;

  // SauceDemo uses an 8% tax rate
  const expectedTax = Math.round(expectedSubtotal * 0.08 * 100) / 100;

  const expectedTotal =
    Math.round((expectedSubtotal + expectedTax) * 100) / 100;

  // Verify calculations
  expect(amounts.subtotal).toBe(expectedSubtotal);
  expect(amounts.tax).toBe(expectedTax);
  expect(amounts.total).toBe(expectedTotal);

  console.log('Subtotal:', amounts.subtotal);
  console.log('Tax:', amounts.tax);
  console.log('Total:', amounts.total);
});

test('TC15 - Verify order confirmation @smoke', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  // Add product
  await productsPage.addBackpackToCart();

  // Navigate to checkout
  await cartPage.openCart();
  await checkoutPage.startCheckout();

  // Fill valid customer information
  await checkoutPage.fillCustomerDetails(
    testData.checkoutUser.firstName,
    testData.checkoutUser.lastName,
    testData.checkoutUser.postalCode
  );

  // Continue to checkout overview
  await checkoutPage.continueCheckout();
  await expect(page).toHaveURL(/checkout-step-two.html/);

  // Complete order
  await checkoutPage.finishCheckout();

  // Verify confirmation page
  await expect(page).toHaveURL(/checkout-complete.html/);

  await checkoutPage.verifyOrderConfirmation();

  // Return to Products page
  await checkoutPage.backToHome();

  await expect(page).toHaveURL(/inventory.html/);

  // Verify cart is empty after successful checkout
  await expect(
    page.locator(locators.cartBadge)
  ).toHaveCount(0);

  console.log('TC15 passed: Order confirmation verified');
});

test('TC16 - Cancel checkout', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  // Add a product to cart
  await productsPage.addBackpackToCart();

  // Navigate to checkout
  await cartPage.openCart();
  await checkoutPage.startCheckout();

  await expect(page).toHaveURL(/checkout-step-one.html/);

  // Enter customer information
  await checkoutPage.fillCustomerDetails(
    testData.checkoutUser.firstName,
    testData.checkoutUser.lastName,
    testData.checkoutUser.postalCode
  );

  // Continue to checkout overview
  await checkoutPage.continueCheckout();

  await expect(page).toHaveURL(/checkout-step-two.html/);

  // Cancel checkout
  await checkoutPage.cancelCheckout();

  // Verify navigation to Products page
  await expect(page).toHaveURL(/inventory.html/);

  // Verify cart item is preserved
  await expect(
    page.locator(productLocators.cartBadge)
  ).toHaveText('1');

  // Verify product is still added
  await expect(
    page.locator(productLocators.removeBackpack)
  ).toBeVisible();

  // Open cart and verify product
  await cartPage.openCart();

  await cartPage.verifyProductInCart('Sauce Labs Backpack');

  console.log('TC16 passed: Checkout canceled, cart preserved');
});

