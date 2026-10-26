const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'https://www.saucedemo.com',
    browserName: 'chromium',
    headless: !!process.env.CI,
    screenshot: 'only-on-failure',
    trace: 'off',
     launchOptions: {
      slowMo:  process.env.DEMO_MODE === 'true' ? 700 : 0, 
    },
  },
  reporter: 'list',
});