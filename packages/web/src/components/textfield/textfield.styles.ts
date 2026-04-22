import { css } from 'lit';

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
    color: var(--lt-interactive-success-bg);
  }

  :host([variant='warning']) .variant-icon {
    color: var(--lt-interactive-warning-bg);
  }

  :host([variant='error']) .variant-icon {
    color: var(--lt-interactive-error-bg);
  }

  input,
  textarea {
    background: var(--lt-bg-subtle);
    border-radius: var(--lt-border-radius);
    border: 1px solid var(--lt-color-neutral-300);
    box-sizing: border-box;
    color: var(--lt-text-default);
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
    color: var(--lt-text-muted);
  }

  input:hover:not(:disabled),
  textarea:hover:not(:disabled) {
    border-color: var(--lt-border-strong);
  }

  input:focus,
  textarea:focus {
    border-color: var(--lt-interactive-primary-bg);
    box-shadow: 0 0 0 3px var(--lt-bg-primary-subtle);
    outline: none;
  }

  input:disabled,
  textarea:disabled {
    background: var(--lt-bg-surface);
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
    border-color: var(--lt-border-success-strong);
  }

  :host([variant='success']) input:focus,
  :host([variant='success']) textarea:focus {
    border-color: var(--lt-interactive-success-bg-hover);
    box-shadow: 0 0 0 3px var(--lt-bg-success-subtle);
  }

  :host([variant='warning']) input,
  :host([variant='warning']) textarea {
    border-color: var(--lt-border-warning-strong);
  }

  :host([variant='warning']) input:focus,
  :host([variant='warning']) textarea:focus {
    border-color: var(--lt-interactive-warning-bg-hover);
    box-shadow: 0 0 0 3px var(--lt-bg-warning-subtle);
  }

  :host([variant='error']) input,
  :host([variant='error']) textarea {
    border-color: var(--lt-border-error-strong);
  }

  :host([variant='error']) input:focus,
  :host([variant='error']) textarea:focus {
    border-color: var(--lt-interactive-error-bg-hover);
    box-shadow: 0 0 0 3px var(--lt-bg-error-subtle);
  }

  .helper-text {
    color: var(--lt-text-subtle);
    font-size: 0.75rem;
  }

  :host([variant='success']) .helper-text {
    color: var(--lt-text-success);
  }

  :host([variant='warning']) .helper-text {
    color: var(--lt-text-warning);
  }

  :host([variant='error']) .helper-text {
    color: var(--lt-text-error);
  }

  .required-indicator {
    color: var(--lt-color-error-500);
  }
`;
