# Example Sites — Audit & Component Improvement Backlog

Running log of gaps, workarounds, and improvement ideas surfaced while building the three example sites. Each entry is a candidate issue or enhancement — not a commitment. Review after all three sites are done and prioritise before acting.

---

## Site 1 — Ember (Coffee Shop)

### A11y (pa11y / axe findings)

**`lt-link` on dark backgrounds fails contrast checks**
`lt-link` hard-codes its colour to `var(--lt-interactive-primary-bg)` (primary-500). On dark palette backgrounds like `primary-900`, primary-500 produces ~1.37:1 contrast — well below WCAG 2AA (4.5:1). There is no `variant`, `appearance`, or explicit colour prop to override this. CSS custom property overrides on a parent do not cascade visibly to axe because axe resolves the shadow DOM `<a>` colour directly, and `::part()` CSS rules are invisible to axe's contrast algorithm.

**Workaround used:** Replaced `lt-link` with native `<a>` elements in the footer nav, styled with an explicit `color: var(--lt-color-primary-300)`.

**Suggested fix:** Add a `color` prop (or a `variant="inverse"` appearance) to `lt-link` that overrides the inner `<a>` colour. Alternatively, expose `--lt-link-color` and `--lt-link-color-hover` as documented CSS custom properties on `:host`, allowing consumers to override without shadow DOM workarounds.

---

**`lt-button` is not form-associated**
`lt-button` does not implement the `ElementInternals` / `formAssociated` API, so clicking it inside a `<form>` does not fire the form's `submit` event. Pa11y flags any `<form>` that contains only `lt-button` as having "no submit button", and keyboard users cannot submit the form via Enter.

**Workaround used:** Added a visually-hidden native `<button type="submit">` inside the form, and wired `lt-button`'s click to `form.requestSubmit()`. Both paths funnel through the form's `submit` event handler.

**Suggested fix:** Add `static formAssociated = true` and `this.attachInternals()` to `LtButton`. Forward the `type` attribute (`submit | button | reset`) to the internals so the browser treats it as a real submit button.

---

**axe does not resolve `::part()` CSS for contrast**
Setting colour via `selector::part(base) { color: ... }` changes the rendered appearance correctly, but axe traces the shadow DOM element's direct computed colour, not the applied `::part()` rule. This means `::part()` overrides pass visually but still fail automated contrast checks.

**Implication:** Any design system component that owns its text colour in shadow DOM CSS (rather than inheriting from `:host`) will be invisible to axe's contrast checker unless the colour is also surfaced on the host element (e.g. via a `color` property that sets `:host { color: ... }`).

---

### Component / Token gaps

**`configure()` FOUC risk — resolved via SSR injection**
`configure()` is a module script — it runs asynchronously after HTML is parsed. Any element that reads a generated `--lt-color-primary-*` token before `configure()` fires gets an empty variable.

**Fix applied:** `createStyleSheet()` (also exported from `@latty/tokens/configure`) is Node.js-safe. In Astro, calling it in the frontmatter and embedding the result as `<style id="lt-tokens" set:html={css}></style>` in `<head>` makes tokens available before any element is painted. The `configure()` call in the script block is no longer needed for example pages.

---

**`lt-snackbar` was passing `background-color` to `lt-surface` instead of `background`**
Bug found and fixed during site 1 build: `snackbar.ts` used the attribute `background-color` but `lt-surface` only accepts `background`. The snackbar rendered white regardless of variant.

**Status:** Fixed in `packages/web/src/components/snackbar/snackbar.ts`.

---

## Site 2 — Meridian (Pulse Analytics)

_To be filled in after building the site._

---

## Site 3 — Void Studio (Dark Creative Agency)

_To be filled in after building the site._

---

## Cross-cutting observations

| #   | Component       | Issue                                                                                                                             | Severity | Fix type                                   |
| --- | --------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------ |
| 1   | `lt-link`       | No colour prop — unusable on dark backgrounds without native `<a>` fallback                                                       | High     | New prop or documented CSS custom property |
| 2   | `lt-button`     | Not form-associated — keyboard form submission broken                                                                             | Fixed    | —                                          |
| 3   | `lt-snackbar`   | Wrong `background-color` attribute on `lt-surface`                                                                                | Fixed    | —                                          |
| 4   | `@latty/tokens` | No synchronous token injection path — FOUC risk on first paint                                                                    | Fixed    | —                                          |
| 5   | All components  | axe cannot see `::part()` colour overrides — design system shadow DOM colours must also be surfaced on `:host` for automated a11y | Medium   | Architecture decision                      |
