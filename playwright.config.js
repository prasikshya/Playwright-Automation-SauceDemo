const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'https://www.saucedemo.com',
    browserName: 'chromium',
    headless: false,
    screenshot: 'only-on-failure',
    trace: 'off',
     launchOptions: {
      slowMo: 700, // Delay each Playwright browser operation by 700ms
    },
  },
  reporter: 'list',
});