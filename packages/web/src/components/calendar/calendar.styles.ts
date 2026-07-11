import { css } from 'lit';

export const calendarStyles = css`
  :host {
    display: inline-block;
    font-family: 'Hanken Grotesk', sans-serif;
  }

  .calendar {
    background: var(--lt-bg-default);
    border-radius: var(--lt-border-radius);
    border: var(--lt-border-width, 1px) solid var(--lt-border-default);
    display: flex;
    flex-direction: column;
    gap: var(--lt-spacing-2);
    padding: var(--lt-spacing-3);
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
      background 120ms ease,
      border-color 120ms ease;
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

  .picker-chevron {
    color: var(--lt-text-subtle);
    transition: transform 150ms ease;
  }

  .month-label-btn--open .picker-chevron {
    transform: rotate(180deg);
  }

  .nav-btn {
    align-items: center;
    background: transparent;
    border-radius: var(--lt-border-radius);
    border: 1px solid transparent;
    color: var(--lt-text-subtle);
    cursor: pointer;
    display: inline-flex;
    height: 2rem;
    justify-content: center;
    padding: 0;
    transition:
      background 120ms ease,
      border-color 120ms ease,
      color 120ms ease;
    width: 2rem;
  }

  .nav-btn:hover:not(:disabled) {
    background: var(--lt-bg-neutral-subtle);
    border-color: var(--lt-border-default);
    color: var(--lt-text-default);
  }

  .nav-btn:disabled {
    color: var(--lt-text-disabled);
    cursor: not-allowed;
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
    outline: none;
    padding: 0;
    transition: background 100ms ease;
    width: 100%;
  }

  .day:disabled {
    cursor: not-allowed;
  }

  /* Day inner — the visible circle */
  .day__inner {
    align-items: center;
    background: transparent;
    border: 2px solid transparent;
    border-radius: 50%;
    color: inherit;
    display: inline-flex;
    font-size: inherit;
    font-weight: inherit;
    height: 2.25rem;
    justify-content: center;
    transition:
      background 100ms ease,
      border-color 100ms ease,
      color 100ms ease;
    width: 2.25rem;
  }

  .day:hover:not(:disabled) .day__inner {
    background: var(--lt-bg-neutral-subtle);
  }

  .day:focus-visible .day__inner {
    outline: 2px solid var(--lt-border-focus);
    outline-offset: 1px;
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

  .day--selected:hover:not(:disabled) .day__inner {
    background: var(--lt-interactive-primary-bg-hover);
  }

  /* Outside days */
  .day--outside {
    color: var(--lt-text-muted);
    opacity: 0.5;
  }

  /* Empty filler cell */
  .day--empty {
    background: transparent;
    border: none;
    cursor: default;
    pointer-events: none;
  }

  .day:disabled .day__inner {
    color: var(--lt-text-disabled);
    opacity: 0.4;
  }

  /* ── Range strips (on .day button = strip layer) ── */

  /* Start: transparent on left, strip on right */
  .day--range-left {
    background: linear-gradient(to right, transparent 50%, var(--lt-bg-primary-subtle) 50%);
  }

  /* End: strip on left, transparent on right */
  .day--range-right {
    background: linear-gradient(to right, var(--lt-bg-primary-subtle) 50%, transparent 50%);
  }

  /* Same-day start+end — no strip needed */
  .day--range-left.day--range-right {
    background: transparent;
  }

  /* Days between confirmed endpoints */
  .day--in-range {
    background: var(--lt-bg-primary-subtle);
  }

  .day--in-range:hover:not(:disabled) .day__inner {
    background: var(--lt-bg-neutral-subtle);
  }

  /* Days between hover preview endpoints */
  .day--in-hover-range {
    background: var(--lt-bg-primary-subtle);
    opacity: 0.45;
  }

  /* Confirmed range endpoint circle */
  .day--range-confirmed .day__inner {
    background: var(--lt-interactive-primary-bg);
    border-color: transparent;
    color: var(--lt-text-on-primary);
    font-weight: 600;
  }

  .day--range-confirmed:hover:not(:disabled) .day__inner {
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

  .calendar--multi {
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
      background 100ms ease,
      border-color 100ms ease;
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

  /* ── Footer ── */

  .footer {
    border-top: 1px solid var(--lt-border-subtle);
    display: flex;
    justify-content: flex-end;
    padding-top: var(--lt-spacing-1);
  }

  .today-btn {
    background: transparent;
    border-radius: var(--lt-border-radius);
    border: var(--lt-border-width, 1px) solid var(--lt-border-default);
    color: var(--lt-text-subtle);
    cursor: pointer;
    font-family: inherit;
    font-size: 0.75rem;
    font-weight: 500;
    padding: var(--lt-spacing-1) var(--lt-spacing-2);
    transition:
      background 120ms ease,
      border-color 120ms ease,
      color 120ms ease;
  }

  .today-btn:hover:not(:disabled) {
    background: var(--lt-bg-neutral-subtle);
    border-color: var(--lt-border-strong);
    color: var(--lt-text-default);
  }

  .today-btn:disabled {
    color: var(--lt-text-disabled);
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
