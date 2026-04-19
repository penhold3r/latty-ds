import { css } from 'lit';

/**
 * Styles for the lt-radio component.
 *
 * Includes:
 * - Base radio styling with circular appearance
 * - Size variants (sm, md, lg)
 * - Visual variants (primary, secondary, success, error, info)
 * - Checked and disabled states
 * - Focus states for accessibility
 */
export const radioStyles = css`
  :host {
    display: inline-block;
    font-family: 'Asap', sans-serif;
  }

  .radio-wrapper {
    align-items: center;
    cursor: pointer;
    display: inline-flex;
    gap: var(--lt-spacing-2);
  }

  .radio-container {
    position: relative;
  }

  :host([disabled]) .radio-wrapper {
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Hide native radio */
  input[type='radio'] {
    appearance: none;
    border-radius: 50%;
    border: 2px solid var(--lt-color-neutral-400);
    cursor: pointer;
    flex-shrink: 0;
    margin: 0;
    position: relative;
    transition:
      background-color 120ms ease,
      border-color 120ms ease;
  }

  input[type='radio']:hover:not(:disabled) {
    border-color: var(--lt-color-neutral-600);
  }

  input[type='radio']:focus-visible {
    outline: 3px solid var(--lt-color-primary-200);
    outline-offset: 2px;
  }

  input[type='radio']:disabled {
    cursor: not-allowed;
  }

  /* Inner dot */
  .dot {
    background: white;
    border-radius: 50%;
    display: none;
    pointer-events: none;
    position: absolute;
  }

  input[type='radio']:checked ~ .dot {
    display: block;
  }

  /* Label */
  .label {
    color: var(--lt-color-neutral-900);
    user-select: none;
  }

  /* Size variants */
  :host([size='sm']) input[type='radio'] {
    height: 16px;
    width: 16px;
  }

  :host([size='sm']) .dot {
    height: 8px;
    width: 8px;
    left: 4px;
    top: 4px;
  }

  :host([size='sm']) .label {
    font-size: 0.875rem;
  }

  :host([size='md']) input[type='radio'] {
    height: 20px;
    width: 20px;
  }

  :host([size='md']) .dot {
    height: 10px;
    width: 10px;
    left: 5px;
    top: 5px;
  }

  :host([size='md']) .label {
    font-size: 1rem;
  }

  :host([size='lg']) input[type='radio'] {
    height: 24px;
    width: 24px;
  }

  :host([size='lg']) .dot {
    height: 12px;
    width: 12px;
    left: 6px;
    top: 6px;
  }

  :host([size='lg']) .label {
    font-size: 1.0625rem;
  }

  /* Variant styles - Primary */
  :host([variant='primary']) input[type='radio']:checked {
    background: var(--lt-color-primary-500);
    border-color: var(--lt-color-primary-500);
  }

  :host([variant='primary']) input[type='radio']:checked:hover:not(:disabled) {
    background: var(--lt-color-primary-700);
    border-color: var(--lt-color-primary-700);
  }

  /* Variant styles - Secondary */
  :host([variant='secondary']) input[type='radio']:checked {
    background: var(--lt-color-secondary-500);
    border-color: var(--lt-color-secondary-500);
  }

  :host([variant='secondary']) input[type='radio']:checked:hover:not(:disabled) {
    background: var(--lt-color-secondary-700);
    border-color: var(--lt-color-secondary-700);
  }

  /* Variant styles - Success */
  :host([variant='success']) input[type='radio']:checked {
    background: var(--lt-color-success-500);
    border-color: var(--lt-color-success-500);
  }

  :host([variant='success']) input[type='radio']:checked:hover:not(:disabled) {
    background: var(--lt-color-success-700);
    border-color: var(--lt-color-success-700);
  }

  /* Variant styles - Error */
  :host([variant='error']) input[type='radio']:checked {
    background: var(--lt-color-error-500);
    border-color: var(--lt-color-error-500);
  }

  :host([variant='error']) input[type='radio']:checked:hover:not(:disabled) {
    background: var(--lt-color-error-700);
    border-color: var(--lt-color-error-700);
  }

  /* Variant styles - Info */
  :host([variant='info']) input[type='radio']:checked {
    background: var(--lt-color-info-500);
    border-color: var(--lt-color-info-500);
  }

  :host([variant='info']) input[type='radio']:checked:hover:not(:disabled) {
    background: var(--lt-color-info-700);
    border-color: var(--lt-color-info-700);
  }
`;
