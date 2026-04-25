# Latty DS — Improvement Backlog

Generated after full codebase health check (2026-04-23). Items are grouped by priority and should be tackled in order within each phase.

---

## Phase 1 — High Priority

### 1. `index.js` is missing most components

`packages/web/src/index.js` only exports `button`, `chip`, and `tooltip` — all other 19 components are invisible to consumers importing `@latty/web`. Any app doing `import '@latty/web'` gets almost nothing registered.

- **Fix:** Add an export line for every component in the package.
- **Status:** [x] done

### 2. Replace `shadowRoot!.querySelector` with `@query` in Accordion

`packages/web/src/components/accordion/accordion.ts` queries `shadowRoot!.querySelector(...)` in three separate methods, each repeating the same three selectors. This is fragile (non-null assertions) and inefficient (repeated DOM traversal on every interaction).

- **Fix:** Replace with `@query` decorators — they cache the reference and eliminate the `!`. Checkbox and dialog already use this pattern correctly.
- **Status:** [x] done

### 3. `repeat()` in Table uses array index as key

`packages/web/src/components/table/table.ts` uses `(row, index) => index` as the key for `repeat()`. This defeats the purpose — when rows are reordered (which sorting does constantly), Lit destroys and recreates every row instead of moving DOM nodes.

- **Fix:** Accept a `row-key` prop on `lt-table` specifying which field to use as the stable identity key, falling back to JSON fingerprint.
- **Status:** [x] done

### 4. `unsafeHTML` on custom cell renderers is an XSS risk

`packages/web/src/components/table/table.ts`: when `column.render()` returned a string, it was passed to `unsafeHTML()`. Consumers passing data from APIs could accidentally introduce XSS.

- **Fix:** Changed `render` return type to `unknown` and removed `unsafeHTML`. Lit natively handles `TemplateResult` and `HTMLElement` safely. Consumers must now use `html\`...\`` for markup.
- **Status:** [x] done

---

## Phase 2 — Medium Priority

### 5. Duplicate `addEventListener` in `radio-group`

`packages/web/src/components/radio-group/radio-group.ts`: `firstUpdated()` and `updateRadios()` (called on `slotchange`) both call `radio.addEventListener('change', ...)` without checking if the listener is already attached. Radios that don't change slots get double-subscribed and fire the handler twice.

- **Fix:** Added `private _attached = new WeakSet<Radio>()`. Consolidated both methods into `_syncRadios()` which guards with `_attached.has(radio)` before subscribing.
- **Status:** [x] done

### 6. Use `classMap` and `styleMap` in Table instead of string concatenation

`packages/web/src/components/table/table.ts`: `getHeaderClass`, `getCellClass`, and `getColumnStyle` build strings manually with array push + join. `classMap` / `styleMap` are the idiomatic Lit approach — they skip string allocation on unchanged renders and are easier to extend.

- **Fix:** Replaced all three helper methods with inline `classMap`/`styleMap` calls directly in the template. Deleted the helpers.
- **Status:** [x] done

### 7. `@query` over `shadowRoot!` in other components

Audit remaining components that still use `shadowRoot!.querySelector` directly instead of `@query`. Currently only accordion was the main offender, but worth a pass across all components after #2 is done.

- **Fix:** Replaced `tooltip.ts` `firstUpdated` slot query with `@query('slot') private _slot`. The remaining `select.ts` `querySelectorAll` inside the keyboard handler is intentional — it filters by dynamic `:not([disabled])` state and the same method also reads `shadowRoot.activeElement`, which cannot be decorated.
- **Status:** [x] done

---

## Phase 3 — Lower Priority / Good Practice

### 8. Missing `aria-sort` on sortable table headers

`packages/web/src/components/table/table.ts`: sortable `<th>` elements have no `aria-sort` attribute. Screen readers cannot announce sort state.

- **Fix:** Add `aria-sort=${ isCurrentSort ? direction === 'asc' ? 'ascending' : 'descending' : 'none' }` to sortable columns.
- **Status:** [x] done

### 9. Tooltip `_tooltipId` uses `Math.random()`

`packages/web/src/components/tooltip/tooltip.ts`: `Math.random()` can produce collisions and is not SSR-safe.

- **Fix:** Replace with a module-scoped incrementing counter (`let _id = 0; const id = \`lt-tooltip-\${++_id}\``).
- **Status:** [x] done

### 10. Accordion animation reads `offsetHeight` without settled layout

`packages/web/src/components/accordion/accordion.ts`: reading `contentInner.offsetHeight` after `details.open = true` forces a synchronous layout reflow in the click handler. Currently works, but is a footgun if the component is extended.

- **Fix:** Ensure the layout read happens after the browser has committed the open state — this is already implied by the current flow but worth making explicit with a comment.
- **Status:** [x] done

### 11. `row-key` prop for Table (companion to #3)

A `row-key` prop on `lt-table` lets consumers specify which field to use as the `repeat()` stable key, enabling correct DOM reuse across sorts and data updates.

- **Fix:** Add `@property({ attribute: 'row-key' }) rowKey = ''` and use it in the `repeat()` key function.
- **Status:** [x] done (implemented as part of #3)
