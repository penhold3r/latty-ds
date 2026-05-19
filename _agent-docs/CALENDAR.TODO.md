# Calendar Component

## References

- <https://www.webcomponents.org/element/@doubletrade/lit-datepicker>
- <https://github.com/DoubleTrade/lit-datepicker>
- <http://daisyui.com/components/calendar/>
- <https://github.com/gl0b3/simple-calendar>

---

## Context

`lt-datepicker` already exists (native HTML5 input wrapper). `lt-calendar` fills the gap for a visual, always-visible calendar grid — useful standalone in dashboards, booking UIs, etc. V1 is single-date selection; range mode is deferred.

---

## API

### Reflected attributes

| Attribute           | Type         | Default   | Notes                               |
| ------------------- | ------------ | --------- | ----------------------------------- |
| `value`             | `string`     | `''`      | ISO date `YYYY-MM-DD`; empty = none |
| `min`               | `string`     | `''`      | ISO date; dates before are disabled |
| `max`               | `string`     | `''`      | ISO date; dates after are disabled  |
| `locale`            | `string`     | `'en-US'` | BCP 47 locale for day/month names   |
| `week-start`        | `'0' \| '1'` | `'0'`     | 0 = Sunday, 1 = Monday              |
| `show-outside-days` | `boolean`    | `true`    | Show prev/next month filler days    |
| `disabled`          | `boolean`    | `false`   | Disables the entire calendar        |

### JS-only property

| Property        | Type     | Notes                             |
| --------------- | -------- | --------------------------------- |
| `disabledDates` | `Date[]` | Individual dates to mark disabled |

### Events

| Event          | Detail                            | Fired when              |
| -------------- | --------------------------------- | ----------------------- |
| `change`       | `{ value: string }`               | User selects a date     |
| `month-change` | `{ year: number; month: number }` | Month/year view changes |

---

## Components to Reuse

| Component    | Used for                                                |
| ------------ | ------------------------------------------------------- |
| `lt-surface` | Outer card container (`elevation="1"`)                  |
| `lt-button`  | Prev/next chevron nav buttons; "Today" footer button    |
| `lt-text`    | Month-year heading (`variant="h6"`); day-of-week labels |
| `lt-icon`    | `nav-arrow-left` / `nav-arrow-right` inside nav buttons |

Day number cells → native `<button>` elements styled with tokens (not `lt-button` — too heavy for 42 compact circular cells).

---

## Visual Structure

```
┌─────────────────────────────────┐  ← lt-surface elevation="1"
│  ‹  May 2026                  › │  ← lt-button + lt-text h6 + lt-button
│  Su  Mo  Tu  We  Th  Fr  Sa    │  ← lt-text variant="caption" × 7
│  ─────────────────────────────  │
│  26  27  28  29  30   1   2    │
│   3   4   5   6   7   8   9    │
│  10  11  12  13  14  15  16    │  ← native <button> cells
│  17  18  19 [20] 21  22  23    │  ← [today ring]  [selected filled]
│  24  25  26  27  28  29  30    │
│  31   1   2   3   4   5   6    │
│              ┌────────┐         │
│              │  Today │         │  ← lt-button
│              └────────┘         │
└─────────────────────────────────┘
```

---

## Keyboard Navigation

| Key           | Action                       |
| ------------- | ---------------------------- |
| Arrow keys    | Move focus between day cells |
| Enter / Space | Select focused day           |
| PageUp        | Previous month               |
| PageDown      | Next month                   |
| Home          | First day of current week    |
| End           | Last day of current week     |
| Tab           | Leave calendar               |

Roving `tabindex` pattern: only one cell has `tabindex="0"` at a time.

---

## A11y Requirements

- `role="grid"` on grid, `role="row"` per week row, `role="gridcell"` per day button
- `aria-selected` on day cells
- `aria-label="June 15, 2026"` on each cell via `Intl.DateTimeFormat`
- `aria-label="Previous month"` / `"Next month"` on nav buttons
- `aria-live="polite"` on month/year heading (announces navigation to screen readers)
- `aria-disabled` + native `disabled` on out-of-range/disabled days

---

## Token Usage (styles)

