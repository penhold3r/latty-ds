# Prop Naming Convention

Naming rules for all `lt-*` component props, plus every rename needed to reach consistency.

---

## Rules

### 1 — `variant` = semantic color only

Controls which semantic color palette to apply.

Values: `'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'default'`

### 2 — `appearance` = visual fill style

Controls how a component is rendered.

Values: `'filled' | 'outlined' | 'solid' | 'ghost' | 'clean' | 'dashed' | 'dotted'`

### 3 — `shape` = structural/geometric form

Describes the shape of a component, not its color or style.

Values: `'circle' | 'square' | 'rect' | 'text'`

### 4 — Booleans are positive adjectives or nouns — never verb phrases

A boolean is `true` when the attribute is present.

✅ `disabled`, `closable`, `hoverable`, `striped`, `bordered`, `loading`, `tooltip`
❌ `showTooltip`, `hideCloseButton`, `withIcon`, `show-icon` — no verb phrases of any polarity

**Exception:** `no-` prefix when a feature is ON by default and the attribute disables it.
e.g. `no-marker` (markers show by default), `no-close-button` (close button shows by default)

### 5 — `placement` for floating/overlay positions

All components that position themselves relative to a trigger use `placement`.

Values: `'top' | 'bottom' | 'left' | 'right'` (plus `-start` / `-end` variants)

> `anchor` on `lt-sidepanel` stays — it means "which edge to attach to", a different concept from floating placement.

### 6 — `icon-start` / `icon-end` for icon pairs (symmetric)

All components use `icon-start` for the leading icon and `icon-end` for the trailing icon. No bare `icon` for positional icon slots.

**Exception:** a standalone decorative/status icon (e.g. on `lt-alert`, `lt-snackbar`) uses bare `icon` — it is not a start/end pair.

---

## Renames Required

### `variant` → `appearance` (visual-style components)

These components use `variant` for fill/style, not semantic color.

| Component | Old | New | Type rename |
|---|---|---|---|
| `lt-surface` | `variant: 'filled' \| 'outlined'` | `appearance` | `SurfaceVariant` → `SurfaceAppearance` |
| `lt-divider` | `variant: 'solid' \| 'dashed' \| 'dotted'` | `appearance` | `DividerVariant` → `DividerAppearance` |
| `lt-accordion` | `variant: 'default' \| 'filled' \| 'outlined' \| 'clean'` | `appearance` | `AccordionVariant` → `AccordionAppearance` |
| `lt-tab-group` | `variant: 'default' \| 'pills'` | `appearance` | `TabGroupVariant` → `TabGroupAppearance` |

### `variant` → `shape`

| Component | Old | New | Type rename |
|---|---|---|---|
| `lt-skeleton` | `variant: 'text' \| 'circle' \| 'rect'` | `shape` | `SkeletonVariant` → `SkeletonShape` |

### `variant` → `background` (header background surface)

`lt-header.variant` picks which color surface the header sits on. `background` is the most precise name — `color` in CSS means text/foreground color (wrong mental model), and `background-color` reads too much like a raw CSS property being passed through. `background` is unambiguous.

| Component | Old | New | Type rename |
|---|---|---|---|
| `lt-header` | `variant: 'primary' \| 'surface'` | `background` | `HeaderVariant` → `HeaderBackground` |

### Boolean: negative verb → `no-` prefix

| Component | Old attr | New attr | TS rename |
|---|---|---|---|
| `lt-dialog` | `hide-close-button` | `no-close-button` | `hideCloseButton` → `noCloseButton` |
| `lt-sidepanel` | `hide-close-button` | `no-close-button` | `hideCloseButton` → `noCloseButton` |

### Boolean: verb phrase → noun

| Component | Old | New | Notes |
|---|---|---|---|
| `lt-slider` | `showTooltip` / `show-tooltip` | `tooltip` / `tooltip` | Boolean noun |

### `withIcon` → `icon` string prop (alert + snackbar)

Replace the boolean with a string prop that handles three cases:

| Value | Behaviour |
|---|---|
| `""` (default) | Auto-select icon based on variant — shows for status variants, hidden for `default` |
| `"check"` (any name) | Override with a specific icon |
| `"none"` | Suppress the icon entirely |

| Component | Old | New | Default |
|---|---|---|---|
| `lt-alert` | `withIcon: boolean = false` | `icon: string = ''` | auto for status variants |
| `lt-snackbar` | `withIcon: boolean = false` | `icon: string = ''` | auto for status variants |

### `position` → `placement` (tooltip)

| Component | Old | New | Type rename |
|---|---|---|---|
| `lt-tooltip` | `position` | `placement` | `TooltipPosition` → `TooltipPlacement` |

### Icon props → symmetric `icon-start` / `icon-end`

| Component | Old | New |
|---|---|---|
| `lt-button` | `icon` / `icon-end` | `icon-start` / `icon-end` |
| `lt-list-item` | `icon` / `icon-end` | `icon-start` / `icon-end` |
| `lt-accordion` | `icon` | `icon-start` |
| `lt-tab` | `icon` | `icon-start` |
| `lt-textfield` | `icon-start` ✅ | no change |

---

## Already Consistent (no changes)

| Prop | Used on | Notes |
|---|---|---|
| `size` | all components | `'sm' \| 'md' \| 'lg'` uniform ✅ |
| `disabled`, `checked`, `open`, `active`, `selected`, `loading` | various | HTML-native state adjectives ✅ |
| `closable` | alert, snackbar | positive boolean for dismiss ✅ |
| `icon-start` / `icon-end` | textfield / button, list-item | will be uniform after renames ✅ |
| `label-position` | checkbox, radio, switch | consistent ✅ |
| `name`, `value`, `placeholder`, `label`, `required`, `readonly` | form components | form-native ✅ |
| `no-marker` | list | correct `no-` prefix pattern ✅ |
| `placement` | dropdown | already correct ✅ |
| `anchor` | sidepanel | edge/drawer, intentionally different from floating ✅ |
| `variant` (color) | button, badge, chip, progress, spinner, radio, checkbox, snackbar, alert, textfield, select | semantic color ✅ |
| `appearance` | button, badge, chip, alert | fill style ✅ |
