# Docs Audit — 2026-05-27

**Overall health: 7/10** — Structure is solid, content is mostly complete, but a batch of stale event names from the `lt-*` → unprefixed rename slipped through across 7+ component pages.

---

## Top 3 urgent issues

1. **Stale `lt-*` event names** in 7 component pages — code examples reference events that no longer exist
2. **Dialog React prop** — `onLtDialogClose` / `onLtDialogOpen` should be `onClose` / `onOpen`
3. **color-input page** uses wrong `lt-text` attribute syntax (`as="h1"` should be `variant="h1"`)

---

## HIGH PRIORITY — Wrong / broken content

### Stale event names (all examples below are wrong)

These events had their `lt-` prefix removed in a prior refactor. Docs were not updated.

| Page       | Location                                                       | Wrong                       | Correct          |
| ---------- | -------------------------------------------------------------- | --------------------------- | ---------------- |
| combobox   | HTML addEventListener + Vue                                    | `lt-change`                 | `change`         |
| datepicker | HTML addEventListener + Vue                                    | `lt-change`                 | `change`         |
| dialog     | JSDoc comment, Vue `@lt-dialog-close`, React `onLtDialogClose` | `lt-open`/`lt-dialog-close` | `open`/`close`   |
| dropdown   | HTML addEventListener, Vue, React                              | `lt-select`                 | `select`         |
| pagination | HTML addEventListener + Vue                                    | `lt-change`                 | `change`         |
| sidepanel  | HTML addEventListener + Vue                                    | `lt-close`                  | `close`          |
| slider     | JSDoc comment, HTML addEventListener, Vue                      | `lt-input`/`lt-change`      | `input`/`change` |

### color-input page — wrong lt-text syntax

Uses `<lt-text as="h1">` / `<lt-text as="h2">` / `<lt-text as="p">`.
The `as` attribute overrides the rendered HTML tag but does not set the visual style.
Should be `<lt-text variant="h1">`, `<lt-text variant="h2">`, `<lt-text variant="body">` (with `as` only when the semantic tag needs to differ from the visual variant).

---

## MEDIUM PRIORITY — Missing content

### Components with events but no event listening example

- **select** — emits `change` but no addEventListener/Vue/@change example
- **switch** — emits `change` but no event example
- **checkbox** — emits `change` but no event example

### Slider event documentation

Should explicitly show the two-event pattern:

- `input` fires continuously while dragging (live feedback)
- `change` fires once on release (commit value)

### React prop names for dialog

React wrapper codegen would have produced `onClose` / `onOpen` (not `onLtDialogClose`). The docs example should reflect this.

---

## LOW PRIORITY — Polish / improvements

- **CRA page**: Worth noting CRA is EOL and Vite is the recommended alternative, though CRACO setup remains valid for existing CRA projects.
- **Theming page**: Component-level token override table could link to individual component pages for the full list of `--lt-*` vars each component exposes.
- **Icons introduction**: Great overall. No issues found.
- **Recipes**: All 6 are complete and use Latty components correctly.
- **Tokens pages**: Colors, spacing, and semantic tokens are all accurate and visually useful.

---

## Pages with no issues

Getting started (all 4), frameworks/vite, all token pages, icons/introduction, components: accordion, alert, avatar, badge, breadcrumb, button, calendar, checkbox (aside from no event example), chip, date-input, datepicker (event name aside), divider, header, icon-button, image, link, list, navigation, progress, radio, select (event example missing), skeleton, snackbar, spinner, surface, switch (event example missing), tab, table, text, textfield, tooltip. All recipes.
