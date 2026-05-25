# Floating UI Integration Plan

## Problem

Every floating component (`lt-select`, `lt-combobox`, `lt-dropdown`, `lt-date-input`) hand-rolls
`position: absolute` inside its shadow DOM. This breaks under two conditions:

1. **Overflow clipping** — an ancestor with `overflow: hidden/auto` clips the absolutely-positioned panel
2. **Transform ancestor** — any ancestor with a CSS `transform` (including `translateY(0)` used by `lt-dialog`'s open animation) becomes the containing block for `position: fixed`, misplacing the panel

The calendar in `lt-date-input` exhibited both issues inside `lt-dialog`.

## Solution

**`@floating-ui/dom`** for position computation (flip, shift, offset, viewport-aware).
**Popover API** for rendering context — elements in the browser's top layer escape all overflow clipping and transform ancestors.

## Scope

| Component       | Today                                    | After                                                                      |
| --------------- | ---------------------------------------- | -------------------------------------------------------------------------- |
| `lt-date-input` | `position: fixed` + CSS vars (broken)    | Popover API + Floating UI                                                  |
| `lt-select`     | `position: absolute`, CSS-only show/hide | Popover API + Floating UI                                                  |
| `lt-combobox`   | `position: absolute`, CSS-only show/hide | Popover API + Floating UI                                                  |
| `lt-dropdown`   | `position: absolute`, CSS-only show/hide | Popover API + Floating UI                                                  |
| `lt-tooltip`    | Pure CSS hover + `position: absolute`    | **Not changed** — CSS-only hover can't use Popover API; different paradigm |

## Shared Utility

**File:** `packages/web/src/components/shared/floating.ts`

### API

```ts
openFloating(reference: Element, floating: HTMLElement, opts?: FloatingOptions): Promise<() => void>
closeFloating(floating: HTMLElement, cleanup: (() => void) | null): void
floatingPanelReset: CSSResult  // Lit css`` tagged template
```

### `openFloating` steps

1. Set `floating.style.visibility = 'hidden'` — prevent flash before position is computed
2. Call `floating.showPopover()` — places element in top layer (needs dimensions to be measurable)
3. Call `computePosition(reference, floating, { strategy: 'fixed', middleware: [offset, flip, shift] })`
4. Set `floating.style.left = x + 'px'` and `floating.style.top = y + 'px'`
5. Set `floating.style.visibility = ''` — reveal at correct position
6. Start `autoUpdate(reference, floating, reposition)` — keeps position correct on scroll/resize
7. Return the autoUpdate cleanup function

### `closeFloating` steps

1. Call `cleanup()` — stops `autoUpdate` listeners
2. Call `floating.hidePopover()` — removes from top layer

### `floatingPanelReset`

Resets UA popover stylesheet defaults so each component's own visual styles take over:

```css
[popover] {
  border: 0;
  inset: unset;
  margin: 0;
  overflow: visible;
  padding: 0;
}
```

### `FloatingOptions`

```ts
interface FloatingOptions {
  placement?: Placement; // @floating-ui/dom Placement — defaults to 'bottom-start'
  offsetPx?: number; // gap between reference and floating — defaults to 4
}
```

## Per-Component Changes

### `lt-date-input`

**Template**

- Always render `.dropdown` div (remove conditional rendering of the div itself)
- Add `popover="manual"` attribute to `.dropdown`
- Conditionally render `lt-calendar` inside based on `_open` state

**`date-input.ts`**

- `_openDropdown()`: call `openFloating(fieldBtn, dropdown)`, store returned cleanup
- `_closeDropdown()`: call `closeFloating(dropdown, cleanup)`
- Remove the `getBoundingClientRect` + CSS vars code (replaced by `openFloating`)

**`date-input.styles.ts`**

- Add `floatingPanelReset` to `static styles`
- Remove `position: fixed` and `--_dropdown-top/left` CSS vars from `.dropdown` rule
- Keep `filter: drop-shadow(...)` and `z-index: 9999`

**Tests**

- Remove stale CSS-var assertions (`--_dropdown-top`, `--_dropdown-left`)
- Add assertions that `dropdown.style.top` and `dropdown.style.left` are set (mock `getBoundingClientRect` on reference, mock `showPopover`)
- Update "dropdown is closed by default" — `.dropdown` is now always in DOM; check `lt-calendar` is absent instead

---

### `lt-select`

**Template**

- Add `popover="manual"` to `.listbox` div

**`select.ts`**

- Add `private _floatingCleanup: (() => void) | null = null`
- In `updated()`: when `isOpen` becomes true → `openFloating(trigger, listbox)`, store cleanup; when false → `closeFloating(listbox, cleanup)`

**`select.styles.ts`**

- Add `floatingPanelReset` to `static styles`
- Remove `position: absolute; top: ...; left: 0` from `.listbox`
- Remove `:host([open]) .listbox { display: block }` — popover handles visibility

---

### `lt-combobox`

Same pattern as `lt-select`.

**Template**

- Add `popover="manual"` to `.dropdown` div

**`combobox.ts`**

- `openDropdown()`: call `openFloating(inputWrap, dropdown)`, store cleanup
- `closeDropdown()`: call `closeFloating(dropdown, cleanup)`

**`combobox.styles.ts`**

- Add `floatingPanelReset` to `static styles`
- Remove `position: absolute` from `.dropdown`
- Remove `:host([open]) .dropdown { display: block }` (or equivalent)

---

### `lt-dropdown`

**Template**

- Add `popover="manual"` to `lt-surface.menu`

**`dropdown.ts`**

- Already has `updated()` with open/close lifecycle
- Add `openFloating(triggerEl, menuEl)` on open, `closeFloating` on close
- The `placement` prop maps directly to Floating UI placement strings — pass it through

**`dropdown.styles.ts`**

- Add `floatingPanelReset` to `static styles`
- Remove ALL placement variant rules (`:host([placement='bottom-end'])`, etc.) — Floating UI handles placement
- Remove `position: absolute; top: ...; left: 0` from `lt-surface.menu`
- Remove `:host([open]) lt-surface.menu { display: block }` — popover handles visibility

---

## Install

```bash
pnpm --filter @latty/web add @floating-ui/dom
```

`@floating-ui/dom` ships dual CJS/ESM — no CRACO changes needed in consumer apps.

## Order of Work

- [x] Install `@floating-ui/dom` in `@latty/web`
- [x] Write `shared/floating.ts` with `openFloating`, `closeFloating`, `floatingPanelReset`
- [x] Write unit tests for `shared/floating.ts` (mock `computePosition`, `autoUpdate`)
- [x] Migrate `lt-date-input`
- [x] Migrate `lt-select`
- [x] Migrate `lt-combobox`
- [x] Migrate `lt-dropdown`
- [x] Build `@latty/web`, yalc publish
- [x] Run full test suite (`pnpm test`) — 1017 passing
- [ ] Commit
