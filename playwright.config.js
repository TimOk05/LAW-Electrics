const { defineConfig } = require('@playwright/test');
const os = require('node:os');
const path = require('node:path');

module.exports = defineConfig({
  testDir: './tests',
  outputDir: path.join(os.tmpdir(), 'law-electrics-playwright-results'),
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4178',
    browserName: 'chromium',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:4178',
    reuseExistingServer: true,
    timeout: 30000
  }
});

