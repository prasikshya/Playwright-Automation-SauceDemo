const locators = require('../locators/locators.json');

class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async login(username, password) {
    await this.page.locator(locators.login.username).fill(username);
    await this.page.locator(locators.login.password).fill(password);
    await this.page.locator(locators.login.loginButton).click();
  }
}

module.exports = LoginPage;