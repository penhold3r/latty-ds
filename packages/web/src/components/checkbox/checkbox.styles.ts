import { css } from 'lit';

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

  :host([label-position='left']) .checkbox-wrapper {
    flex-direction: row-reverse;
  }

  :host([disabled]) .checkbox-wrapper {
    cursor: not-allowed;
    opacity: 0.6;
  }

  input[type='checkbox'] {
    appearance: none;
    border-radius: calc(var(--lt-border-radius) * 0.5);
    border: 2px solid var(--lt-border-strong);
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
    outline: 3px solid var(--lt-border-focus);
    outline-offset: 2px;
  }

  input[type='checkbox']:disabled {
    cursor: not-allowed;
  }

  .checkmark {
    color: white;
    display: none;
    pointer-events: none;
    position: absolute;
  }

  input[type='checkbox']:checked ~ .checkmark,
  input[type='checkbox']:indeterminate ~ .checkmark {
    display: block;
  }

  .label {
    color: var(--lt-text-default);
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

  /* Variant styles */
  :host([variant='primary']) input[type='checkbox']:checked,
  :host([variant='primary']) input[type='checkbox']:indeterminate {
    background: var(--lt-interactive-primary-bg);
    border-color: var(--lt-interactive-primary-bg);
  }
  :host([variant='primary']) input[type='checkbox']:checked:hover:not(:disabled),
  :host([variant='primary']) input[type='checkbox']:indeterminate:hover:not(:disabled) {
    background: var(--lt-interactive-primary-bg-hover);
    border-color: var(--lt-interactive-primary-bg-hover);
  }

  :host([variant='secondary']) input[type='checkbox']:checked,
  :host([variant='secondary']) input[type='checkbox']:indeterminate {
    background: var(--lt-interactive-secondary-bg);
    border-color: var(--lt-interactive-secondary-bg);
  }
  :host([variant='secondary']) input[type='checkbox']:checked:hover:not(:disabled),
  :host([variant='secondary']) input[type='checkbox']:indeterminate:hover:not(:disabled) {
    background: var(--lt-interactive-secondary-bg-hover);
    border-color: var(--lt-interactive-secondary-bg-hover);
  }

  :host([variant='success']) input[type='checkbox']:checked,
  :host([variant='success']) input[type='checkbox']:indeterminate {
    background: var(--lt-interactive-success-bg);
    border-color: var(--lt-interactive-success-bg);
  }
  :host([variant='success']) input[type='checkbox']:checked:hover:not(:disabled),
  :host([variant='success']) input[type='checkbox']:indeterminate:hover:not(:disabled) {
    background: var(--lt-interactive-success-bg-hover);
    border-color: var(--lt-interactive-success-bg-hover);
  }

  :host([variant='error']) input[type='checkbox']:checked,
  :host([variant='error']) input[type='checkbox']:indeterminate {
    background: var(--lt-interactive-error-bg);
    border-color: var(--lt-interactive-error-bg);
  }
  :host([variant='error']) input[type='checkbox']:checked:hover:not(:disabled),
  :host([variant='error']) input[type='checkbox']:indeterminate:hover:not(:disabled) {
    background: var(--lt-interactive-error-bg-hover);
    border-color: var(--lt-interactive-error-bg-hover);
  }

  :host([variant='info']) input[type='checkbox']:checked,
  :host([variant='info']) input[type='checkbox']:indeterminate {
    background: var(--lt-interactive-info-bg);
    border-color: var(--lt-interactive-info-bg);
  }
  :host([variant='info']) input[type='checkbox']:checked:hover:not(:disabled),
  :host([variant='info']) input[type='checkbox']:indeterminate:hover:not(:disabled) {
    background: var(--lt-interactive-info-bg-hover);
    border-color: var(--lt-interactive-info-bg-hover);
  }
`;
