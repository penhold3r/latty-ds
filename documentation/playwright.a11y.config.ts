import { defineConfig } from '@playwright/test';

// Parallel to the root /playwright.a11y.config.ts (which still targets the
// live Astro `docs` site until cutover) — same shape, pointed at this
// package's own dev server instead.
export default defineConfig({
  testDir: './a11y',
  timeout: 30_000,
  reporter: [['list'], ['html', { outputFolder: 'playwright-a11y-report', open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4322'
  },
  webServer: {
    command: 'pnpm start --port 4322 --no-open',
    port: 4322,
    reuseExistingServer: true,
    timeout: 120_000
  }
});
