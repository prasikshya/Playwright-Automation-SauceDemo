const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const ProductsPage = require('../pages/ProductsPage');
const testData = require('../test-data/testData');
const locators = require('../locators/products.json');
const CartPage = require('../pages/CartPage');
const cartLocators = require('../locators/cart.json');


test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);

  await page.goto('/');

  await loginPage.login(
    testData.validUser.username,
    testData.validUser.password
  );

  await expect(page).toHaveURL(/inventory.html/);
});

test('TC04 - Verify product listing @smoke', async ({ page }) => {
  const productsPage = new ProductsPage(page);

  await productsPage.verifyProductListing();
});

test('TC05 - Sort products by price low to high', async ({ page }) => {
  const productsPage = new ProductsPage(page);

  // Select Price (low to high)
  await productsPage.sortProducts('lohi');

  // Get displayed product prices
  const actualPrices = await productsPage.getProductPrices();

  // Create expected ascending order
  const expectedPrices = [...actualPrices].sort((a, b) => a - b);

  // Verify products are sorted correctly
  expect(actualPrices).toEqual(expectedPrices);

  console.log('Actual prices:', actualPrices);
  console.log('Expected prices:', expectedPrices);
});

test('TC06 - Sort products by name A to Z', async ({ page }) => {
  const productsPage = new ProductsPage(page);

  // Select Name (A to Z)
  await productsPage.sortProducts('az');

  // Get displayed product names
  const actualNames = await productsPage.getProductNames();

  // Create expected alphabetical order
  const expectedNames = [...actualNames].sort((a, b) =>
    a.localeCompare(b)
  );

  // Verify alphabetical sorting
  expect(actualNames).toEqual(expectedNames);

  console.log('Actual names:', actualNames);
  console.log('Expected names:', expectedNames);
});


test('TC07 - Add single product to cart @smoke', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);

  await productsPage.addBackpackToCart();

  // Verify cart badge
  await expect(
    page.locator(locators.cartBadge)
  ).toHaveText('1');

  // Verify button changes to Remove
  await expect(
    page.locator(locators.removeBackpack)
  ).toBeVisible();

  // Open cart
  await cartPage.openCart();

  // Verify navigation
  await expect(page).toHaveURL(/cart.html/);

  // Verify correct product and quantity
  await cartPage.verifyProductInCart('Sauce Labs Backpack');

  console.log('TC07 passed');
});

test('TC08 - Add multiple products to cart @smoke', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);

  // Add two products
  await productsPage.addBackpackToCart();
  await productsPage.addBikeLightToCart();

  // Verify cart badge
  await expect(
    page.locator(locators.cartBadge)
  ).toHaveText('2');

  // Open cart
  await cartPage.openCart();

  await expect(page).toHaveURL(/cart.html/);

  // Verify both products
  await cartPage.verifyProductInCart('Sauce Labs Backpack');
  await cartPage.verifyProductInCart('Sauce Labs Bike Light');

  // Verify total number of cart items
  const cartLocators = require('../locators/cart.json');

  await expect(
    page.locator(cartLocators.cartItems)
  ).toHaveCount(2);

  console.log('TC08 passed: Both products added successfully');
});

test('TC09 - Remove product from cart', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);

  // Add two products
  await productsPage.addBackpackToCart();
  await productsPage.addBikeLightToCart();

  // Open cart
  await cartPage.openCart();
  await expect(page).toHaveURL(/cart.html/);

  // Verify initial cart count
  await expect(
    page.locator(cartLocators.cartItems)
  ).toHaveCount(2);

  // Remove backpack
  await cartPage.removeBackpack();

  // Verify cart count decreased
  await expect(
    page.locator(cartLocators.cartBadge)
  ).toHaveText('1');

  await expect(
    page.locator(cartLocators.cartItems)
  ).toHaveCount(1);

  // Verify removed product is absent
  await expect(
    page.locator(cartLocators.productNames)
      .filter({ hasText: 'Sauce Labs Backpack' })
  ).toHaveCount(0);

  // Verify remaining product
  await cartPage.verifyProductInCart('Sauce Labs Bike Light');

  console.log('TC09 passed: Product removed successfully');
});

test('TC10 - Verify cart item details', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);

  // Add backpack
  await productsPage.addBackpackToCart();

  // Open cart
  await cartPage.openCart();

  await expect(page).toHaveURL(/cart.html/);

  // Verify product details
  await cartPage.verifyCartItemDetails(
    'Sauce Labs Backpack',
    '$29.99'
  );

  console.log('TC10 passed: Cart item details verified');
});

test('TC11 - Continue shopping from cart', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);

  // Add product to cart
  await productsPage.addBackpackToCart();

  // Open cart
  await cartPage.openCart();
  await expect(page).toHaveURL(/cart.html/);

  // Click Continue Shopping
  await cartPage.continueShopping();

  // Verify redirected to Products page
  await expect(page).toHaveURL(/inventory.html/);

  // Verify Products page is displayed
  await expect(
    page.locator(locators.pageTitle)
  ).toHaveText('Products');

  // Verify cart item is preserved
  await expect(
    page.locator(locators.cartBadge)
  ).toHaveText('1');

  // Verify added product still shows Remove
  await expect(
    page.locator(locators.removeBackpack)
  ).toBeVisible();

  console.log('TC11 passed: Continued shopping and cart preserved');
});

