import { css } from 'lit';

/**
 * Styles for the lt-button component.
 *
 * Includes:
 * - Base button styling with transitions
 * - Size variants (sm, md, lg)
 * - Visual variants (primary, secondary, neutral, and semantic colors)
 * - Loading state with spinner
 * - Icon positioning (start and end)
 * - Disabled and focus states
 * - Active/pressed state with translateY animation
 */
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
    outline: 3px solid var(--lt-color-primary-200);
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

  /* variants (background + border + text) */
  :host([variant='primary']) button {
    background: var(--lt-color-primary-500);
    color: var(--lt-color-neutral-50);
  }
  :host([variant='primary']) button:hover:not([disabled]) {
    background: var(--lt-color-primary-700);
  }
  :host([variant='primary']) button:active:not([disabled]) {
    background: var(--lt-color-primary-800);
  }

  :host([variant='secondary']) button {
    background: var(--lt-color-secondary-500);
    color: var(--lt-color-neutral-50);
  }
  :host([variant='secondary']) button:hover:not([disabled]) {
    background: var(--lt-color-secondary-700);
  }
  :host([variant='secondary']) button:active:not([disabled]) {
    background: var(--lt-color-secondary-800);
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

  /* semantic variants */
  :host([variant='success']) button {
    background: var(--lt-color-success-500);
    color: var(--lt-color-neutral-50);
  }
  :host([variant='success']) button:hover:not([disabled]) {
    background: var(--lt-color-success-700);
  }
  :host([variant='success']) button:active:not([disabled]) {
    background: var(--lt-color-success-800);
  }

  :host([variant='warning']) button {
    background: var(--lt-color-warning-500);
    color: var(--lt-color-neutral-50);
  }
  :host([variant='warning']) button:hover:not([disabled]) {
    background: var(--lt-color-warning-700);
  }
  :host([variant='warning']) button:active:not([disabled]) {
    background: var(--lt-color-warning-800);
  }

  :host([variant='error']) button {
    background: var(--lt-color-error-500);
    color: var(--lt-color-neutral-50);
  }
  :host([variant='error']) button:hover:not([disabled]) {
    background: var(--lt-color-error-700);
  }
  :host([variant='error']) button:active:not([disabled]) {
    background: var(--lt-color-error-800);
  }

  :host([variant='info']) button {
    background: var(--lt-color-info-500);
    color: var(--lt-color-neutral-50);
  }
  :host([variant='info']) button:hover:not([disabled]) {
    background: var(--lt-color-info-700);
  }
  :host([variant='info']) button:active:not([disabled]) {
    background: var(--lt-color-info-800);
  }

  /* outlined appearance */
  :host([appearance='outlined'][variant='primary']) button {
    background: transparent;
    border-color: var(--lt-color-primary-500);
    color: var(--lt-color-primary-500);
  }
  :host([appearance='outlined'][variant='primary']) button:hover:not([disabled]) {
    background: var(--lt-color-primary-50);
    border-color: var(--lt-color-primary-700);
    color: var(--lt-color-primary-700);
  }
  :host([appearance='outlined'][variant='primary']) button:active:not([disabled]) {
    background: var(--lt-color-primary-100);
    border-color: var(--lt-color-primary-800);
    color: var(--lt-color-primary-800);
  }

  :host([appearance='outlined'][variant='secondary']) button {
    background: transparent;
    border-color: var(--lt-color-secondary-500);
    color: var(--lt-color-secondary-500);
  }
  :host([appearance='outlined'][variant='secondary']) button:hover:not([disabled]) {
    background: var(--lt-color-secondary-50);
    border-color: var(--lt-color-secondary-700);
    color: var(--lt-color-secondary-700);
  }
  :host([appearance='outlined'][variant='secondary']) button:active:not([disabled]) {
    background: var(--lt-color-secondary-100);
    border-color: var(--lt-color-secondary-800);
    color: var(--lt-color-secondary-800);
  }

  :host([appearance='outlined'][variant='neutral']) button {
    background: transparent;
    border-color: var(--lt-color-neutral-500);
    color: var(--lt-color-neutral-700);
  }
  :host([appearance='outlined'][variant='neutral']) button:hover:not([disabled]) {
    background: var(--lt-color-neutral-50);
    border-color: var(--lt-color-neutral-700);
    color: var(--lt-color-neutral-900);
  }
  :host([appearance='outlined'][variant='neutral']) button:active:not([disabled]) {
    background: var(--lt-color-neutral-100);
    border-color: var(--lt-color-neutral-800);
    color: var(--lt-color-neutral-900);
  }

  :host([appearance='outlined'][variant='success']) button {
    background: transparent;
    border-color: var(--lt-color-success-500);
    color: var(--lt-color-success-500);
  }
  :host([appearance='outlined'][variant='success']) button:hover:not([disabled]) {
    background: var(--lt-color-success-50);
    border-color: var(--lt-color-success-700);
    color: var(--lt-color-success-700);
  }
  :host([appearance='outlined'][variant='success']) button:active:not([disabled]) {
    background: var(--lt-color-success-100);
    border-color: var(--lt-color-success-800);
    color: var(--lt-color-success-800);
  }

  :host([appearance='outlined'][variant='warning']) button {
    background: transparent;
    border-color: var(--lt-color-warning-500);
    color: var(--lt-color-warning-700);
  }
  :host([appearance='outlined'][variant='warning']) button:hover:not([disabled]) {
    background: var(--lt-color-warning-50);
    border-color: var(--lt-color-warning-700);
    color: var(--lt-color-warning-800);
  }
  :host([appearance='outlined'][variant='warning']) button:active:not([disabled]) {
    background: var(--lt-color-warning-100);
    border-color: var(--lt-color-warning-800);
    color: var(--lt-color-warning-900);
  }

  :host([appearance='outlined'][variant='error']) button {
    background: transparent;
    border-color: var(--lt-color-error-500);
    color: var(--lt-color-error-500);
  }
  :host([appearance='outlined'][variant='error']) button:hover:not([disabled]) {
    background: var(--lt-color-error-50);
    border-color: var(--lt-color-error-700);
    color: var(--lt-color-error-700);
  }
  :host([appearance='outlined'][variant='error']) button:active:not([disabled]) {
    background: var(--lt-color-error-100);
    border-color: var(--lt-color-error-800);
    color: var(--lt-color-error-800);
  }

  :host([appearance='outlined'][variant='info']) button {
    background: transparent;
    border-color: var(--lt-color-info-500);
    color: var(--lt-color-info-500);
  }
  :host([appearance='outlined'][variant='info']) button:hover:not([disabled]) {
    background: var(--lt-color-info-50);
    border-color: var(--lt-color-info-700);
    color: var(--lt-color-info-700);
  }
  :host([appearance='outlined'][variant='info']) button:active:not([disabled]) {
    background: var(--lt-color-info-100);
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
