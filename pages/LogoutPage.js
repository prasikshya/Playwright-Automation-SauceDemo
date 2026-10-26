const { expect } = require('@playwright/test');
const locators = require('../locators/logout.json');

class LogoutPage {
  constructor(page) {
    this.page = page;
  }

  async logout() {
    await this.page.locator(locators.menuButton).click();

    await expect(
      this.page.locator(locators.logoutLink)
    ).toBeVisible();

    await this.page.locator(locators.logoutLink).click();
  }

  async verifyLogout() {
    await expect(this.page).toHaveURL('https://www.saucedemo.com/');

    await expect(
      this.page.locator(locators.loginButton)
    ).toBeVisible();
  }
}

module.exports = LogoutPage;