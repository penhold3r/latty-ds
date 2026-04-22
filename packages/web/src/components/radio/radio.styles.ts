import { css } from 'lit';

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

  input[type='radio'] {
    appearance: none;
    border-radius: 50%;
    border: 2px solid var(--lt-border-strong);
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
    outline: 3px solid var(--lt-border-focus);
    outline-offset: 2px;
  }

  input[type='radio']:disabled {
    cursor: not-allowed;
  }

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

  .label {
    color: var(--lt-text-default);
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

  /* Variant styles */
  :host([variant='primary']) input[type='radio']:checked {
    background: var(--lt-interactive-primary-bg);
    border-color: var(--lt-interactive-primary-bg);
  }
  :host([variant='primary']) input[type='radio']:checked:hover:not(:disabled) {
    background: var(--lt-interactive-primary-bg-hover);
    border-color: var(--lt-interactive-primary-bg-hover);
  }

  :host([variant='secondary']) input[type='radio']:checked {
    background: var(--lt-interactive-secondary-bg);
    border-color: var(--lt-interactive-secondary-bg);
  }
  :host([variant='secondary']) input[type='radio']:checked:hover:not(:disabled) {
    background: var(--lt-interactive-secondary-bg-hover);
    border-color: var(--lt-interactive-secondary-bg-hover);
  }

  :host([variant='success']) input[type='radio']:checked {
    background: var(--lt-interactive-success-bg);
    border-color: var(--lt-interactive-success-bg);
  }
  :host([variant='success']) input[type='radio']:checked:hover:not(:disabled) {
    background: var(--lt-interactive-success-bg-hover);
    border-color: var(--lt-interactive-success-bg-hover);
  }

  :host([variant='error']) input[type='radio']:checked {
    background: var(--lt-interactive-error-bg);
    border-color: var(--lt-interactive-error-bg);
  }
  :host([variant='error']) input[type='radio']:checked:hover:not(:disabled) {
    background: var(--lt-interactive-error-bg-hover);
    border-color: var(--lt-interactive-error-bg-hover);
  }

  :host([variant='info']) input[type='radio']:checked {
    background: var(--lt-interactive-info-bg);
    border-color: var(--lt-interactive-info-bg);
  }
  :host([variant='info']) input[type='radio']:checked:hover:not(:disabled) {
    background: var(--lt-interactive-info-bg-hover);
    border-color: var(--lt-interactive-info-bg-hover);
  }
`;
