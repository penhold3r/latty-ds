import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './a11y',
  timeout: 30_000,
  reporter: [['list'], ['html', { outputFolder: 'playwright-a11y-report', open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4321'
  },
  webServer: {
    command: 'pnpm docs:dev',
    port: 4321,
    reuseExistingServer: true,
    timeout: 120_000
  }
});
