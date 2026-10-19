import { css } from 'lit';

export const calendarStyles = css`
  :host {
    /* Shared by .day__inner's own size below and the range-strip backgrounds further down, so the two can never
       drift out of sync again the way they did when the circle was sized down from 2.25rem without the strip
       height following it — the strip kept painting at .day's full (unrelated) button height instead. */
    --_circle-size: 1.75rem;
    display: inline-block;
    font-family: var(--lt-typography-fontFamilyPrimary, 'Hanken Grotesk', sans-serif);
  }

  /* No fixed width here: .calendar shrink-wraps whatever its single flex child (.calendar-body) measures —
     single-month width comes from .calendar-body's own 17.25rem below, multi-month's from its month-panels'
     combined width. This is what lets the presets sidebar EXTEND the card's total width instead of eating into
     the 17.25rem already budgeted to the day grid (see .calendar-body's own comment). */
  .calendar {
    background: var(--lt-bg-default);
    border-radius: var(--lt-border-radius);
    border: var(--lt-border-width, 1px) solid var(--lt-border-default);
    display: flex;
    flex-direction: column;
    gap: var(--lt-spacing-2);
    padding: var(--lt-spacing-3);
  }

  /* ── Presets ── */

  .calendar--with-presets {
    flex-direction: row;
  }

  .presets {
    border-inline-end: var(--lt-border-width, 1px) solid var(--lt-border-subtle);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    gap: var(--lt-spacing-1);
    padding-inline-end: var(--lt-spacing-3);
  }

  .preset-btn {
    background: transparent;
    border-radius: var(--lt-border-radius);
    border: 1px solid transparent;
    color: var(--lt-text-default);
    cursor: pointer;
    font-family: inherit;
    font-size: 0.8125rem;
    font-weight: 400;
    padding: var(--lt-spacing-1) var(--lt-spacing-2);
    text-align: start;
    transition:
      background var(--lt-duration-fast) var(--lt-ease-standard),
      border-color var(--lt-duration-fast) var(--lt-ease-standard);
    white-space: nowrap;
  }

  .preset-btn:hover:not(:disabled) {
    background: var(--lt-bg-neutral-subtle);
    border-color: var(--lt-border-default);
  }

  .preset-btn:disabled {
    color: var(--lt-text-disabled);
    cursor: not-allowed;
    opacity: 0.6;
  }

  .preset-btn:focus-visible {
    outline: var(--lt-border-focusRingWidth) solid var(--lt-focus-ring-color);
    outline-offset: var(--lt-border-focusRingOffset);
  }

  /* Fixed, not flex: 1 — a flexed width would let the presets column eat into the day grid's own space (the
     original bug report: "squishes the grid"). This stays the single-month card's natural 17.25rem regardless
     of whether a presets sidebar sits beside it; .calendar--multi overrides it below, since a multi-month
     .calendar-body needs to size to its month-panels instead of one fixed single-month width. */
  .calendar-body {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    gap: var(--lt-spacing-2);
    width: 17.25rem;
  }

  /* ── Header ── */

  .header {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  .month-label-btn {
    align-items: center;
    background: transparent;
    border-radius: var(--lt-border-radius);
    border: 1px solid transparent;
    color: var(--lt-text-default);
    cursor: pointer;
    display: inline-flex;
    font-family: inherit;
    font-size: 0.9375rem;
    font-weight: 600;
    gap: var(--lt-spacing-1);
    letter-spacing: 0.01em;
    padding: var(--lt-spacing-1) var(--lt-spacing-2);
    transition:
      background var(--lt-duration-fast) var(--lt-ease-standard),
      border-color var(--lt-duration-fast) var(--lt-ease-standard);
  }

  .month-label-btn:hover:not(:disabled) {
    background: var(--lt-bg-neutral-subtle);
    border-color: var(--lt-border-default);
  }

  .month-label-btn--open {
    background: var(--lt-bg-neutral-subtle);
    border-color: var(--lt-border-default);
  }

  .month-label-btn:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .month-label-btn:focus-visible {
    outline: var(--lt-border-focusRingWidth) solid var(--lt-focus-ring-color);
    outline-offset: var(--lt-border-focusRingOffset);
  }

  .picker-chevron {
    color: var(--lt-text-subtle);
    transition: transform var(--lt-duration-fast) var(--lt-ease-standard);
  }

  .month-label-btn--open .picker-chevron {
    transform: rotate(180deg);
  }

  /* ── Weekday headers ── */

  .weekdays {
    column-gap: 0;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }

  .weekday {
    color: var(--lt-text-muted);
    font-size: 0.75rem;
    font-weight: 500;
    text-align: center;
  }

  /* ── Day grid ── */

  .grid {
    column-gap: 0;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    row-gap: var(--lt-spacing-1);
  }

  [role='row'] {
    display: contents;
  }

  /* ── Week numbers ──
     [role='row']'s display:contents means each row's own children (including this leading cell) become direct
     grid items of .grid/.weekdays, so adding one more column here is all that's needed for it to land first.
     A fixed width, not auto: .weekdays and .grid are two separate grid containers (the header row and the day
     rows), each sizing an auto column purely from its OWN content — "Wk" in one, two-digit week numbers in the
     other — so they silently resolved to different widths and threw every column after the first out of
     alignment between the header and the data rows. A shared fixed length keeps both grids identical. */
  :host([show-week-numbers]) .weekdays,
  :host([show-week-numbers]) .grid {
    grid-template-columns: 2rem repeat(7, 1fr);
  }

  .week-number {
    align-items: center;
    color: var(--lt-text-subtle);
    display: flex;
    font-size: 0.75rem;
    justify-content: center;
  }

  /* One continuous line, not a per-cell border: a border on each .week-number cell only spans that single row's
     own height, so row-gap between rows breaks it into short, disconnected dashes rather than one real line
     running the full height of the header + day grid. .month-grid wraps both so a single absolutely-positioned
     line can span across them as one piece, positioned exactly on the boundary the fixed-width column above
     creates. */
  .month-grid {
    position: relative;
  }

  :host([show-week-numbers]) .month-grid::after {
    background: var(--lt-border-default);
    bottom: 0;
    content: '';
    inset-inline-start: 2rem;
    position: absolute;
    top: 0;
    width: 1px;
  }

  /* Day button — strip layer in range mode */
  .day {
    align-items: center;
    background: transparent;
    border: none;
    color: var(--lt-text-default);
    cursor: pointer;
    display: inline-flex;
    font-family: inherit;
    font-size: 0.8125rem;
    font-weight: 400;
    height: 2.25rem;
    justify-content: center;
    /* A grid item's default min-width is auto (its own min-content size), not 0 — a <button>'s own intrinsic
       minimum can exceed the 1fr share actually available once the week-number column takes its fixed cut of
       the row, forcing .grid to silently overflow wider than .weekdays (whose short single-letter headers never
       hit that floor) and drift every day column out of alignment with its own header. */
    min-width: 0;
    outline: none;
    padding: 0;
    transition: background var(--lt-duration-fast) var(--lt-ease-standard);
    width: 100%;
  }

  /* aria-disabled, not the disabled attribute — a disabled day stays focusable, so keyboard users can arrow
     through it instead of the roving tabindex skipping straight over it (it just can't be selected). */
  .day[aria-disabled='true'] {
    cursor: not-allowed;
  }

  /* Day inner — the visible circle */
  .day__inner {
    align-items: center;
    background: transparent;
    border: 2px solid transparent;
    border-radius: 50%;
    /* Without this, height/width below (--_circle-size) only set the content box, and the 2px border on each
       edge renders the actual circle 4px larger than that — exactly the size the range-strip background below
       is painted at, since it has no border of its own to inflate by. */
    box-sizing: border-box;
    color: inherit;
    display: inline-flex;
    /* .day (its flex parent) can end up narrower than this circle's own fixed size once the week-number column
       takes its own cut of the grid's width — without this, the default flex-shrink:1 compresses only this
       circle's *width* to fit (flex-shrink only ever resizes the main axis), leaving height untouched and
       squishing the circle into an ellipse. A fixed size needs flex-shrink: 0 to actually stay fixed under a
       flex parent. */
    flex-shrink: 0;
    font-size: inherit;
    font-weight: inherit;
    height: var(--_circle-size);
    justify-content: center;
    transition:
      background var(--lt-duration-fast) var(--lt-ease-standard),
      border-color var(--lt-duration-fast) var(--lt-ease-standard),
      color var(--lt-duration-fast) var(--lt-ease-standard);
    width: var(--_circle-size);
  }

  .day:hover:not([aria-disabled='true']) .day__inner {
    background: var(--lt-bg-neutral-subtle);
  }

  .day:focus-visible .day__inner {
    outline: var(--lt-border-focusRingWidth) solid var(--lt-focus-ring-color);
    outline-offset: var(--lt-border-focusRingOffset);
  }

  /* Today ring */
  .day--today .day__inner {
    border-color: var(--lt-border-primary);
    font-weight: 600;
  }

  /* Single-mode selected */
  .day--selected .day__inner {
    background: var(--lt-interactive-primary-bg);
    border-color: transparent;
    color: var(--lt-text-on-primary);
    font-weight: 600;
  }

  .day--selected:hover:not([aria-disabled='true']) .day__inner {
    background: var(--lt-interactive-primary-bg-hover);
  }

  /* Outside days — dimmed by the muted text color alone. They're enabled, clickable buttons, and a 0.5
     opacity on top of muted text took them to ~2:1 (WCAG AA needs 4.5:1). */
  .day--outside {
    color: var(--lt-text-muted);
  }

  /* Empty filler cell */
  .day--empty {
    background: transparent;
    border: none;
    cursor: default;
    pointer-events: none;
  }

  .day[aria-disabled='true'] .day__inner {
    color: var(--lt-text-disabled);
    opacity: 0.4;
  }

  /* ── Range strips (on .day button = strip layer) ──
     Painted at --_circle-size, not .day's own (taller) height, and vertically centered — .day stays tall enough
     for a comfortable click target, but the strip itself should only ever look as tall as the circle it
     connects to. A plain background-color ignores background-size/-position entirely (they only apply to
     background-image), so .day--in-range/.day--in-hover-range express their flat fill as a same-color-stop
     gradient purely to make background-size apply to it too. */

  /* Start: transparent on left, strip on right */
  .day--range-left {
    background: linear-gradient(to right, transparent 50%, var(--lt-bg-primary-subtle) 50%) center / 100%
      var(--_circle-size) no-repeat;
  }

  /* End: strip on left, transparent on right */
  .day--range-right {
    background: linear-gradient(to right, var(--lt-bg-primary-subtle) 50%, transparent 50%) center / 100%
      var(--_circle-size) no-repeat;
  }

  /* Same-day start+end — no strip needed */
  .day--range-left.day--range-right {
    background: transparent;
  }

  /* Days between confirmed endpoints */
  .day--in-range {
    background: linear-gradient(var(--lt-bg-primary-subtle), var(--lt-bg-primary-subtle)) center / 100%
      var(--_circle-size) no-repeat;
  }

  .day--in-range:hover:not([aria-disabled='true']) .day__inner {
    background: var(--lt-bg-neutral-subtle);
  }

  /* Days between hover preview endpoints */
  .day--in-hover-range {
    background: linear-gradient(var(--lt-bg-primary-subtle), var(--lt-bg-primary-subtle)) center / 100%
      var(--_circle-size) no-repeat;
    opacity: 0.45;
  }

  /* Confirmed range endpoint circle */
  .day--range-confirmed .day__inner {
    background: var(--lt-interactive-primary-bg);
    border-color: transparent;
    color: var(--lt-text-on-primary);
    font-weight: 600;
  }

  .day--range-confirmed:hover:not([aria-disabled='true']) .day__inner {
    background: var(--lt-interactive-primary-bg-hover);
  }

  /* Hover preview endpoint circle (semi-transparent) */
  .day--range-hover .day__inner {
    background: var(--lt-interactive-primary-bg);
    border-color: transparent;
    color: var(--lt-text-on-primary);
    opacity: 0.5;
  }

  /* ── Multi-month layout ── */

  /* .calendar-body's single-month fixed width (above) doesn't apply here — let it size to its month-panels
     (one .month-col per visible month) instead of being clamped to one month's worth of width. */
  .calendar--multi .calendar-body {
    width: auto;
  }

  .month-label-row {
    display: flex;
    flex: 1;
    justify-content: space-around;
  }

  .month-label {
    color: var(--lt-text-default);
    font-size: 0.9375rem;
    font-weight: 600;
    letter-spacing: 0.01em;
    text-align: center;
  }

  .month-panels {
    display: flex;
    gap: var(--lt-spacing-4);
  }

  .month-col {
    width: 17.25rem;
  }

  /* ── Month/year picker ── */

  .picker-months {
    display: grid;
    gap: var(--lt-spacing-1);
    grid-template-columns: repeat(3, 1fr);
  }

  .picker-month-btn {
    background: transparent;
    border-radius: var(--lt-border-radius);
    border: 1px solid transparent;
    color: var(--lt-text-default);
    cursor: pointer;
    font-family: inherit;
    font-size: 0.8125rem;
    font-weight: 400;
    padding: var(--lt-spacing-2) 0;
    text-align: center;
    transition:
      background var(--lt-duration-fast) var(--lt-ease-standard),
      border-color var(--lt-duration-fast) var(--lt-ease-standard);
  }

  .picker-month-btn:hover:not(:disabled) {
    background: var(--lt-bg-neutral-subtle);
    border-color: var(--lt-border-default);
  }

  .picker-month-btn--current {
    background: var(--lt-interactive-primary-bg);
    border-color: transparent;
    color: var(--lt-text-on-primary);
    font-weight: 600;
  }

  .picker-month-btn--current:hover:not(:disabled) {
    background: var(--lt-interactive-primary-bg-hover);
  }

  .picker-month-btn:disabled {
    color: var(--lt-text-disabled);
    cursor: not-allowed;
    opacity: 0.5;
  }

  .picker-month-btn:focus-visible {
    outline: var(--lt-border-focusRingWidth) solid var(--lt-focus-ring-color);
    outline-offset: var(--lt-border-focusRingOffset);
  }

  /* ── Footer ── */

  .footer {
    border-top: 1px solid var(--lt-border-subtle);
    display: flex;
    justify-content: flex-end;
    padding-top: var(--lt-spacing-2);
  }

  /* Compact footer action, not a full-width form button — the component default (88px) would look oversized next
     to the day grid. */
  .today-btn {
    --lt-button-min-width: 0;
  }

  /* ── Reduced motion ─────────────────────────────────────────────────────── */

  @media (prefers-reduced-motion: reduce) {
    .month-label-btn,
    .picker-chevron,
    .day,
    .day__inner,
    .picker-month-btn,
    .preset-btn {
      transition: none;
    }
  }
`;
