const { test, expect } = require('@playwright/test');

const LoginPage = require('../pages/LoginPage');
const LogoutPage = require('../pages/LogoutPage');
const testData = require('../test-data/testData');

test('TC17 - Logout successfully @smoke', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const logoutPage = new LogoutPage(page);

  // Navigate to SauceDemo
  await page.goto('/');

  // Login
  await loginPage.login(
    testData.validUser.username,
    testData.validUser.password
  );

  await expect(page).toHaveURL(/inventory.html/);

  // Logout
  await logoutPage.logout();

  // Verify successful logout
  await logoutPage.verifyLogout();

  console.log('TC17 passed: User logged out successfully');
});