| Element          | Token                               |
| ---------------- | ----------------------------------- |
| Day hover        | `--lt-interactive-neutral-bg-hover` |
| Today ring       | `--lt-border-primary`               |
| Selected bg      | `--lt-interactive-primary-bg`       |
| Selected text    | `--lt-text-on-primary`              |
| Outside days     | `--lt-text-muted`                   |
| Disabled opacity | `0.35`                              |
| Grid gap         | `--lt-spacing-1`                    |
| Header padding   | `--lt-spacing-3`                    |

---

## TODO

### Setup

- [x] Run `/new-component Calendar --events change` to scaffold all files

### Types (`calendar.types.ts`)

- [x] Add `CalendarWeekStart = '0' | '1'`
- [x] Add `CalendarDay` interface (`date`, `isCurrentMonth`, `isToday`, `isSelected`, `isDisabled`)

### Component logic (`calendar.ts`)

- [x] Add reflected attributes: `value`, `min`, `max`, `locale`, `week-start`, `show-outside-days`, `disabled`
- [x] Add JS-only property `disabledDates: Date[]`
- [x] Add internal `@state()` for `_viewYear` and `_viewMonth`
- [x] Implement `_buildDays()` — 35/42 cell grid respecting `week-start`
- [x] Implement `_isDisabled(date)` — checks `min`, `max`, `disabledDates`, `disabled`
- [x] Implement `_navigate(delta)` — month stepping + emit `lt-month-change`
- [x] Implement `_selectDay(day)` — set `value` + emit `lt-change`
- [x] Implement `_goToToday()` — reset view to current month
- [x] Implement `_getWeekdayLabels()` — locale-aware, respects `week-start`
- [x] Implement `_handleKeyDown()` — arrow keys, Enter/Space, PageUp/Down, Home/End
- [x] Wire side-effect import: `@latty/icons`
- [x] Sync `_viewYear`/`_viewMonth` to `value` when `value` changes (via `willUpdate`)

### Template (`calendar.ts` render)

- [x] Header: prev button, `aria-live` month/year label, next button
- [x] Weekday row: 7 narrow-label cells (aria-hidden)
- [x] Day grid: `role="grid"`, `role="row"` per week, `role="gridcell"` per day
- [x] Footer: "Today" button

### Styles (`calendar.styles.ts`)

- [x] Header layout (flexbox, space-between)
- [x] Weekday row (7-col grid, centered)
- [x] Day grid (7-col grid, `--lt-spacing-1` gap, `display:contents` rows)
- [x] Day cell base (2.25rem × 2.25rem, `border-radius: 50%`)
- [x] Day states: hover, today (ring), selected (filled), outside (dimmed), disabled

### Tests (`__tests__/calendar.test.ts`)

- [x] Renders current month by default
- [x] `value` attribute marks correct day as selected
- [x] Clicking a day fires `lt-change` with ISO string
- [x] Prev/next buttons update view month; `lt-month-change` fires
- [x] "Today" button resets view to current month
- [x] `min`/`max` disables out-of-range days
- [x] `disabledDates` property disables specific days
- [x] `week-start="1"` renders Mon–Sun headers
- [x] `locale="fr-FR"` renders French labels
- [x] Keyboard: Enter selects; PageUp/PageDown navigates months
- [x] `show-outside-days="false"` hides filler cells
- [x] `disabled` disables all nav controls

### Docs (`docs/src/pages/components/calendar/index.astro`)

- [x] Playground section with `ComponentPlayground` + defaults
- [x] Usage section with HTML/React/Vue examples
- [x] API section with `ApiTable`

### Wiring

- [x] Export added to `packages/web/src/index.ts` (done by scaffold)
- [x] Sidebar entry added to `docs/src/components/Sidebar/index.astro` (done by scaffold)
- [x] React wrapper created manually (`packages/react/src/components/Calendar/`) with camelCase attribute handling
- [x] Export added to `packages/react/src/index.ts`
- [x] Add `/components/calendar` to `a11y/a11y.spec.ts`

### Verification

- [x] `pnpm --filter @latty/web build` — no TS errors; `manifest.json` has `lt-calendar`
- [x] `pnpm test` — 21/21 calendar tests pass, 924/924 total
- [x] `pnpm typecheck` — clean
- [x] `pnpm docs:dev` → `/components/calendar` — renders, nav works, selection fires
- [x] `pnpm a11y` — 46/46 URLs pass (calendar light + dark)
- [x] `pnpm lint:markup` — zero errors

