const { test, expect } = require('@playwright/test');

const LoginPage = require('../pages/LoginPage');
const ProductsPage = require('../pages/ProductsPage');
const CartPage = require('../pages/CartPage');
const CheckoutPage = require('../pages/CheckoutPage');
const testData = require('../test-data/testData');
const LogoutPage = require('../pages/LogoutPage');

test('E2E01 - Complete shopping journey @e2e', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const logoutPage = new LogoutPage(page);

  // 1. Login
  await page.goto('/');
  await loginPage.login(
    testData.validUser.username,
    testData.validUser.password
  );
  await expect(page).toHaveURL(/inventory.html/);

  // 2. Add products
  await productsPage.addBackpackToCart();
  await productsPage.addBikeLightToCart();

  // 3. Verify cart
  await cartPage.openCart();
  await cartPage.verifyProductInCart('Sauce Labs Backpack');
  await cartPage.verifyProductInCart('Sauce Labs Bike Light');

  // 4. Checkout
  await checkoutPage.startCheckout();
  await checkoutPage.fillCustomerDetails(
    testData.checkoutUser.firstName,
    testData.checkoutUser.lastName,
    testData.checkoutUser.postalCode
  );

  await checkoutPage.continueCheckout();
  await expect(page).toHaveURL(/checkout-step-two.html/);

  // 5. Place order
  await checkoutPage.finishCheckout();

  // 6. Verify order confirmation
  await expect(page).toHaveURL(/checkout-complete.html/);
  await checkoutPage.verifyOrderConfirmation();

  // 7. Return to Products page
await checkoutPage.backToHome();
await expect(page).toHaveURL(/inventory.html/);

// 8. Logout
await logoutPage.logout();

// 9. Verify successful logout
await logoutPage.verifyLogout();
});