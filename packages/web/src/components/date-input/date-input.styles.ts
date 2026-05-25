import { css } from 'lit';

export const dateInputStyles = css`
  :host {
    display: block;
    font-family: 'Hanken Grotesk', sans-serif;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--lt-spacing-1);
  }

  label {
    color: var(--lt-text-default);
    cursor: default;
  }

  .required-indicator {
    color: var(--lt-color-error-500);
    margin-left: 2px;
  }

  /* ── Field ── */

  .field {
    position: relative;
  }

  .field-btn {
    align-items: center;
    background: var(--lt-bg-surface);
    border-radius: var(--lt-border-radius);
    border: 1px solid var(--lt-border-default);
    color: var(--lt-text-default);
    cursor: pointer;
    display: flex;
    font-family: inherit;
    justify-content: space-between;
    outline: none;
    text-align: left;
    transition:
      border-color 150ms ease,
      box-shadow 150ms ease;
    width: 100%;
  }

  .field-btn:focus-visible {
    border-color: var(--lt-border-primary);
    box-shadow: 0 0 0 3px var(--lt-bg-primary-subtle);
  }

  .field-btn:disabled {
    background: var(--lt-bg-neutral-subtle);
    color: var(--lt-text-subtle);
    cursor: not-allowed;
  }

  .display-value {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .display-value--placeholder {
    color: var(--lt-text-muted);
  }

  .calendar-icon {
    color: var(--lt-text-subtle);
    flex-shrink: 0;
    line-height: 0;
    margin-left: var(--lt-spacing-2);
  }

  /* ── Sizes ── */

  :host([size='sm']) .field-btn {
    font-size: 0.8125rem;
    height: 32px;
    padding: 0 var(--lt-spacing-2);
  }

  :host([size='md']) .field-btn,
  :host(:not([size])) .field-btn {
    font-size: 0.9375rem;
    height: 40px;
    padding: 0 var(--lt-spacing-3);
  }

  :host([size='lg']) .field-btn {
    font-size: 1rem;
    height: 48px;
    padding: 0 var(--lt-spacing-4);
  }

  /* ── Variants ── */

  :host([variant='success']) .field-btn {
    border-color: var(--lt-color-success-500);
  }

  :host([variant='success']) .field-btn:focus-visible {
    box-shadow: 0 0 0 3px var(--lt-bg-success-subtle);
  }

  :host([variant='warning']) .field-btn {
    border-color: var(--lt-color-warning-500);
  }

  :host([variant='warning']) .field-btn:focus-visible {
    box-shadow: 0 0 0 3px var(--lt-bg-warning-subtle);
  }

  :host([variant='error']) .field-btn {
    border-color: var(--lt-color-error-500);
  }

  :host([variant='error']) .field-btn:focus-visible {
    box-shadow: 0 0 0 3px var(--lt-bg-error-subtle);
  }

  /* ── Dropdown ── */

  .dropdown {
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08));
    left: var(--_dropdown-left, 0px);
    position: fixed;
    top: var(--_dropdown-top, 0px);
    z-index: 9999;
  }

  /* ── Helper text ── */

  .helper-text {
    color: var(--lt-text-subtle);
    font-size: 0.8125rem;
  }

  :host([variant='error']) .helper-text {
    color: var(--lt-color-error-600);
  }

  :host([variant='success']) .helper-text {
    color: var(--lt-color-success-600);
  }

  :host([variant='warning']) .helper-text {
    color: var(--lt-color-warning-700);
  }
`;
