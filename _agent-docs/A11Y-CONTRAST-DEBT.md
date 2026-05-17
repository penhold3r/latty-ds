# A11Y Contrast Debt

Last updated: 2026-05-17. All known real contrast failures resolved. `pnpm a11y` passes 18/18 URLs (light + dark mode).

---

## Running the Audit

```bash
# Terminal output, light + dark mode (18 URLs):
pnpm a11y

# Same, writes pa11y-ci-report/index.html (gitignored):
pnpm a11y:report
```

Each URL is tested twice — `?theme=light` and `?theme=dark`. The `?theme` query param is read by BaseLayout's inline head script and sets `data-theme` on `<html>` before any paint, so the correct token layer is active when pa11y runs.

---

## Current Results (2026-05-17)

**18/18 URLs pass.**

| URL                          | Light | Dark |
| ---------------------------- | ----- | ---- |
| `/`                          | 0     | 0    |
| `/recipes/login-form/`       | 0     | 0    |
| `/recipes/profile-card/`     | 0     | 0    |
| `/recipes/content-card/`     | 0     | 0    |
| `/recipes/hero-banner/`      | 0     | 0    |
| `/recipes/stats-widgets/`    | 0     | 0    |
| `/recipes/empty-state/`      | 0     | 0    |
| `/examples/coffee-shop/`     | 0     | 0    |
| `/examples/pulse-analytics/` | 0     | 0    |

---

## Resolved Issues

### 1. Homepage — hardcoded raw tokens in scoped CSS (resolved)

Hero title used `--lt-color-secondary-500` and subtitle/feature cards used `--lt-color-neutral-600` directly in `docs/src/pages/index.astro`. These don't adapt to dark mode.

**Fix:** Replaced with semantic tokens:

- `.hero-title` → `--lt-text-secondary`
- `.hero-subtitle`, feature `body-sm` → `--lt-text-subtle`

### 2. neutral-500 / neutral-900 / neutral-600 in recipe pages (resolved)

Recipe pages (`login-form`, `profile-card`, `content-card`, `empty-state`) used raw primitive tokens as inline `style` attributes in both the live preview and all framework code example strings (HTML / React / Vue). These stopped adapting to dark mode after `RecipePreview` was fixed to use semantic background tokens.

**Fix:** Replace-all across all four files:

- `--lt-color-neutral-900` → `--lt-text-default`
- `--lt-color-neutral-600` → `--lt-text-subtle`
- `--lt-color-neutral-500` → `--lt-text-subtle`

### 3. Shiki comment color on dark code block (resolved)

`CodeSnippet` overrides its `pre` background to `--lt-color-secondary-800` (#2e3254), but Shiki's `github-dark` theme outputs comment spans with `style="color:#6A737D"` inline, achieving only 2.56:1 on that background.

**Fix:** Added CSS override in `docs/src/components/CodeSnippet/CodeSnippet.styles.css`:

```css
& :global(span[style*='#6A737D']) {
  color: var(--lt-color-neutral-400) !important;
}
```

`--lt-color-neutral-400` (#ababab) achieves ~4.56:1 on #2e3254 ✓. Shiki outputs the hex uppercase — confirmed by grepping the built dist.

### 4. RecipePreview not responding to dark mode (resolved)

`RecipePreview.styles.css` used hardcoded `--lt-color-neutral-50` (background) and `--lt-color-neutral-200` (border). The wrapper stayed light while the page went dark, causing all inline colors inside it to fail.

**Fix:** Replaced with semantic tokens:

- `background: var(--lt-bg-subtle)`
- `border: 1px solid var(--lt-border-default)`

---

## Shadow DOM False Positives (no fix needed)

pa11y cannot inspect shadow DOM and reports 1.06:1 for components where the outer element has no readable text color. These are not real WCAG failures — they never appear in the passing run because they are resolved by the component's internal shadow styles.

Use `vitest-axe` (already in the test suite) for shadow DOM a11y verification — axe-core can introspect shadow roots.
