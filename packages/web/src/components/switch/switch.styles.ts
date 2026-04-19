import { css } from 'lit';

/**
 * Styles for the lt-switch component.
 *
 * Includes:
 * - Toggle switch styling with track and thumb
 * - Size variants (sm, md, lg)
 * - Visual variants (primary, secondary, success, error, info)
 * - Checked and disabled states
 * - Smooth sliding animation
 * - Focus states for accessibility
 */
export const switchStyles = css`
  :host {
    display: inline-block;
    font-family: 'Asap', sans-serif;
  }

  .switch-wrapper {
    align-items: center;
    cursor: pointer;
    display: inline-flex;
    gap: var(--lt-spacing-2);
  }

  :host([disabled]) .switch-wrapper {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .switch-container {
    position: relative;
  }

  /* Hide native checkbox */
  input[type='checkbox'] {
    appearance: none;
    background: var(--lt-color-neutral-300);
    border-radius: 999px;
    cursor: pointer;
    flex-shrink: 0;
    margin: 0;
    position: relative;
    transition: background-color 200ms ease;
  }

  input[type='checkbox']:hover:not(:disabled) {
    background: var(--lt-color-neutral-400);
  }

  input[type='checkbox']:focus-visible {
    outline: 3px solid var(--lt-color-primary-200);
    outline-offset: 2px;
  }

  input[type='checkbox']:disabled {
    cursor: not-allowed;
  }

  /* Thumb (sliding knob) */
  .thumb {
    background: white;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    pointer-events: none;
    position: absolute;
    transition: left 200ms ease;
  }

  /* Label */
  .label {
    color: var(--lt-color-neutral-900);
    user-select: none;
  }

  /* Size variants */
  :host([size='sm']) input[type='checkbox'] {
    height: 18px;
    width: 32px;
  }

  :host([size='sm']) .thumb {
    height: 14px;
    width: 14px;
    left: 2px;
    top: 2px;
  }

  :host([size='sm']) input[type='checkbox']:checked ~ .thumb {
    left: 16px;
  }

  :host([size='sm']) .label {
    font-size: 0.875rem;
  }

  :host([size='md']) input[type='checkbox'] {
    height: 22px;
    width: 40px;
  }

  :host([size='md']) .thumb {
    height: 18px;
    width: 18px;
    left: 2px;
    top: 2px;
  }

  :host([size='md']) input[type='checkbox']:checked ~ .thumb {
    left: 20px;
  }

  :host([size='md']) .label {
    font-size: 1rem;
  }

  :host([size='lg']) input[type='checkbox'] {
    height: 26px;
    width: 48px;
  }

  :host([size='lg']) .thumb {
    height: 22px;
    width: 22px;
    left: 2px;
    top: 2px;
  }

  :host([size='lg']) input[type='checkbox']:checked ~ .thumb {
    left: 24px;
  }

  :host([size='lg']) .label {
    font-size: 1.0625rem;
  }

  /* Variant styles - Primary */
  :host([variant='primary']) input[type='checkbox']:checked {
    background: var(--lt-color-primary-500);
  }

  :host([variant='primary']) input[type='checkbox']:checked:hover:not(:disabled) {
    background: var(--lt-color-primary-700);
  }

  /* Variant styles - Secondary */
  :host([variant='secondary']) input[type='checkbox']:checked {
    background: var(--lt-color-secondary-500);
  }

  :host([variant='secondary']) input[type='checkbox']:checked:hover:not(:disabled) {
    background: var(--lt-color-secondary-700);
  }

  /* Variant styles - Success */
  :host([variant='success']) input[type='checkbox']:checked {
    background: var(--lt-color-success-500);
  }

  :host([variant='success']) input[type='checkbox']:checked:hover:not(:disabled) {
    background: var(--lt-color-success-700);
  }

  /* Variant styles - Error */
  :host([variant='error']) input[type='checkbox']:checked {
    background: var(--lt-color-error-500);
  }

  :host([variant='error']) input[type='checkbox']:checked:hover:not(:disabled) {
    background: var(--lt-color-error-700);
  }

  /* Variant styles - Info */
  :host([variant='info']) input[type='checkbox']:checked {
    background: var(--lt-color-info-500);
  }

  :host([variant='info']) input[type='checkbox']:checked:hover:not(:disabled) {
    background: var(--lt-color-info-700);
  }
`;
