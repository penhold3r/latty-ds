import { css } from 'lit';

/**
 * Styles for the lt-textfield component.
 *
 * Includes:
 * - Base input styling with design tokens
 * - Size variants (sm, md, lg)
 * - Visual variants (default, success, warning, error)
 * - Icon positioning and styling (start icon, end icon)
 * - Password toggle and variant icon states
 * - Helper text styling
 * - Accessibility states (disabled, readonly, focus)
 */
export const textfieldStyles = css`
  :host {
    display: inline-block;
    font-family: 'Asap', sans-serif;
    width: 100%;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--lt-spacing-1);
    width: 100%;
  }

  label {
    color: var(--lt-color-neutral-700);
    font-size: 0.875rem;
    font-weight: 500;
  }

  .input-container {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    gap: var(--lt-spacing-2);
  }

  .icon-start,
  .icon-end {
    color: var(--lt-color-neutral-500);
    flex-shrink: 0;
    position: absolute;
    pointer-events: none;
  }

  .icon-start {
    left: var(--lt-spacing-3);
  }

  .icon-end {
    right: var(--lt-spacing-3);
  }

  .password-toggle {
    pointer-events: auto;
    cursor: pointer;
    transition: color 120ms ease;
  }

  .password-toggle:hover {
    color: var(--lt-color-neutral-700);
  }

  .variant-icon {
    pointer-events: none;
  }

  :host([variant='success']) .variant-icon {
    color: var(--lt-color-success-500);
  }

  :host([variant='warning']) .variant-icon {
    color: var(--lt-color-warning-500);
  }

  :host([variant='error']) .variant-icon {
    color: var(--lt-color-error-500);
  }

  input,
  textarea {
    background: var(--lt-color-neutral-50);
    border-radius: var(--lt-border-radius);
    border: 1px solid var(--lt-color-neutral-300);
    box-sizing: border-box;
    color: var(--lt-color-neutral-900);
    font-family: inherit;
    font-weight: 400;
    transition:
      border-color 120ms ease,
      box-shadow 120ms ease;
    width: 100%;
  }

  textarea {
    min-height: 80px;
    padding-block: var(--lt-spacing-3);
    resize: vertical;
  }

  input::placeholder,
  textarea::placeholder {
    color: var(--lt-color-neutral-400);
  }

  input:hover:not(:disabled),
  textarea:hover:not(:disabled) {
    border-color: var(--lt-color-neutral-400);
  }

  input:focus,
  textarea:focus {
    border-color: var(--lt-color-primary-500);
    box-shadow: 0 0 0 3px var(--lt-color-primary-100);
    outline: none;
  }

  input:disabled,
  textarea:disabled {
    background: var(--lt-color-neutral-100);
    color: var(--lt-color-neutral-500);
    cursor: not-allowed;
  }

  /* sizes */
  :host([size='sm']) input,
  :host([size='sm']) textarea {
    font-size: 0.875rem;
    height: 32px;
    padding-inline: var(--lt-spacing-3);
  }

  :host([size='sm']) input.has-start-icon,
  :host([size='sm']) textarea.has-start-icon {
    padding-left: calc(var(--lt-spacing-3) + 20px + var(--lt-spacing-2));
  }

  :host([size='sm']) input.has-end-icon,
  :host([size='sm']) textarea.has-end-icon {
    padding-right: calc(var(--lt-spacing-3) + 20px + var(--lt-spacing-2));
  }

  :host([size='md']) input,
  :host([size='md']) textarea {
    font-size: 1rem;
    height: 40px;
    padding-inline: var(--lt-spacing-4);
  }

  :host([size='md']) input.has-start-icon,
  :host([size='md']) textarea.has-start-icon {
    padding-left: calc(var(--lt-spacing-4) + 20px + var(--lt-spacing-2));
  }

  :host([size='md']) input.has-end-icon,
  :host([size='md']) textarea.has-end-icon {
    padding-right: calc(var(--lt-spacing-4) + 20px + var(--lt-spacing-2));
  }

  :host([size='lg']) input,
  :host([size='lg']) textarea {
    font-size: 1.0625rem;
    height: 48px;
    padding-inline: var(--lt-spacing-5);
  }

  :host([size='lg']) input.has-start-icon,
  :host([size='lg']) textarea.has-start-icon {
    padding-left: calc(var(--lt-spacing-5) + 24px + var(--lt-spacing-2));
  }

  :host([size='lg']) input.has-end-icon,
  :host([size='lg']) textarea.has-end-icon {
    padding-right: calc(var(--lt-spacing-5) + 24px + var(--lt-spacing-2));
  }

  :host([size='lg']) .icon-start,
  :host([size='lg']) .icon-end {
    width: 24px;
    height: 24px;
  }

  /* variants */
  :host([variant='success']) input,
  :host([variant='success']) textarea {
    border-color: var(--lt-color-success-500);
  }

  :host([variant='success']) input:focus,
  :host([variant='success']) textarea:focus {
    border-color: var(--lt-color-success-600);
    box-shadow: 0 0 0 3px var(--lt-color-success-100);
  }

  :host([variant='warning']) input,
  :host([variant='warning']) textarea {
    border-color: var(--lt-color-warning-500);
  }

  :host([variant='warning']) input:focus,
  :host([variant='warning']) textarea:focus {
    border-color: var(--lt-color-warning-600);
    box-shadow: 0 0 0 3px var(--lt-color-warning-100);
  }

  :host([variant='error']) input,
  :host([variant='error']) textarea {
    border-color: var(--lt-color-error-500);
  }

  :host([variant='error']) input:focus,
  :host([variant='error']) textarea:focus {
    border-color: var(--lt-color-error-600);
    box-shadow: 0 0 0 3px var(--lt-color-error-100);
  }

  .helper-text {
    color: var(--lt-color-neutral-600);
    font-size: 0.75rem;
  }

  :host([variant='success']) .helper-text {
    color: var(--lt-color-success-700);
  }

  :host([variant='warning']) .helper-text {
    color: var(--lt-color-warning-700);
  }

  :host([variant='error']) .helper-text {
    color: var(--lt-color-error-700);
  }

  .required-indicator {
    color: var(--lt-color-error-500);
  }
`;
