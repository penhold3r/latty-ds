import { css } from 'lit';

/**
 * Styles for the lt-checkbox component.
 *
 * Includes:
 * - Base checkbox styling with custom appearance
 * - Size variants (sm, md, lg)
 * - Visual variants (primary, secondary, success, error, info)
 * - Checked, indeterminate, and disabled states
 * - Focus states for accessibility
 */
export const checkboxStyles = css`
  :host {
    display: inline-block;
    font-family: 'Asap', sans-serif;
  }

  .checkbox-wrapper {
    align-items: center;
    cursor: pointer;
    display: inline-flex;
    gap: var(--lt-spacing-2);
    position: relative;
  }

  :host([disabled]) .checkbox-wrapper {
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Hide native checkbox */
  input[type='checkbox'] {
    appearance: none;
    border-radius: calc(var(--lt-border-radius) * 0.5);
    border: 2px solid var(--lt-color-neutral-400);
    cursor: pointer;
    flex-shrink: 0;
    margin: 0;
    position: relative;
    transition:
      background-color 120ms ease,
      border-color 120ms ease;
  }

  input[type='checkbox']:hover:not(:disabled) {
    border-color: var(--lt-color-neutral-600);
  }

  input[type='checkbox']:focus-visible {
    outline: 3px solid var(--lt-color-primary-200);
    outline-offset: 2px;
  }

  input[type='checkbox']:disabled {
    cursor: not-allowed;
  }

  /* Checkmark SVG icon */
  .checkmark {
    display: none;
    pointer-events: none;
    position: absolute;
  }

  input[type='checkbox']:checked ~ .checkmark,
  input[type='checkbox']:indeterminate ~ .checkmark {
    display: block;
  }

  /* Label */
  .label {
    color: var(--lt-color-neutral-900);
    user-select: none;
  }

  /* Size variants */
  :host([size='sm']) input[type='checkbox'] {
    height: 16px;
    width: 16px;
  }

  :host([size='sm']) .checkmark {
    height: 16px;
    width: 16px;
    left: 0;
    top: 0;
  }

  :host([size='sm']) .label {
    font-size: 0.875rem;
  }

  :host([size='md']) input[type='checkbox'] {
    height: 20px;
    width: 20px;
  }

  :host([size='md']) .checkmark {
    height: 20px;
    width: 20px;
    left: 0;
    top: 0;
  }

  :host([size='md']) .label {
    font-size: 1rem;
  }

  :host([size='lg']) input[type='checkbox'] {
    height: 24px;
    width: 24px;
  }

  :host([size='lg']) .checkmark {
    height: 24px;
    width: 24px;
    left: 0;
    top: 0;
  }

  :host([size='lg']) .label {
    font-size: 1.0625rem;
  }

  /* Variant styles - Primary */
  :host([variant='primary']) input[type='checkbox']:checked,
  :host([variant='primary']) input[type='checkbox']:indeterminate {
    background: var(--lt-color-primary-500);
    border-color: var(--lt-color-primary-500);
  }

  :host([variant='primary']) input[type='checkbox']:checked:hover:not(:disabled),
  :host([variant='primary']) input[type='checkbox']:indeterminate:hover:not(:disabled) {
    background: var(--lt-color-primary-700);
    border-color: var(--lt-color-primary-700);
  }

  /* Variant styles - Secondary */
  :host([variant='secondary']) input[type='checkbox']:checked,
  :host([variant='secondary']) input[type='checkbox']:indeterminate {
    background: var(--lt-color-secondary-500);
    border-color: var(--lt-color-secondary-500);
  }

  :host([variant='secondary']) input[type='checkbox']:checked:hover:not(:disabled),
  :host([variant='secondary']) input[type='checkbox']:indeterminate:hover:not(:disabled) {
    background: var(--lt-color-secondary-700);
    border-color: var(--lt-color-secondary-700);
  }

  /* Variant styles - Success */
  :host([variant='success']) input[type='checkbox']:checked,
  :host([variant='success']) input[type='checkbox']:indeterminate {
    background: var(--lt-color-success-500);
    border-color: var(--lt-color-success-500);
  }

  :host([variant='success']) input[type='checkbox']:checked:hover:not(:disabled),
  :host([variant='success']) input[type='checkbox']:indeterminate:hover:not(:disabled) {
    background: var(--lt-color-success-700);
    border-color: var(--lt-color-success-700);
  }

  /* Variant styles - Error */
  :host([variant='error']) input[type='checkbox']:checked,
  :host([variant='error']) input[type='checkbox']:indeterminate {
    background: var(--lt-color-error-500);
    border-color: var(--lt-color-error-500);
  }

  :host([variant='error']) input[type='checkbox']:checked:hover:not(:disabled),
  :host([variant='error']) input[type='checkbox']:indeterminate:hover:not(:disabled) {
    background: var(--lt-color-error-700);
    border-color: var(--lt-color-error-700);
  }

  /* Variant styles - Info */
  :host([variant='info']) input[type='checkbox']:checked,
  :host([variant='info']) input[type='checkbox']:indeterminate {
    background: var(--lt-color-info-500);
    border-color: var(--lt-color-info-500);
  }

  :host([variant='info']) input[type='checkbox']:checked:hover:not(:disabled),
  :host([variant='info']) input[type='checkbox']:indeterminate:hover:not(:disabled) {
    background: var(--lt-color-info-700);
    border-color: var(--lt-color-info-700);
  }
`;
