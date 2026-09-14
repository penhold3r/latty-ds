import { defineConfig } from '@playwright/test';

// The canonical a11y suite for the docs site (root `pnpm a11y` runs this).
// Builds and serves the real production output rather than the dev server —
// several real bugs this migration found (an <li>/custom-element HTML
// parsing hazard, an icon-registry registration race) only reproduced
// against prerendered/production HTML, never against `docusaurus start`'s
// dev server, so testing dev-mode here would have missed both.
export default defineConfig({
  testDir: './a11y',
  timeout: 30_000,
  reporter: [['list'], ['html', { outputFolder: 'playwright-a11y-report', open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4322'
  },
  webServer: {
    command: 'pnpm build && pnpm serve --port 4322 --no-open',
    port: 4322,
    reuseExistingServer: true,
    timeout: 120_000
  }
});
