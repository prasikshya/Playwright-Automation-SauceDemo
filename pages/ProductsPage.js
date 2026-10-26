const { expect } = require('@playwright/test');
const locators = require('../locators/products.json');

class ProductsPage {
  constructor(page) {
    this.page = page;
  }

  async verifyProductListing() {
    // Verify page title
    await expect(
      this.page.locator(locators.pageTitle)
    ).toHaveText('Products');

    // Get all products
    const products = this.page.locator(locators.inventoryItems);

    await expect(products.first()).toBeVisible();

    const totalProducts = await products.count();

    console.log(`Total products: ${totalProducts}`);

    // Verify each product
    for (let i = 0; i < totalProducts; i++) {
      const product = products.nth(i);

      await expect(
        product.locator(locators.productNames)
      ).not.toBeEmpty();

      await expect(
        product.locator(locators.productPrices)
      ).toHaveText(/^\$\d+\.\d{2}$/);

      await expect(
        product.locator(locators.addToCartButtons)
      ).toBeVisible();
    }
  }

  async sortProducts(value) {
  await this.page.locator(locators.sortDropdown).selectOption(value);
}

async getProductPrices() {
  const prices = await this.page
    .locator(locators.productPrices)
    .allTextContents();

  return prices.map(price =>
    Number(price.replace('$', '').trim())
  );
}

async getProductNames() {
  return await this.page
    .locator(locators.productNames)
    .allTextContents();
}

async addBackpackToCart() {
  await this.page.locator(locators.addBackpack).click();
}

async addBikeLightToCart() {
  await this.page.locator(locators.addBikeLight).click();
}

}

module.exports = ProductsPage;