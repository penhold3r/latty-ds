import { css } from 'lit';

export const selectStyles = css`
  :host {
    display: inline-block;
    font-family: 'Asap', sans-serif;
    position: relative;
    width: 100%;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--lt-spacing-2);
  }

  label {
    color: var(--lt-color-neutral-700);
    font-size: 0.875rem;
    font-weight: 500;
  }

  .required-indicator {
    color: var(--lt-color-error-500);
    margin-left: var(--lt-spacing-1);
  }

  .select-container {
    position: relative;
    width: 100%;
  }

  .select-trigger {
    align-items: center;
    background: var(--lt-bg-subtle);
    border-radius: var(--lt-border-radius);
    border: 1px solid var(--lt-color-neutral-300);
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    font-family: inherit;
    justify-content: space-between;
    transition:
      border-color 120ms ease,
      box-shadow 120ms ease;
    width: 100%;
  }

  .select-trigger:hover:not([aria-disabled='true']) {
    border-color: var(--lt-border-strong);
  }

  .select-trigger:focus-visible {
    border-color: var(--lt-interactive-primary-bg);
    box-shadow: 0 0 0 3px var(--lt-border-focus);
    outline: none;
  }

  .select-trigger[aria-disabled='true'] {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .select-value {
    color: var(--lt-text-default);
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .select-value.placeholder {
    color: var(--lt-text-muted);
  }

  .icon-end {
    color: var(--lt-text-subtle);
    flex-shrink: 0;
    transition: transform 120ms ease;
  }

  :host([open]) .icon-end {
    transform: rotate(180deg);
  }

  .dropdown {
    display: none;
    margin-top: var(--lt-spacing-1);
    max-height: 300px;
    position: absolute;
    width: 100%;
    z-index: 1000;
  }

  :host([open]) .dropdown {
    animation: slideDown 150ms ease;
    display: block;
  }

  .options-container {
    max-height: 300px;
    overflow: hidden auto;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .option {
    align-items: center;
    background: transparent;
    border: none;
    border-radius: var(--lt-border-radius);
    box-sizing: border-box;
    color: var(--lt-text-default);
    cursor: pointer;
    display: flex;
    font-family: inherit;
    text-align: left;
    transition: background-color 80ms ease;
    width: 100%;
  }

  .option:hover:not([disabled]) {
    background: var(--lt-bg-surface);
  }

  .option:focus-visible {
    background: var(--lt-bg-surface);
    outline: 2px solid var(--lt-interactive-primary-bg);
    outline-offset: -2px;
  }

  .option[aria-selected='true'] {
    background: var(--lt-bg-primary-subtle);
    color: var(--lt-text-primary);
    font-weight: 500;
  }

  .option[disabled] {
    color: var(--lt-text-muted);
    cursor: not-allowed;
    opacity: 0.6;
  }

  .helper-text {
    font-size: 0.75rem;
  }

  /* Size variants */
  :host([size='sm']) .select-trigger {
    font-size: 0.875rem;
    height: 32px;
    padding: 0 var(--lt-spacing-3);
  }

  :host([size='sm']) .option {
    font-size: 0.875rem;
    padding: var(--lt-spacing-2) var(--lt-spacing-3);
  }

  :host([size='md']) .select-trigger {
    font-size: 1rem;
    height: 40px;
    padding: 0 var(--lt-spacing-4);
  }

  :host([size='md']) .option {
    font-size: 1rem;
    padding: var(--lt-spacing-3) var(--lt-spacing-4);
  }

  :host([size='lg']) .select-trigger {
    font-size: 1.0625rem;
    height: 48px;
    padding: 0 var(--lt-spacing-5);
  }

  :host([size='lg']) .option {
    font-size: 1.0625rem;
    padding: var(--lt-spacing-4) var(--lt-spacing-5);
  }

  /* Variant styles */
  :host([variant='success']) .select-trigger {
    border-color: var(--lt-border-success-strong);
  }

  :host([variant='success']) .helper-text {
    color: var(--lt-text-success);
  }

  :host([variant='warning']) .select-trigger {
    border-color: var(--lt-border-warning-strong);
  }

  :host([variant='warning']) .helper-text {
    color: var(--lt-text-warning);
  }

  :host([variant='error']) .select-trigger {
    border-color: var(--lt-border-error-strong);
  }

  :host([variant='error']) .helper-text {
    color: var(--lt-text-error);
  }

  :host([variant='default']) .helper-text {
    color: var(--lt-text-subtle);
  }
`;