---

## V2: Range Selection

### API additions

| Attribute     | Type                  | Default    | Notes                 |
| ------------- | --------------------- | ---------- | --------------------- |
| `mode`        | `'single' \| 'range'` | `'single'` | Selection mode        |
| `value-start` | `string`              | `''`       | ISO date; range start |
| `value-end`   | `string`              | `''`       | ISO date; range end   |

Event in range mode: `lt-change` → `{ valueStart: string, valueEnd: string }`

### TODO

- [x] Add `CalendarMode` type and range fields to `CalendarDay` (`calendar.types.ts`)
- [x] Refactor styles — `.day__inner` span for circle layer, `.day` as strip layer; `column-gap: 0`, `grid-template-columns: repeat(7, 1fr)`, fixed calendar `width: 17.25rem`
- [x] Add range CSS classes: `day--range-left`, `day--range-right`, `day--range-confirmed`, `day--range-hover`, `day--in-range`, `day--in-hover-range`
- [x] Add `mode`, `valueStart`, `valueEnd` props to component
- [x] Add `_hoverDate` state; `_handleGridMouseOver` / `_handleGridMouseLeave` on grid container
- [x] Update `_buildDays()` with range and hover-preview logic (normalized so visStart ≤ visEnd)
- [x] Update `_selectDay()` for range: first click = start, second = end, before-start = swap, same = clear, both-set = restart
- [x] Update `willUpdate` to sync view from `valueStart`
- [x] Update `render()`: add `<span class="day__inner">`, range CSS classes, grid mouse handlers
- [x] Update React wrapper (`Calendar.tsx`) — add `valueStart`, `valueEnd` via `setAttribute`
- [x] Add 12 range-mode tests (`calendar.test.ts`) — all pass
- [x] Update docs page (`index.astro`) — range examples in Usage section
- [x] `pnpm test` — 935/935 pass
- [x] `pnpm typecheck` — clean
- [x] `pnpm --filter @latty/web build` — manifest updated (42 components)

---

## V2: Month/Year Quick-Jump

Clicking the month/year heading opens an inline picker panel. The prev/next arrows repurpose to navigate years while the picker is open.

### Changes

