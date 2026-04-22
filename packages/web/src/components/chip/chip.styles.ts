import { css } from 'lit';

export const chipStyles = css`
  :host {
    display: inline-flex;
    font-family: 'Asap', sans-serif;
    vertical-align: middle;
  }

  span[part='base'] {
    align-items: center;
    border-radius: 999px;
    border: 1px solid transparent;
    box-sizing: border-box;
    display: inline-flex;
    font-weight: 400;
    line-height: 1;
    transition: background-color 120ms ease, border-color 120ms ease;
    user-select: none;
    white-space: nowrap;
  }

  ::slotted([slot='icon']) {
    flex-shrink: 0;
  }

  .delete {
    align-items: center;
    background: none;
    border-radius: 999px;
    border: none;
    color: inherit;
    cursor: pointer;
    display: inline-flex;
    flex-shrink: 0;
    justify-content: center;
    opacity: 0.6;
    padding: 0;
    transition: opacity 120ms ease, background-color 120ms ease;
  }

  .delete:hover:not(:disabled) {
    opacity: 1;
  }

  .delete:disabled {
    cursor: not-allowed;
  }

  :host([disabled]) span[part='base'] {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: none;
  }

  /* ── Sizes ────────────────────────────────────────────────────────────── */
  :host([size='sm']) span[part='base'] {
    font-size: 0.75rem;
    gap: var(--lt-spacing-1);
    height: 20px;
    padding-inline: var(--lt-spacing-2);
  }

  :host([size='md']) span[part='base'] {
    font-size: 0.8125rem;
    gap: var(--lt-spacing-1);
    height: 26px;
    padding-inline: var(--lt-spacing-3);
  }

  :host([size='lg']) span[part='base'] {
    font-size: 0.9375rem;
    gap: var(--lt-spacing-2);
    height: 32px;
    padding-inline: var(--lt-spacing-4);
  }

  /* ── Filled (tinted bg, colored border, dark text) ───────────────────── */
  :host([appearance='filled'][variant='primary']) span[part='base'] {
    background: var(--lt-bg-primary-subtle);
    border-color: var(--lt-border-primary);
    color: var(--lt-color-primary-800);
  }

  :host([appearance='filled'][variant='secondary']) span[part='base'] {
    background: var(--lt-bg-secondary-subtle);
    border-color: var(--lt-border-secondary);
    color: var(--lt-color-secondary-800);
  }

  :host([appearance='filled'][variant='neutral']) span[part='base'] {
    background: var(--lt-bg-surface);
    border-color: var(--lt-border-default);
    color: var(--lt-color-neutral-700);
  }

  :host([appearance='filled'][variant='success']) span[part='base'] {
    background: var(--lt-bg-success-subtle);
    border-color: var(--lt-border-success);
    color: var(--lt-color-success-800);
  }

  :host([appearance='filled'][variant='warning']) span[part='base'] {
    background: var(--lt-bg-warning-subtle);
    border-color: var(--lt-border-warning);
    color: var(--lt-color-warning-800);
  }

  :host([appearance='filled'][variant='error']) span[part='base'] {
    background: var(--lt-bg-error-subtle);
    border-color: var(--lt-border-error);
    color: var(--lt-color-error-800);
  }

  :host([appearance='filled'][variant='info']) span[part='base'] {
    background: var(--lt-bg-info-subtle);
    border-color: var(--lt-border-info);
    color: var(--lt-color-info-800);
  }

  /* ── Outlined (transparent bg, colored border and text) ──────────────── */
  :host([appearance='outlined'][variant='primary']) span[part='base'] {
    background: transparent;
    border-color: var(--lt-border-primary-strong);
    color: var(--lt-color-primary-600);
  }

  :host([appearance='outlined'][variant='secondary']) span[part='base'] {
    background: transparent;
    border-color: var(--lt-border-secondary-strong);
    color: var(--lt-color-secondary-600);
  }

  :host([appearance='outlined'][variant='neutral']) span[part='base'] {
    background: transparent;
    border-color: var(--lt-border-strong);
    color: var(--lt-color-neutral-700);
  }

  :host([appearance='outlined'][variant='success']) span[part='base'] {
    background: transparent;
    border-color: var(--lt-border-success-strong);
    color: var(--lt-color-success-600);
  }

  :host([appearance='outlined'][variant='warning']) span[part='base'] {
    background: transparent;
    border-color: var(--lt-border-warning-strong);
    color: var(--lt-color-warning-700);
  }

  :host([appearance='outlined'][variant='error']) span[part='base'] {
    background: transparent;
    border-color: var(--lt-border-error-strong);
    color: var(--lt-color-error-600);
  }

  :host([appearance='outlined'][variant='info']) span[part='base'] {
    background: transparent;
    border-color: var(--lt-border-info-strong);
    color: var(--lt-color-info-600);
  }
`;
