import { css } from 'lit';

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
    background: var(--lt-border-strong);
  }

  input[type='checkbox']:focus-visible {
    outline: 3px solid var(--lt-border-focus);
    outline-offset: 2px;
  }

  input[type='checkbox']:disabled {
    cursor: not-allowed;
  }

  .thumb {
    background: white;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    pointer-events: none;
    position: absolute;
    transition: left 200ms ease;
  }

  .label {
    color: var(--lt-text-default);
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

  /* Variant styles */
  :host([variant='primary']) input[type='checkbox']:checked {
    background: var(--lt-interactive-primary-bg);
  }
  :host([variant='primary']) input[type='checkbox']:checked:hover:not(:disabled) {
    background: var(--lt-interactive-primary-bg-hover);
  }

  :host([variant='secondary']) input[type='checkbox']:checked {
    background: var(--lt-interactive-secondary-bg);
  }
  :host([variant='secondary']) input[type='checkbox']:checked:hover:not(:disabled) {
    background: var(--lt-interactive-secondary-bg-hover);
  }

  :host([variant='success']) input[type='checkbox']:checked {
    background: var(--lt-interactive-success-bg);
  }
  :host([variant='success']) input[type='checkbox']:checked:hover:not(:disabled) {
    background: var(--lt-interactive-success-bg-hover);
  }

  :host([variant='error']) input[type='checkbox']:checked {
    background: var(--lt-interactive-error-bg);
  }
  :host([variant='error']) input[type='checkbox']:checked:hover:not(:disabled) {
    background: var(--lt-interactive-error-bg-hover);
  }

  :host([variant='info']) input[type='checkbox']:checked {
    background: var(--lt-interactive-info-bg);
  }
  :host([variant='info']) input[type='checkbox']:checked:hover:not(:disabled) {
    background: var(--lt-interactive-info-bg-hover);
  }
`;