- `_pickingMonthYear: boolean` state — toggles picker panel
- `_pickerYear: number` state — year browsed in picker (doesn't change `_viewYear` until a month is confirmed)
- `_navigate(delta)` routes to `_pickerYear ±= delta` when picker is open
- `_openPicker()` / `_closePicker()` / `_selectPickerMonth(month)` methods
- `_goToToday()` closes picker before resetting view
- Month label `<span>` → `<button class="month-label-btn">` with `aria-expanded` and chevron icon
- Single outer template — picker/grid toggle via conditional `pickerBody` so the header DOM stays stable between transitions
- `_handleCalendarKeyDown` on `.calendar` div: `Escape` closes picker
- `picker-month-btn` grid (3×4), `picker-month-btn--current` highlights active month
- Prev/next `aria-label` updates to "Previous/Next year" when picker is open

### TODO

- [x] Add `_pickingMonthYear`, `_pickerYear` states
- [x] Add picker open/close/select methods
- [x] Refactor render to single-template with conditional `pickerBody`
- [x] Update `_navigate()` to handle picker year navigation
- [x] Update `_goToToday()` to close picker
- [x] Add picker CSS (`month-label-btn`, `picker-chevron`, `picker-months`, `picker-month-btn`)
- [x] Add 10 picker tests — all pass
- [x] `pnpm test` — 945/945 pass
- [x] `pnpm typecheck` — clean

---

## V2: Multiple Month View

Show N months side by side. The leftmost panel has the ← nav button; the rightmost has →. Month labels appear as plain text (no picker toggle in multi-month mode — set `months=1` to use the picker).

### API addition

| Attribute | Type     | Default | Notes                                     |
| --------- | -------- | ------- | ----------------------------------------- |
| `months`  | `number` | `1`     | Number of month panels shown side-by-side |

### Changes

- `months: number` prop (reflected)
- `_monthAtOffset(offset)` helper — computes `{year, month}` from view + offset, handling year rollover
- `_buildDays(year, month)` — signature updated to accept explicit year/month (defaults to `_viewYear`/`_viewMonth`)
- `_renderDay(day, rovingDate)` — extracted from render method
- `_renderMonthGrid(year, month, label, rovingDate)` — renders weekdays + grid for one panel
- `render()` branches on `isMulti`:
  - Multi: `calendar--multi` outer class, shared header with `month-label-row`, `month-panels` flex row of `.month-col` items
  - Single: existing path (picker toggle, single grid)
- `willUpdate`: closes picker if `months` switches to > 1
- CSS: `.calendar--multi`, `.month-label-row`, `.month-label`, `.month-panels`, `.month-col`
- Range selection spans panels naturally (date comparisons are global)
- Roving tabindex is shared across all panels

### TODO

- [x] Add `months` prop; `_monthAtOffset` helper
- [x] Refactor `_buildDays` to accept year/month params
- [x] Extract `_renderDay` and `_renderMonthGrid` helpers
- [x] Add multi-month `render()` branch
- [x] Add CSS for multi-month layout
- [x] Update React wrapper (`months` prop)
- [x] Add 9 multi-month tests — all pass
- [x] Update docs page
- [x] `pnpm test` — 954/954 pass
- [x] `pnpm typecheck` — clean

---

## V2: Date Input (`lt-date-input`)

A new component that wraps `lt-calendar` in a floating popover, triggered by a styled text field.
`lt-datepicker` (native HTML5 input wrapper) is NOT modified — `lt-date-input` is a separate component.

### API

| Attribute     | Type                                       | Default           | Notes                                    |
| ------------- | ------------------------------------------ | ----------------- | ---------------------------------------- |
| `value`       | `string`                                   | `''`              | ISO date `YYYY-MM-DD`                    |
| `min`         | `string`                                   | `''`              | ISO date; passed to `lt-calendar`        |
| `max`         | `string`                                   | `''`              | ISO date; passed to `lt-calendar`        |
| `locale`      | `string`                                   | `'en-US'`         | Display locale + calendar labels         |
| `week-start`  | `'0' \| '1'`                               | `'0'`             | Passed to `lt-calendar`                  |
| `label`       | `string`                                   | `''`              | Field label above the trigger            |
| `placeholder` | `string`                                   | `'Select a date'` | Text shown when no date is selected      |
| `helper-text` | `string`                                   | `''`              | Helper or error text below the field     |
| `variant`     | `'default'\|'success'\|'warning'\|'error'` | `'default'`       | Visual state                             |
| `size`        | `'sm'\|'md'\|'lg'`                         | `'md'`            | Field height                             |
| `disabled`    | `boolean`                                  | `false`           | Disables trigger and calendar            |
| `required`    | `boolean`                                  | `false`           | Shows asterisk; sets button `required`   |
| `name`        | `string`                                   | `''`              | Renders hidden input for form submission |

JS-only: `disabledDates: Date[]` — passed to `lt-calendar`.

Event: `lt-change` → `{ value: string }`

### TODO

- [x] `date-input.types.ts` — `DateInputSize`, `DateInputVariant`
- [x] `date-input.styles.ts` — field-btn layout; sizes; variants; dropdown positioning
- [x] `date-input.ts` — all props, `_open` state, `_openDropdown`/`_closeDropdown`, click-outside via `pointerdown`, `_handleCalendarChange` (stopPropagation + re-emit), `_handleDropdownKeyDown` (Escape)
- [x] `index.ts` — component + types export
- [x] 25 tests — all pass
- [x] `docs/src/pages/components/date-input/index.astro` — Playground, Usage, API
- [x] `packages/react/src/components/DateInput/DateInput.tsx` + `index.ts`
- [x] `packages/web/src/index.ts` — add `export * from './components/date-input'`
- [x] `docs/src/components/Sidebar/index.astro` — add "Date Input" before "Datepicker"
- [x] `packages/react/src/index.ts` — add `DateInput` export
- [x] `a11y/a11y.spec.ts` — add `/components/date-input/`
- [x] `pnpm --filter @latty/web build` — manifest has `lt-date-input` (43 components)
- [x] `pnpm test` — 979/979 pass
- [x] `pnpm typecheck` — clean
