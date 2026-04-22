import { css } from 'lit';

export const buttonStyles = css`
  :host {
    display: inline-block;
    font-family: 'Asap', sans-serif;
  }

  button {
    align-items: center;
    border-radius: var(--lt-border-radius);
    border: 1px solid transparent;
    box-sizing: border-box;
    cursor: pointer;
    display: inline-flex;
    font-family: inherit;
    font-weight: 400;
    gap: var(--lt-spacing-2);
    justify-content: center;
    line-height: 1;
    min-width: 88px;
    user-select: none;
    transition:
      background-color 120ms ease,
      border-color 120ms ease,
      transform 50ms ease;
  }

  button:active {
    transform: translateY(1px);
  }

  button:focus-visible {
    outline: 3px solid var(--lt-border-focus);
    outline-offset: 2px;
  }

  button[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
  }

  /* sizes */
  :host([size='sm']) button {
    font-size: 0.875rem;
    height: 32px;
    padding-inline: var(--lt-spacing-3);
  }

  :host([size='md']) button {
    font-size: 1rem;
    height: 40px;
    padding-inline: var(--lt-spacing-4);
  }

  :host([size='lg']) button {
    font-size: 1.0625rem;
    height: 48px;
    padding-inline: var(--lt-spacing-5);
  }

  /* variants — solid */
  :host([variant='primary']) button {
    background: var(--lt-interactive-primary-bg);
    color: var(--lt-text-on-primary);
  }
  :host([variant='primary']) button:hover:not([disabled]) {
    background: var(--lt-interactive-primary-bg-hover);
  }
  :host([variant='primary']) button:active:not([disabled]) {
    background: var(--lt-interactive-primary-bg-active);
  }

  :host([variant='secondary']) button {
    background: var(--lt-interactive-secondary-bg);
    color: var(--lt-text-on-secondary);
  }
  :host([variant='secondary']) button:hover:not([disabled]) {
    background: var(--lt-interactive-secondary-bg-hover);
  }
  :host([variant='secondary']) button:active:not([disabled]) {
    background: var(--lt-interactive-secondary-bg-active);
  }

  :host([variant='neutral']) button {
    background: var(--lt-color-neutral-500);
    color: var(--lt-color-neutral-50);
  }
  :host([variant='neutral']) button:hover:not([disabled]) {
    background: var(--lt-color-neutral-700);
  }
  :host([variant='neutral']) button:active:not([disabled]) {
    background: var(--lt-color-neutral-800);
  }

  :host([variant='success']) button {
    background: var(--lt-interactive-success-bg);
    color: var(--lt-text-on-success);
  }
  :host([variant='success']) button:hover:not([disabled]) {
    background: var(--lt-interactive-success-bg-hover);
  }
  :host([variant='success']) button:active:not([disabled]) {
    background: var(--lt-interactive-success-bg-active);
  }

  :host([variant='warning']) button {
    background: var(--lt-interactive-warning-bg);
    color: var(--lt-text-on-warning);
  }
  :host([variant='warning']) button:hover:not([disabled]) {
    background: var(--lt-interactive-warning-bg-hover);
  }
  :host([variant='warning']) button:active:not([disabled]) {
    background: var(--lt-interactive-warning-bg-active);
  }

  :host([variant='error']) button {
    background: var(--lt-interactive-error-bg);
    color: var(--lt-text-on-error);
  }
  :host([variant='error']) button:hover:not([disabled]) {
    background: var(--lt-interactive-error-bg-hover);
  }
  :host([variant='error']) button:active:not([disabled]) {
    background: var(--lt-interactive-error-bg-active);
  }

  :host([variant='info']) button {
    background: var(--lt-interactive-info-bg);
    color: var(--lt-text-on-info);
  }
  :host([variant='info']) button:hover:not([disabled]) {
    background: var(--lt-interactive-info-bg-hover);
  }
  :host([variant='info']) button:active:not([disabled]) {
    background: var(--lt-interactive-info-bg-active);
  }

  /* outlined appearance */
  :host([appearance='outlined'][variant='primary']) button {
    background: transparent;
    border-color: var(--lt-border-primary-strong);
    color: var(--lt-color-primary-500);
  }
  :host([appearance='outlined'][variant='primary']) button:hover:not([disabled]) {
    background: var(--lt-color-primary-50);
    border-color: var(--lt-color-primary-700);
    color: var(--lt-text-primary);
  }
  :host([appearance='outlined'][variant='primary']) button:active:not([disabled]) {
    background: var(--lt-bg-primary-subtle);
    border-color: var(--lt-color-primary-800);
    color: var(--lt-color-primary-800);
  }

  :host([appearance='outlined'][variant='secondary']) button {
    background: transparent;
    border-color: var(--lt-border-secondary-strong);
    color: var(--lt-color-secondary-500);
  }
  :host([appearance='outlined'][variant='secondary']) button:hover:not([disabled]) {
    background: var(--lt-color-secondary-50);
    border-color: var(--lt-color-secondary-700);
    color: var(--lt-text-secondary);
  }
  :host([appearance='outlined'][variant='secondary']) button:active:not([disabled]) {
    background: var(--lt-bg-secondary-subtle);
    border-color: var(--lt-color-secondary-800);
    color: var(--lt-color-secondary-800);
  }

  :host([appearance='outlined'][variant='neutral']) button {
    background: transparent;
    border-color: var(--lt-color-neutral-500);
    color: var(--lt-color-neutral-700);
  }
  :host([appearance='outlined'][variant='neutral']) button:hover:not([disabled]) {
    background: var(--lt-bg-subtle);
    border-color: var(--lt-color-neutral-700);
    color: var(--lt-text-default);
  }
  :host([appearance='outlined'][variant='neutral']) button:active:not([disabled]) {
    background: var(--lt-bg-surface);
    border-color: var(--lt-color-neutral-800);
    color: var(--lt-text-default);
  }

  :host([appearance='outlined'][variant='success']) button {
    background: transparent;
    border-color: var(--lt-border-success-strong);
    color: var(--lt-color-success-500);
  }
  :host([appearance='outlined'][variant='success']) button:hover:not([disabled]) {
    background: var(--lt-color-success-50);
    border-color: var(--lt-color-success-700);
    color: var(--lt-text-success);
  }
  :host([appearance='outlined'][variant='success']) button:active:not([disabled]) {
    background: var(--lt-bg-success-subtle);
    border-color: var(--lt-color-success-800);
    color: var(--lt-color-success-800);
  }

  :host([appearance='outlined'][variant='warning']) button {
    background: transparent;
    border-color: var(--lt-border-warning-strong);
    color: var(--lt-color-warning-700);
  }
  :host([appearance='outlined'][variant='warning']) button:hover:not([disabled]) {
    background: var(--lt-color-warning-50);
    border-color: var(--lt-color-warning-700);
    color: var(--lt-color-warning-800);
  }
  :host([appearance='outlined'][variant='warning']) button:active:not([disabled]) {
    background: var(--lt-bg-warning-subtle);
    border-color: var(--lt-color-warning-800);
    color: var(--lt-color-warning-900);
  }

  :host([appearance='outlined'][variant='error']) button {
    background: transparent;
    border-color: var(--lt-border-error-strong);
    color: var(--lt-color-error-500);
  }
  :host([appearance='outlined'][variant='error']) button:hover:not([disabled]) {
    background: var(--lt-color-error-50);
    border-color: var(--lt-color-error-700);
    color: var(--lt-text-error);
  }
  :host([appearance='outlined'][variant='error']) button:active:not([disabled]) {
    background: var(--lt-bg-error-subtle);
    border-color: var(--lt-color-error-800);
    color: var(--lt-color-error-800);
  }

  :host([appearance='outlined'][variant='info']) button {
    background: transparent;
    border-color: var(--lt-border-info-strong);
    color: var(--lt-color-info-500);
  }
  :host([appearance='outlined'][variant='info']) button:hover:not([disabled]) {
    background: var(--lt-color-info-50);
    border-color: var(--lt-color-info-700);
    color: var(--lt-text-info);
  }
  :host([appearance='outlined'][variant='info']) button:active:not([disabled]) {
    background: var(--lt-bg-info-subtle);
    border-color: var(--lt-color-info-800);
    color: var(--lt-color-info-800);
  }

  /* loading */
  .spinner {
    animation: spin 700ms linear infinite;
    border-radius: 999px;
    border-right-color: transparent;
    border: 2px solid currentColor;
    height: 1em;
    width: 1em;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .icon,
  .end {
    align-items: center;
    display: inline-flex;
    justify-content: center;
  }
`;
