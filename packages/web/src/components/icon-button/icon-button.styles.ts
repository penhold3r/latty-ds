import { css } from 'lit';

export const iconButtonStyles = css`
  :host {
    display: inline-flex;

    /* Internal state props — set per variant/appearance below */
    --_color: var(--lt-text-subtle);
    --_bg: transparent;
    --_border-color: transparent;
    --_hover-bg: var(--lt-bg-subtle);
    --_hover-color: var(--lt-text-default);
    --_active-bg: var(--lt-bg-subtle);
  }

  [part='base'] {
    align-items: center;
    background: var(--lt-icon-button-bg, var(--_bg));
    border-radius: var(--lt-border-radius);
    border: 1px solid var(--lt-icon-button-border-color, var(--_border-color));
    box-sizing: border-box;
    color: var(--lt-icon-button-color, var(--_color));
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

  [part='base']:hover:not([disabled]) {
    background: var(--lt-icon-button-hover-bg, var(--_hover-bg));
    color: var(--lt-icon-button-hover-color, var(--lt-icon-button-color, var(--_hover-color)));
  }

  [part='base']:active {
    transform: translateY(1px);
  }

  [part='base']:active:not([disabled]) {
    background: var(--lt-icon-button-hover-bg, var(--_active-bg));
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

  /* ── ghost ────────────────────────────────────────────────── */
  :host([appearance='ghost'][variant='primary']) {
    --_color: var(--lt-text-primary);
    --_hover-bg: var(--lt-bg-primary-subtle);
    --_hover-color: var(--lt-text-primary);
    --_active-bg: var(--lt-bg-primary-subtle);
  }
  :host([appearance='ghost'][variant='secondary']) {
    --_color: var(--lt-text-secondary);
    --_hover-bg: var(--lt-bg-secondary-subtle);
    --_hover-color: var(--lt-text-secondary);
    --_active-bg: var(--lt-bg-secondary-subtle);
  }
  :host([appearance='ghost'][variant='success']) {
    --_color: var(--lt-text-success);
    --_hover-bg: var(--lt-bg-success-subtle);
    --_hover-color: var(--lt-text-success);
    --_active-bg: var(--lt-bg-success-subtle);
  }
  :host([appearance='ghost'][variant='warning']) {
    --_color: var(--lt-text-warning);
    --_hover-bg: var(--lt-bg-warning-subtle);
    --_hover-color: var(--lt-text-warning);
    --_active-bg: var(--lt-bg-warning-subtle);
  }
  :host([appearance='ghost'][variant='error']) {
    --_color: var(--lt-text-error);
    --_hover-bg: var(--lt-bg-error-subtle);
    --_hover-color: var(--lt-text-error);
    --_active-bg: var(--lt-bg-error-subtle);
  }
  :host([appearance='ghost'][variant='info']) {
    --_color: var(--lt-text-info);
    --_hover-bg: var(--lt-bg-info-subtle);
    --_hover-color: var(--lt-text-info);
    --_active-bg: var(--lt-bg-info-subtle);
  }

  /* ── filled ───────────────────────────────────────────────── */
  :host([appearance='filled'][variant='primary']) {
    --_bg: var(--lt-interactive-primary-bg);
    --_color: var(--lt-text-on-primary);
    --_hover-bg: var(--lt-interactive-primary-bg-hover);
    --_hover-color: var(--lt-text-on-primary);
    --_active-bg: var(--lt-interactive-primary-bg-active);
  }
  :host([appearance='filled'][variant='secondary']) {
    --_bg: var(--lt-interactive-secondary-bg);
    --_color: var(--lt-text-on-secondary);
    --_hover-bg: var(--lt-interactive-secondary-bg-hover);
    --_hover-color: var(--lt-text-on-secondary);
    --_active-bg: var(--lt-interactive-secondary-bg-active);
  }
  :host([appearance='filled'][variant='neutral']) {
    --_bg: var(--lt-color-neutral-500);
    --_color: var(--lt-color-neutral-50);
    --_hover-bg: var(--lt-color-neutral-700);
    --_hover-color: var(--lt-color-neutral-50);
    --_active-bg: var(--lt-color-neutral-800);
  }
  :host([appearance='filled'][variant='success']) {
    --_bg: var(--lt-interactive-success-bg);
    --_color: var(--lt-text-on-success);
    --_hover-bg: var(--lt-interactive-success-bg-hover);
    --_hover-color: var(--lt-text-on-success);
    --_active-bg: var(--lt-interactive-success-bg-active);
  }
  :host([appearance='filled'][variant='warning']) {
    --_bg: var(--lt-interactive-warning-bg);
    --_color: var(--lt-text-on-warning);
    --_hover-bg: var(--lt-interactive-warning-bg-hover);
    --_hover-color: var(--lt-text-on-warning);
    --_active-bg: var(--lt-interactive-warning-bg-active);
  }
  :host([appearance='filled'][variant='error']) {
    --_bg: var(--lt-interactive-error-bg);
    --_color: var(--lt-text-on-error);
    --_hover-bg: var(--lt-interactive-error-bg-hover);
    --_hover-color: var(--lt-text-on-error);
    --_active-bg: var(--lt-interactive-error-bg-active);
  }
  :host([appearance='filled'][variant='info']) {
    --_bg: var(--lt-interactive-info-bg);
    --_color: var(--lt-text-on-info);
    --_hover-bg: var(--lt-interactive-info-bg-hover);
    --_hover-color: var(--lt-text-on-info);
    --_active-bg: var(--lt-interactive-info-bg-active);
  }

  /* ── outlined ─────────────────────────────────────────────── */
  :host([appearance='outlined'][variant='primary']) {
    --_color: var(--lt-text-primary);
    --_border-color: var(--lt-border-primary-strong);
    --_hover-bg: var(--lt-bg-primary-subtle);
    --_hover-color: var(--lt-text-primary);
    --_active-bg: var(--lt-bg-primary-subtle);
  }
  :host([appearance='outlined'][variant='secondary']) {
    --_color: var(--lt-text-secondary);
    --_border-color: var(--lt-border-secondary-strong);
    --_hover-bg: var(--lt-bg-secondary-subtle);
    --_hover-color: var(--lt-text-secondary);
    --_active-bg: var(--lt-bg-secondary-subtle);
  }
  :host([appearance='outlined'][variant='neutral']) {
    --_color: var(--lt-text-neutral);
    --_border-color: var(--lt-border-strong);
    --_hover-bg: var(--lt-bg-subtle);
    --_hover-color: var(--lt-text-default);
    --_active-bg: var(--lt-bg-subtle);
  }
  :host([appearance='outlined'][variant='success']) {
    --_color: var(--lt-text-success);
    --_border-color: var(--lt-border-success-strong);
    --_hover-bg: var(--lt-bg-success-subtle);
    --_hover-color: var(--lt-text-success);
    --_active-bg: var(--lt-bg-success-subtle);
  }
  :host([appearance='outlined'][variant='warning']) {
    --_color: var(--lt-text-warning);
    --_border-color: var(--lt-border-warning-strong);
    --_hover-bg: var(--lt-bg-warning-subtle);
    --_hover-color: var(--lt-text-warning);
    --_active-bg: var(--lt-bg-warning-subtle);
  }
  :host([appearance='outlined'][variant='error']) {
    --_color: var(--lt-text-error);
    --_border-color: var(--lt-border-error-strong);
    --_hover-bg: var(--lt-bg-error-subtle);
    --_hover-color: var(--lt-text-error);
    --_active-bg: var(--lt-bg-error-subtle);
  }
  :host([appearance='outlined'][variant='info']) {
    --_color: var(--lt-text-info);
    --_border-color: var(--lt-border-info-strong);
    --_hover-bg: var(--lt-bg-info-subtle);
    --_hover-color: var(--lt-text-info);
    --_active-bg: var(--lt-bg-info-subtle);
  }

  /* round shape */
  :host([round]) [part='base'] {
    border-radius: 50%;
  }
`;
