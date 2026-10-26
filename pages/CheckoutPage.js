const locators = require('../locators/checkout.json');
const { expect } = require('@playwright/test');


class CheckoutPage {
  constructor(page) {
    this.page = page;
  }

  async startCheckout() {
    await this.page.locator(locators.checkoutButton).click();
  }

  async fillCustomerDetails(firstName, lastName, postalCode) {
    await this.page.locator(locators.firstName).fill(firstName);
    await this.page.locator(locators.lastName).fill(lastName);
    await this.page.locator(locators.postalCode).fill(postalCode);
  }

  async continueCheckout() {
    await this.page.locator(locators.continueButton).click();
  }

  async finishCheckout() {
    await this.page.locator(locators.finishButton).click();
  }

async verifyCheckoutError(expectedMessage) {
  await expect(
    this.page.locator(locators.errorMessage)
  ).toHaveText(expectedMessage);
}

async getCheckoutAmounts() {
  const priceTexts = await this.page
    .locator(locators.itemPrices)
    .allTextContents();

  const itemPrices = priceTexts.map(text =>
    Number(text.replace('$', '').trim())
  );

  const subtotalText = await this.page.locator(locators.subtotal).innerText();
  const taxText = await this.page.locator(locators.tax).innerText();
  const totalText = await this.page.locator(locators.total).innerText();

  const getAmount = text => Number(text.split('$')[1]);

  return {
    itemPrices,
    subtotal: getAmount(subtotalText),
    tax: getAmount(taxText),
    total: getAmount(totalText)
  };
}


async verifyOrderConfirmation() {
  await expect(
    this.page.locator(locators.confirmationTitle)
  ).toHaveText('Thank you for your order!');

  await expect(
    this.page.locator(locators.confirmationDescription)
  ).not.toBeEmpty();

  await expect(
    this.page.locator(locators.backHomeButton)
  ).toBeVisible();
}

async backToHome() {
  await this.page.locator(locators.backHomeButton).click();
}

async verifyOrderConfirmation() {
  await expect(
    this.page.locator(locators.confirmationTitle)
  ).toHaveText('Thank you for your order!');

  await expect(
    this.page.locator(locators.confirmationDescription)
  ).not.toBeEmpty();

  await expect(
    this.page.locator(locators.backHomeButton)
  ).toBeVisible();
}

async backToHome() {
  await this.page.locator(locators.backHomeButton).click();
}

async cancelCheckout() {
  await this.page.locator(locators.cancelButton).click();
}
}

module.exports = CheckoutPage;