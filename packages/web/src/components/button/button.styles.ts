import { css } from 'lit';

export const buttonStyles = css`
  :host {
    display: inline-block;
    font-family: 'Hanken Grotesk', sans-serif;
  }

  :host([full-width]) {
    display: block;
    width: 100%;
  }

  :host([full-width]) [part='base'] {
    width: 100%;
  }

  [part='base'] {
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

  [part='base']:active {
    transform: translateY(1px);
  }

  [part='base']:focus-visible {
    outline: 3px solid var(--lt-border-focus);
    outline-offset: 2px;
  }

  [part='base'][disabled],
  [part='base'][aria-disabled='true'] {
    cursor: not-allowed;
    opacity: 0.6;
    pointer-events: none;
    transform: none;
  }

  /* anchor reset — browsers apply link color + underline by default */
  a[part='base'] {
    text-decoration: none;
    color: inherit;
  }

  /* sizes */
  :host([size='sm']) [part='base'] {
    font-size: 0.875rem;
    height: 32px;
    padding-inline: var(--lt-spacing-3);
  }

  :host([size='md']) [part='base'] {
    font-size: 1rem;
    height: 40px;
    padding-inline: var(--lt-spacing-4);
  }

  :host([size='lg']) [part='base'] {
    font-size: 1.0625rem;
    height: 48px;
    padding-inline: var(--lt-spacing-5);
  }

  /* variants — solid */
  :host([variant='primary']) [part='base'] {
    background: var(--lt-interactive-primary-bg);
    color: var(--lt-text-on-primary);
  }
  :host([variant='primary']) [part='base']:hover:not([disabled]):not([aria-disabled='true']) {
    background: var(--lt-interactive-primary-bg-hover);
  }
  :host([variant='primary']) [part='base']:active:not([disabled]):not([aria-disabled='true']) {
    background: var(--lt-interactive-primary-bg-active);
  }

  :host([variant='secondary']) [part='base'] {
    background: var(--lt-interactive-secondary-bg);
    color: var(--lt-text-on-secondary);
  }
  :host([variant='secondary']) [part='base']:hover:not([disabled]):not([aria-disabled='true']) {
    background: var(--lt-interactive-secondary-bg-hover);
  }
  :host([variant='secondary']) [part='base']:active:not([disabled]):not([aria-disabled='true']) {
    background: var(--lt-interactive-secondary-bg-active);
  }

  :host([variant='neutral']) [part='base'] {
    background: var(--lt-color-neutral-500);
    color: var(--lt-color-neutral-50);
  }
  :host([variant='neutral']) [part='base']:hover:not([disabled]):not([aria-disabled='true']) {
    background: var(--lt-color-neutral-700);
  }
  :host([variant='neutral']) [part='base']:active:not([disabled]):not([aria-disabled='true']) {
    background: var(--lt-color-neutral-800);
  }

  :host([variant='success']) [part='base'] {
    background: var(--lt-interactive-success-bg);
    color: var(--lt-text-on-success);
  }
  :host([variant='success']) [part='base']:hover:not([disabled]):not([aria-disabled='true']) {
    background: var(--lt-interactive-success-bg-hover);
  }
  :host([variant='success']) [part='base']:active:not([disabled]):not([aria-disabled='true']) {
    background: var(--lt-interactive-success-bg-active);
  }

  :host([variant='warning']) [part='base'] {
    background: var(--lt-interactive-warning-bg);
    color: var(--lt-text-on-warning);
  }
  :host([variant='warning']) [part='base']:hover:not([disabled]):not([aria-disabled='true']) {
    background: var(--lt-interactive-warning-bg-hover);
  }
  :host([variant='warning']) [part='base']:active:not([disabled]):not([aria-disabled='true']) {
    background: var(--lt-interactive-warning-bg-active);
  }

  :host([variant='error']) [part='base'] {
    background: var(--lt-interactive-error-bg);
    color: var(--lt-text-on-error);
  }
  :host([variant='error']) [part='base']:hover:not([disabled]):not([aria-disabled='true']) {
    background: var(--lt-interactive-error-bg-hover);
  }
  :host([variant='error']) [part='base']:active:not([disabled]):not([aria-disabled='true']) {
    background: var(--lt-interactive-error-bg-active);
  }

  :host([variant='info']) [part='base'] {
    background: var(--lt-interactive-info-bg);
    color: var(--lt-text-on-info);
  }
  :host([variant='info']) [part='base']:hover:not([disabled]):not([aria-disabled='true']) {
    background: var(--lt-interactive-info-bg-hover);
  }
  :host([variant='info']) [part='base']:active:not([disabled]):not([aria-disabled='true']) {
    background: var(--lt-interactive-info-bg-active);
  }

  /* outlined appearance */
  :host([appearance='outlined'][variant='primary']) [part='base'] {
    background: transparent;
    border-color: var(--lt-border-primary-strong);
    color: var(--lt-color-primary-500);
  }
  :host([appearance='outlined'][variant='primary']) [part='base']:hover:not([disabled]):not([aria-disabled='true']) {
    background: var(--lt-color-primary-50);
    border-color: var(--lt-color-primary-700);
    color: var(--lt-text-primary);
  }
  :host([appearance='outlined'][variant='primary']) [part='base']:active:not([disabled]):not([aria-disabled='true']) {
    background: var(--lt-bg-primary-subtle);
    border-color: var(--lt-color-primary-800);
    color: var(--lt-color-primary-800);
  }

  :host([appearance='outlined'][variant='secondary']) [part='base'] {
    background: transparent;
    border-color: var(--lt-border-secondary-strong);
    color: var(--lt-color-secondary-500);
  }
  :host([appearance='outlined'][variant='secondary']) [part='base']:hover:not([disabled]):not([aria-disabled='true']) {
    background: var(--lt-color-secondary-50);
    border-color: var(--lt-color-secondary-700);
    color: var(--lt-text-secondary);
  }
  :host([appearance='outlined'][variant='secondary']) [part='base']:active:not([disabled]):not([aria-disabled='true']) {
    background: var(--lt-bg-secondary-subtle);
    border-color: var(--lt-color-secondary-800);
    color: var(--lt-color-secondary-800);
  }

  :host([appearance='outlined'][variant='neutral']) [part='base'] {
    background: transparent;
    border-color: var(--lt-color-neutral-500);
    color: var(--lt-color-neutral-700);
  }
  :host([appearance='outlined'][variant='neutral']) [part='base']:hover:not([disabled]):not([aria-disabled='true']) {
    background: var(--lt-bg-subtle);
    border-color: var(--lt-color-neutral-700);
    color: var(--lt-text-default);
  }
  :host([appearance='outlined'][variant='neutral']) [part='base']:active:not([disabled]):not([aria-disabled='true']) {
    background: var(--lt-bg-surface);
    border-color: var(--lt-color-neutral-800);
    color: var(--lt-text-default);
  }

  :host([appearance='outlined'][variant='success']) [part='base'] {
    background: transparent;
    border-color: var(--lt-border-success-strong);
    color: var(--lt-color-success-500);
  }
  :host([appearance='outlined'][variant='success']) [part='base']:hover:not([disabled]):not([aria-disabled='true']) {
    background: var(--lt-color-success-50);
    border-color: var(--lt-color-success-700);
    color: var(--lt-text-success);
  }
  :host([appearance='outlined'][variant='success']) [part='base']:active:not([disabled]):not([aria-disabled='true']) {
    background: var(--lt-bg-success-subtle);
    border-color: var(--lt-color-success-800);
    color: var(--lt-color-success-800);
  }

  :host([appearance='outlined'][variant='warning']) [part='base'] {
    background: transparent;
    border-color: var(--lt-border-warning-strong);
    color: var(--lt-color-warning-700);
  }
  :host([appearance='outlined'][variant='warning']) [part='base']:hover:not([disabled]):not([aria-disabled='true']) {
    background: var(--lt-color-warning-50);
    border-color: var(--lt-color-warning-700);
    color: var(--lt-color-warning-800);
  }
  :host([appearance='outlined'][variant='warning']) [part='base']:active:not([disabled]):not([aria-disabled='true']) {
    background: var(--lt-bg-warning-subtle);
    border-color: var(--lt-color-warning-800);
    color: var(--lt-color-warning-900);
  }

  :host([appearance='outlined'][variant='error']) [part='base'] {
    background: transparent;
    border-color: var(--lt-border-error-strong);
    color: var(--lt-color-error-500);
  }
  :host([appearance='outlined'][variant='error']) [part='base']:hover:not([disabled]):not([aria-disabled='true']) {
    background: var(--lt-color-error-50);
    border-color: var(--lt-color-error-700);
    color: var(--lt-text-error);
  }
  :host([appearance='outlined'][variant='error']) [part='base']:active:not([disabled]):not([aria-disabled='true']) {
    background: var(--lt-bg-error-subtle);
    border-color: var(--lt-color-error-800);
    color: var(--lt-color-error-800);
  }

  :host([appearance='outlined'][variant='info']) [part='base'] {
    background: transparent;
    border-color: var(--lt-border-info-strong);
    color: var(--lt-color-info-500);
  }
  :host([appearance='outlined'][variant='info']) [part='base']:hover:not([disabled]):not([aria-disabled='true']) {
    background: var(--lt-color-info-50);
    border-color: var(--lt-color-info-700);
    color: var(--lt-text-info);
  }
  :host([appearance='outlined'][variant='info']) [part='base']:active:not([disabled]):not([aria-disabled='true']) {
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

  :host([uppercase]) [part='base'] {
    font-variant-caps: small-caps;
    letter-spacing: 0.05rem;
    text-transform: lowercase;
  }
`;
