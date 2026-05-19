import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = [
  '/',

  '/getting-started/introduction/',
  '/getting-started/installation/',
  '/getting-started/usage/',
  '/getting-started/theming/',

  '/components/introduction/',
  '/components/calendar/',

  '/icons/introduction/',

  '/tokens/introduction/',
  '/tokens/colors/',
  '/tokens/spacing/',
  '/tokens/semantic-tokens/',

  '/recipes/introduction/',
  '/recipes/login-form/',
  '/recipes/profile-card/',
  '/recipes/content-card/',
  '/recipes/hero-banner/',
  '/recipes/stats-widget/',
  '/recipes/empty-state/',

  '/examples/introduction/',
  '/examples/coffee-shop/',
  '/examples/pulse-analytics/',
  '/examples/forma-studio/'
];

for (const route of routes) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${route} [${theme}]`, async ({ page }) => {
      await page.goto(`${route}?theme=${theme}`);
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

      expect(results.violations).toEqual([]);
    });
  }
}
