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

## Deferred (not in V1)

- Range selection (`value-start` / `value-end`)
- Month/year quick-jump dropdown (click heading to open select)
- Multiple month view
- Integration with `lt-datepicker` as a popover trigger
