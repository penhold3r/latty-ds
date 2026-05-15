# A11Y Contrast Debt

Discovered during the docs refactor pre-push checkup (2026-05-14) via `pnpm a11y` (pa11y-ci, WCAG2AA).
These failures are pre-existing — present before the refactor, confirmed by running pa11y against the stashed state.

4/9 URLs fail. Coffee-shop, pulse-analytics, hero-banner, and stats-widget all pass.

---

## Failing URLs

### `/` — Homepage (5 errors)

All contrast errors. Hero and feature card sections use light text on mid-tone primary backgrounds.

| Element                                                       | Ratio  | Required |
| ------------------------------------------------------------- | ------ | -------- |
| `lt-text[variant="display-xl"]` hero title                    | 2.77:1 | 4.5:1    |
| `lt-text[variant="lead"]` hero subtitle                       | 3.14:1 | 4.5:1    |
| `lt-text[variant="body-sm"]` in 3× feature `lt-surface` cards | 3.14:1 | 4.5:1    |

**Root cause:** The hero and feature cards use `--lt-color-primary-*` backgrounds at mid-range shades where the default text token doesn't have enough contrast. Fix by using a lighter text token on those dark backgrounds, or darken the background further.

---

### `/recipes/login-form/` — 5 errors

| Element                                                        | Ratio  | Required | Note                                                       |
| -------------------------------------------------------------- | ------ | -------- | ---------------------------------------------------------- |
| `lt-text[variant="body-sm"]` subtitle (`neutral-500` on white) | 3.49:1 | 4.5:1    | `neutral-500` is too light for body text on white          |
| `lt-link` "Forgot password?"                                   | 1.06:1 | 4.5:1    | pa11y can't read shadow DOM text — likely a false positive |
| `lt-button[variant="primary"]` "Sign in"                       | 1.06:1 | 4.5:1    | pa11y can't read shadow DOM text — likely a false positive |
| `lt-text[variant="body-sm"]` footer (`neutral-500`)            | 3.49:1 | 4.5:1    | same as subtitle                                           |
| `lt-link` "Sign up" inside body-sm                             | 3.49:1 | 4.5:1    | same                                                       |

**Root cause (real):** `var(--lt-color-neutral-500)` used for secondary text on a white surface has insufficient contrast. Switch to `neutral-700` or use the semantic token `--lt-text-subtle` once it's wired.

**Root cause (false positive):** pa11y cannot introspect shadow DOM, so `lt-button` and `lt-link` report 1.06:1 (background vs. itself). These are not real failures — the actual rendered text is white on a primary-colored button which does pass.

---

### `/recipes/profile-card/` — 6 errors

| Element                                                 | Ratio  | Required | Note                      |
| ------------------------------------------------------- | ------ | -------- | ------------------------- |
| `lt-text[variant="body-sm"]` role label (`neutral-500`) | 3.49:1 | 4.5:1    | same neutral-500 issue    |
| 3× `lt-chip[variant="primary"]`                         | 1.06:1 | 4.5:1    | shadow DOM false positive |
| 2× `lt-button[variant="primary"/"neutral"]`             | 1.06:1 | 4.5:1    | shadow DOM false positive |

**Root cause:** Same `neutral-500` text issue. The chip/button 1.06:1 reports are shadow DOM false positives (same as login-form).

---

### `/recipes/content-card/` — 2 errors

| Element                                               | Ratio  | Required | Note                                                  |
| ----------------------------------------------------- | ------ | -------- | ----------------------------------------------------- |
| `lt-button[variant="primary"][appearance="outlined"]` | 1.06:1 | 4.5:1    | shadow DOM false positive                             |
| Shiki code comment `<span style="color:#6A737D">`     | 2.56:1 | 4.5:1    | Shiki's GitHub theme comment color on dark background |

**Root cause:** Shiki's `github-dark` (or similar) theme uses `#6A737D` for comments which fails on the `--lt-color-secondary-800` code block background. Either switch Shiki theme or override comment token color.

---

### `/recipes/empty-state/` — 2 errors

| Element                        | Ratio  | Required | Note                      |
| ------------------------------ | ------ | -------- | ------------------------- |
| `lt-button[variant="primary"]` | 1.06:1 | 4.5:1    | shadow DOM false positive |
| `lt-link` "Learn more →"       | 1.06:1 | 4.5:1    | shadow DOM false positive |

**Root cause:** Both are shadow DOM false positives.

---

## Summary of Real Failures (excluding shadow DOM false positives)

| Issue                                                 | Affected pages                | Fix                                                               |
| ----------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------- |
| `neutral-500` text on white surface                   | login-form, profile-card      | Replace with `neutral-700` or a `--lt-text-subtle` semantic token |
| Light text on mid-tone primary background             | homepage hero + feature cards | Use lighter text token or deepen the background shade             |
| Shiki comment color `#6A737D` on dark code background | content-card                  | Override Shiki comment token or change theme                      |

## Shadow DOM False Positives (not real failures)

pa11y cannot inspect shadow DOM, so it measures contrast between the host element's background and itself (1.06:1) for `lt-button`, `lt-chip`, and `lt-link`. These are not real WCAG failures — the actual rendered text passes. Fixing these requires either:

- A pa11y plugin that can walk shadow DOM, or
- Axe-core runner (already used in Vitest component tests via `vitest-axe`), which does handle shadow DOM
