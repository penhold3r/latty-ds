import { css } from 'lit';

export const iconButtonStyles = css`
  :host {
    display: inline-flex;
  }

  [part='base'] {
    align-items: center;
    background: transparent;
    border-radius: var(--lt-border-radius);
    border: 1px solid transparent;
    box-sizing: border-box;
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    padding: 0;
    transition:
      background-color 120ms ease,
      border-color 120ms ease,
      transform 50ms ease;
    user-select: none;
  }

  [part='base']:active {
    transform: translateY(1px);
  }

  [part='base']:focus-visible {
    outline: 3px solid var(--lt-border-focus);
    outline-offset: 2px;
  }

  [part='base'][disabled] {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: none;
    transform: none;
  }

  a[part='base'] {
    text-decoration: none;
    color: inherit;
  }

  /* sizes */
  :host([size='sm']) [part='base'] {
    height: 28px;
    width: 28px;
  }

  :host([size='md']) [part='base'] {
    height: 36px;
    width: 36px;
  }

  :host([size='lg']) [part='base'] {
    height: 44px;
    width: 44px;
  }

  /* ghost — the default appearance; transparent with subtle hover */
  :host([appearance='ghost'][variant='primary']) [part='base'] {
    color: var(--lt-text-primary);
  }
  :host([appearance='ghost'][variant='primary']) [part='base']:hover:not([disabled]) {
    background: var(--lt-bg-primary-subtle);
  }

  :host([appearance='ghost'][variant='secondary']) [part='base'] {
    color: var(--lt-text-secondary);
  }
  :host([appearance='ghost'][variant='secondary']) [part='base']:hover:not([disabled]) {
    background: var(--lt-bg-secondary-subtle);
  }

  :host([appearance='ghost'][variant='neutral']) [part='base'] {
    color: var(--lt-text-subtle);
  }
  :host([appearance='ghost'][variant='neutral']) [part='base']:hover:not([disabled]) {
    background: var(--lt-bg-subtle);
    color: var(--lt-text-default);
  }

  :host([appearance='ghost'][variant='success']) [part='base'] {
    color: var(--lt-text-success);
  }
  :host([appearance='ghost'][variant='success']) [part='base']:hover:not([disabled]) {
    background: var(--lt-bg-success-subtle);
  }

  :host([appearance='ghost'][variant='warning']) [part='base'] {
    color: var(--lt-text-warning);
  }
  :host([appearance='ghost'][variant='warning']) [part='base']:hover:not([disabled]) {
    background: var(--lt-bg-warning-subtle);
  }

  :host([appearance='ghost'][variant='error']) [part='base'] {
    color: var(--lt-text-error);
  }
  :host([appearance='ghost'][variant='error']) [part='base']:hover:not([disabled]) {
    background: var(--lt-bg-error-subtle);
  }

  :host([appearance='ghost'][variant='info']) [part='base'] {
    color: var(--lt-text-info);
  }
  :host([appearance='ghost'][variant='info']) [part='base']:hover:not([disabled]) {
    background: var(--lt-bg-info-subtle);
  }

  /* filled */
  :host([appearance='filled'][variant='primary']) [part='base'] {
    background: var(--lt-interactive-primary-bg);
    color: var(--lt-text-on-primary);
  }
  :host([appearance='filled'][variant='primary']) [part='base']:hover:not([disabled]) {
    background: var(--lt-interactive-primary-bg-hover);
  }
  :host([appearance='filled'][variant='primary']) [part='base']:active:not([disabled]) {
    background: var(--lt-interactive-primary-bg-active);
  }

  :host([appearance='filled'][variant='secondary']) [part='base'] {
    background: var(--lt-interactive-secondary-bg);
    color: var(--lt-text-on-secondary);
  }
  :host([appearance='filled'][variant='secondary']) [part='base']:hover:not([disabled]) {
    background: var(--lt-interactive-secondary-bg-hover);
  }
  :host([appearance='filled'][variant='secondary']) [part='base']:active:not([disabled]) {
    background: var(--lt-interactive-secondary-bg-active);
  }

  :host([appearance='filled'][variant='neutral']) [part='base'] {
    background: var(--lt-color-neutral-500);
    color: var(--lt-color-neutral-50);
  }
  :host([appearance='filled'][variant='neutral']) [part='base']:hover:not([disabled]) {
    background: var(--lt-color-neutral-700);
  }
  :host([appearance='filled'][variant='neutral']) [part='base']:active:not([disabled]) {
    background: var(--lt-color-neutral-800);
  }

  :host([appearance='filled'][variant='success']) [part='base'] {
    background: var(--lt-interactive-success-bg);
    color: var(--lt-text-on-success);
  }
  :host([appearance='filled'][variant='success']) [part='base']:hover:not([disabled]) {
    background: var(--lt-interactive-success-bg-hover);
  }
  :host([appearance='filled'][variant='success']) [part='base']:active:not([disabled]) {
    background: var(--lt-interactive-success-bg-active);
  }

  :host([appearance='filled'][variant='warning']) [part='base'] {
    background: var(--lt-interactive-warning-bg);
    color: var(--lt-text-on-warning);
  }
  :host([appearance='filled'][variant='warning']) [part='base']:hover:not([disabled]) {
    background: var(--lt-interactive-warning-bg-hover);
  }
  :host([appearance='filled'][variant='warning']) [part='base']:active:not([disabled]) {
    background: var(--lt-interactive-warning-bg-active);
  }

  :host([appearance='filled'][variant='error']) [part='base'] {
    background: var(--lt-interactive-error-bg);
    color: var(--lt-text-on-error);
  }
  :host([appearance='filled'][variant='error']) [part='base']:hover:not([disabled]) {
    background: var(--lt-interactive-error-bg-hover);
  }
  :host([appearance='filled'][variant='error']) [part='base']:active:not([disabled]) {
    background: var(--lt-interactive-error-bg-active);
  }

  :host([appearance='filled'][variant='info']) [part='base'] {
    background: var(--lt-interactive-info-bg);
    color: var(--lt-text-on-info);
  }
  :host([appearance='filled'][variant='info']) [part='base']:hover:not([disabled]) {
    background: var(--lt-interactive-info-bg-hover);
  }
  :host([appearance='filled'][variant='info']) [part='base']:active:not([disabled]) {
    background: var(--lt-interactive-info-bg-active);
  }

  /* outlined */
  :host([appearance='outlined'][variant='primary']) [part='base'] {
    border-color: var(--lt-border-primary-strong);
    color: var(--lt-text-primary);
  }
  :host([appearance='outlined'][variant='primary']) [part='base']:hover:not([disabled]) {
    background: var(--lt-bg-primary-subtle);
  }

  :host([appearance='outlined'][variant='secondary']) [part='base'] {
    border-color: var(--lt-border-secondary-strong);
    color: var(--lt-text-secondary);
  }
  :host([appearance='outlined'][variant='secondary']) [part='base']:hover:not([disabled]) {
    background: var(--lt-bg-secondary-subtle);
  }

  :host([appearance='outlined'][variant='neutral']) [part='base'] {
    border-color: var(--lt-border-strong);
    color: var(--lt-text-neutral);
  }
  :host([appearance='outlined'][variant='neutral']) [part='base']:hover:not([disabled]) {
    background: var(--lt-bg-subtle);
    color: var(--lt-text-default);
  }

  :host([appearance='outlined'][variant='success']) [part='base'] {
    border-color: var(--lt-border-success-strong);
    color: var(--lt-text-success);
  }
  :host([appearance='outlined'][variant='success']) [part='base']:hover:not([disabled]) {
    background: var(--lt-bg-success-subtle);
  }

  :host([appearance='outlined'][variant='warning']) [part='base'] {
    border-color: var(--lt-border-warning-strong);
    color: var(--lt-text-warning);
  }
  :host([appearance='outlined'][variant='warning']) [part='base']:hover:not([disabled]) {
    background: var(--lt-bg-warning-subtle);
  }

  :host([appearance='outlined'][variant='error']) [part='base'] {
    border-color: var(--lt-border-error-strong);
    color: var(--lt-text-error);
  }
  :host([appearance='outlined'][variant='error']) [part='base']:hover:not([disabled]) {
    background: var(--lt-bg-error-subtle);
  }

  :host([appearance='outlined'][variant='info']) [part='base'] {
    border-color: var(--lt-border-info-strong);
    color: var(--lt-text-info);
  }
  :host([appearance='outlined'][variant='info']) [part='base']:hover:not([disabled]) {
    background: var(--lt-bg-info-subtle);
  }

  /* round shape */
  :host([round]) [part='base'] {
    border-radius: 50%;
  }
`;
