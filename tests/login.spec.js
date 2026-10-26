const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const testData = require('../test-data/testData');
const locators = require('../locators/locators.json');

// TC01 - Login with valid credentials
test('TC01 - Login with valid credentials @smoke', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await page.goto('/');

  await loginPage.login(
    testData.validUser.username,
    testData.validUser.password
  );

  await expect(page).toHaveURL(/inventory.html/);
});

// TC02 - Login with invalid credentials
test('TC02 - Login with invalid credentials @negative', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await page.goto('/');

  await loginPage.login(
    testData.invalidUser.username,
    testData.invalidUser.password
  );

  await expect(
    page.locator(locators.login.errorMessage)
  ).toBeVisible();

  await expect(page).not.toHaveURL(/inventory.html/);
});

// TC03 - Login with empty credentials
test('TC03 - Login with empty credentials @negative', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await page.goto('/');

  await loginPage.login('', '');

  await expect(
    page.locator(locators.login.errorMessage)
  ).toHaveText('Epic sadface: Username is required');

  await expect(page).not.toHaveURL(/inventory.html/);
});