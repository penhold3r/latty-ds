import { css } from 'lit';

export const datepickerStyles = css`
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
    display: flex;
    flex-direction: column;
    gap: var(--lt-spacing-1);
  }

  .required-indicator {
    color: var(--lt-color-error-500);
  }

  input {
    background: var(--lt-bg-surface);
    border-radius: var(--lt-border-radius);
    border: var(--lt-border-width, 1px) solid var(--lt-border-default);
    color: var(--lt-text-default);
    font-family: inherit;
    font-size: 0.9375rem;
    outline: none;
    transition:
      border-color 150ms ease,
      box-shadow 150ms ease;
    width: 100%;
    box-sizing: border-box;
  }

  input:focus {
    border-color: var(--lt-border-primary);
    box-shadow: 0 0 0 3px var(--lt-bg-primary-subtle);
  }

  input:disabled {
    background: var(--lt-bg-neutral-subtle);
    color: var(--lt-text-subtle);
    cursor: not-allowed;
  }

  /* Sizes */
  :host([size='sm']) input {
    font-size: 0.8125rem;
    height: 32px;
    padding: 0 var(--lt-spacing-2);
  }
  :host([size='md']) input,
  :host(:not([size])) input {
    font-size: 0.9375rem;
    height: 40px;
    padding: 0 var(--lt-spacing-3);
  }
  :host([size='lg']) input {
    font-size: 1rem;
    height: 48px;
    padding: 0 var(--lt-spacing-4);
  }

  /* Variants */
  :host([variant='success']) input {
    border-color: var(--lt-color-success-500);
  }
  :host([variant='success']) input:focus {
    box-shadow: 0 0 0 3px var(--lt-bg-success-subtle);
  }
  :host([variant='warning']) input {
    border-color: var(--lt-color-warning-500);
  }
  :host([variant='warning']) input:focus {
    box-shadow: 0 0 0 3px var(--lt-bg-warning-subtle);
  }
  :host([variant='error']) input {
    border-color: var(--lt-color-error-500);
  }
  :host([variant='error']) input:focus {
    box-shadow: 0 0 0 3px var(--lt-bg-error-subtle);
  }

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
