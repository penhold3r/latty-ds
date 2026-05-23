import { css } from 'lit';

export const buttonStyles = css`
  :host {
    display: inline-block;
    font-family: 'Hanken Grotesk', sans-serif;

    /* Internal state props — set per variant/appearance below */
    --_color: var(--lt-text-on-primary);
    --_bg: var(--lt-interactive-primary-bg);
    --_border-color: transparent;
    --_hover-bg: var(--lt-interactive-primary-bg-hover);
    --_active-bg: var(--lt-interactive-primary-bg-active);
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
    background: var(--lt-button-bg, var(--_bg));
    border-radius: var(--lt-border-radius);
    border: 1px solid var(--lt-button-border-color, var(--_border-color));
    box-sizing: border-box;
    color: var(--lt-button-color, var(--_color));
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
  :host([variant='primary']) {
    --_bg: var(--lt-interactive-primary-bg);
    --_color: var(--lt-text-on-primary);
    --_hover-bg: var(--lt-interactive-primary-bg-hover);
    --_active-bg: var(--lt-interactive-primary-bg-active);
  }
  :host([variant='secondary']) {
    --_bg: var(--lt-interactive-secondary-bg);
    --_color: var(--lt-text-on-secondary);
    --_hover-bg: var(--lt-interactive-secondary-bg-hover);
    --_active-bg: var(--lt-interactive-secondary-bg-active);
  }
  :host([variant='neutral']) {
    --_bg: var(--lt-color-neutral-500);
    --_color: var(--lt-color-neutral-50);
    --_hover-bg: var(--lt-color-neutral-700);
    --_active-bg: var(--lt-color-neutral-800);
  }
  :host([variant='success']) {
    --_bg: var(--lt-interactive-success-bg);
    --_color: var(--lt-text-on-success);
    --_hover-bg: var(--lt-interactive-success-bg-hover);
    --_active-bg: var(--lt-interactive-success-bg-active);
  }
  :host([variant='warning']) {
    --_bg: var(--lt-interactive-warning-bg);
    --_color: var(--lt-text-on-warning);
    --_hover-bg: var(--lt-interactive-warning-bg-hover);
    --_active-bg: var(--lt-interactive-warning-bg-active);
  }
  :host([variant='error']) {
    --_bg: var(--lt-interactive-error-bg);
    --_color: var(--lt-text-on-error);
    --_hover-bg: var(--lt-interactive-error-bg-hover);
    --_active-bg: var(--lt-interactive-error-bg-active);
  }
  :host([variant='info']) {
    --_bg: var(--lt-interactive-info-bg);
    --_color: var(--lt-text-on-info);
    --_hover-bg: var(--lt-interactive-info-bg-hover);
    --_active-bg: var(--lt-interactive-info-bg-active);
  }

  [part='base']:hover:not([disabled]):not([aria-disabled='true']) {
    background: var(--lt-button-bg, var(--_hover-bg));
  }

  [part='base']:active:not([disabled]):not([aria-disabled='true']) {
    background: var(--lt-button-bg, var(--_active-bg));
  }

  /* outlined appearance */
  :host([appearance='outlined'][variant='primary']) {
    --_bg: transparent;
    --_color: var(--lt-text-primary);
    --_border-color: var(--lt-border-primary-strong);
    --_hover-bg: var(--lt-bg-primary-subtle);
    --_active-bg: var(--lt-bg-primary-subtle);
  }
  :host([appearance='outlined'][variant='secondary']) {
    --_bg: transparent;
    --_color: var(--lt-text-secondary);
    --_border-color: var(--lt-border-secondary-strong);
    --_hover-bg: var(--lt-bg-secondary-subtle);
    --_active-bg: var(--lt-bg-secondary-subtle);
  }
  :host([appearance='outlined'][variant='neutral']) {
    --_bg: transparent;
    --_color: var(--lt-text-neutral);
    --_border-color: var(--lt-border-strong);
    --_hover-bg: var(--lt-bg-subtle);
    --_active-bg: var(--lt-bg-surface);
  }
  :host([appearance='outlined'][variant='success']) {
    --_bg: transparent;
    --_color: var(--lt-text-success);
    --_border-color: var(--lt-border-success-strong);
    --_hover-bg: var(--lt-bg-success-subtle);
    --_active-bg: var(--lt-bg-success-subtle);
  }
  :host([appearance='outlined'][variant='warning']) {
    --_bg: transparent;
    --_color: var(--lt-text-warning);
    --_border-color: var(--lt-border-warning-strong);
    --_hover-bg: var(--lt-bg-warning-subtle);
    --_active-bg: var(--lt-bg-warning-subtle);
  }
  :host([appearance='outlined'][variant='error']) {
    --_bg: transparent;
    --_color: var(--lt-text-error);
    --_border-color: var(--lt-border-error-strong);
    --_hover-bg: var(--lt-bg-error-subtle);
    --_active-bg: var(--lt-bg-error-subtle);
  }
  :host([appearance='outlined'][variant='info']) {
    --_bg: transparent;
    --_color: var(--lt-text-info);
    --_border-color: var(--lt-border-info-strong);
    --_hover-bg: var(--lt-bg-info-subtle);
    --_active-bg: var(--lt-bg-info-subtle);
  }

  :host([appearance='outlined']) [part='base']:active:not([disabled]):not([aria-disabled='true']) {
    opacity: 0.8;
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
