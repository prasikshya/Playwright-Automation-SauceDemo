const { expect } = require('@playwright/test');
const locators = require('../locators/cart.json');

class CartPage {
  constructor(page) {
    this.page = page;
  }

  async openCart() {
    await this.page.locator(locators.cartLink).click();
  }

  async verifyProductInCart(productName, quantity = '1') {
    const product = this.page
      .locator(locators.cartItems)
      .filter({ hasText: productName });

    await expect(product).toHaveCount(1);

    await expect(
      product.locator(locators.productNames)
    ).toHaveText(productName);

    await expect(
      product.locator(locators.itemQuantity)
    ).toHaveText(quantity);
  }

async removeBackpack() {
  await this.page.locator(locators.removeBackpack).click();
}

async verifyCartItemDetails(productName, expectedPrice) {
  const product = this.page
    .locator(locators.cartItems)
    .filter({ hasText: productName });

  await expect(product).toHaveCount(1);

  // Verify product name
  await expect(
    product.locator(locators.productNames)
  ).toHaveText(productName);

  // Verify description is not empty
  await expect(
    product.locator(locators.productDescription)
  ).not.toBeEmpty();

  // Verify product price
  await expect(
    product.locator(locators.productPrice)
  ).toHaveText(expectedPrice);

  // Verify quantity
  await expect(
    product.locator(locators.itemQuantity)
  ).toHaveText('1');
}

async continueShopping() {
  await this.page.locator(locators.continueShopping).click();
}

}

module.exports = CartPage;