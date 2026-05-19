import { css } from 'lit';

export const calendarStyles = css`
  :host {
    display: inline-block;
    font-family: 'Hanken Grotesk', sans-serif;
  }

  .calendar {
    background: var(--lt-bg-default);
    border-radius: var(--lt-border-radius);
    border: 1px solid var(--lt-border-default);
    display: flex;
    flex-direction: column;
    gap: var(--lt-spacing-2);
    padding: var(--lt-spacing-3);
  }

  /* ── Header ── */

  .header {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  .month-label {
    color: var(--lt-text-default);
    font-size: 0.9375rem;
    font-weight: 600;
    letter-spacing: 0.01em;
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
    column-gap: var(--lt-spacing-1);
    display: grid;
    grid-template-columns: repeat(7, 2.25rem);
  }

  .weekday {
    color: var(--lt-text-muted);
    font-size: 0.75rem;
    font-weight: 500;
    text-align: center;
  }

  /* ── Day grid ── */

  .grid {
    column-gap: var(--lt-spacing-1);
    display: grid;
    grid-template-columns: repeat(7, 2.25rem);
    row-gap: var(--lt-spacing-1);
  }

  [role='row'] {
    display: contents;
  }

  .day {
    align-items: center;
    background: transparent;
    border-radius: 50%;
    border: 2px solid transparent;
    color: var(--lt-text-default);
    cursor: pointer;
    display: inline-flex;
    font-family: inherit;
    font-size: 0.8125rem;
    font-weight: 400;
    height: 2.25rem;
    justify-content: center;
    line-height: 1;
    padding: 0;
    transition:
      background 100ms ease,
      border-color 100ms ease,
      color 100ms ease;
    width: 2.25rem;
  }

  .day:hover:not(:disabled) {
    background: var(--lt-bg-neutral-subtle);
  }

  .day:focus-visible {
    outline: 2px solid var(--lt-border-focus);
    outline-offset: 1px;
  }

  .day--today {
    border-color: var(--lt-border-primary);
    font-weight: 600;
  }

  .day--selected {
    background: var(--lt-interactive-primary-bg);
    border-color: transparent;
    color: var(--lt-text-on-primary);
    font-weight: 600;
  }

  .day--selected:hover:not(:disabled) {
    background: var(--lt-interactive-primary-bg-hover);
  }

  .day--outside {
    color: var(--lt-text-muted);
    opacity: 0.5;
  }

  .day--empty {
    background: transparent;
    border: none;
    cursor: default;
    pointer-events: none;
  }

  .day:disabled {
    color: var(--lt-text-disabled);
    cursor: not-allowed;
    opacity: 0.4;
  }

  /* ── Footer ── */

  .footer {
    display: flex;
    justify-content: flex-end;
    padding-top: var(--lt-spacing-1);
    border-top: 1px solid var(--lt-border-subtle);
  }

  .today-btn {
    background: transparent;
    border-radius: var(--lt-border-radius);
    border: 1px solid var(--lt-border-default);
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
