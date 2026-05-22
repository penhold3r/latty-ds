import { css } from 'lit';

export const badgeStyles = css`
  :host {
    display: inline-flex;
    font-family: 'Hanken Grotesk', sans-serif;
    vertical-align: middle;
  }

  span[part='base'] {
    align-items: center;
    background: var(--lt-badge-bg);
    border-radius: 999px;
    border: 1px solid var(--lt-badge-border-color, transparent);
    color: var(--lt-badge-color);
    box-sizing: border-box;
    display: inline-flex;
    font-weight: 600;
    gap: var(--lt-spacing-1);
    line-height: 1;
    user-select: none;
    white-space: nowrap;
  }

  .dot {
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* ── Sizes ──────────────────────────────────────────────────────────── */

  :host([size='sm']) span[part='base'] {
    font-size: 0.6875rem;
    height: 18px;
    padding-inline: var(--lt-spacing-2);
  }

  :host([size='sm']) .dot {
    height: 6px;
    width: 6px;
  }

  :host([size='md']) span[part='base'] {
    font-size: 0.75rem;
    height: 22px;
    padding-inline: var(--lt-spacing-2);
  }

  :host([size='md']) .dot {
    height: 7px;
    width: 7px;
  }

  :host([size='lg']) span[part='base'] {
    font-size: 0.8125rem;
    height: 26px;
    padding-inline: var(--lt-spacing-3);
  }

  :host([size='lg']) .dot {
    height: 8px;
    width: 8px;
  }

  /* When dot is the only content, fill it to the circle size */
  :host([dot][content='']) .dot,
  :host([dot]:not([content])) .dot {
    height: 40%;
    width: 40%;
  }

  /* ── Empty = perfect circle (covers content="" and absent attribute) */

  :host([content='']) span[part='base'],
  :host(:not([content])) span[part='base'] {
    aspect-ratio: 1;
    justify-content: center;
    padding: 0;
  }

  /* ── Filled (tinted bg, colored border, dark text) ───────────────── */

  :host([appearance='filled'][variant='primary']) span[part='base'] {
    background: var(--lt-bg-primary-subtle);
    border-color: var(--lt-border-primary);
    color: var(--lt-text-primary);
  }

  :host([appearance='filled'][variant='secondary']) span[part='base'] {
    background: var(--lt-bg-secondary-subtle);
    border-color: var(--lt-border-secondary);
    color: var(--lt-text-secondary);
  }

  :host([appearance='filled'][variant='success']) span[part='base'] {
    background: var(--lt-bg-success-subtle);
    border-color: var(--lt-border-success);
    color: var(--lt-text-success);
  }

  :host([appearance='filled'][variant='warning']) span[part='base'] {
    background: var(--lt-bg-warning-subtle);
    border-color: var(--lt-border-warning);
    color: var(--lt-text-warning);
  }

  :host([appearance='filled'][variant='error']) span[part='base'] {
    background: var(--lt-bg-error-subtle);
    border-color: var(--lt-border-error);
    color: var(--lt-text-error);
  }

  :host([appearance='filled'][variant='neutral']) span[part='base'] {
    background: var(--lt-bg-surface);
    border-color: var(--lt-border-default);
    color: var(--lt-text-neutral);
  }

  /* ── Outlined (transparent bg, colored border and text) ──────────── */

  :host([appearance='outlined'][variant='primary']) span[part='base'] {
    background: transparent;
    border-color: var(--lt-border-primary-strong);
    color: var(--lt-text-primary);
  }

  :host([appearance='outlined'][variant='secondary']) span[part='base'] {
    background: transparent;
    border-color: var(--lt-border-secondary-strong);
    color: var(--lt-text-secondary);
  }

  :host([appearance='outlined'][variant='success']) span[part='base'] {
    background: transparent;
    border-color: var(--lt-border-success-strong);
    color: var(--lt-text-success);
  }

  :host([appearance='outlined'][variant='warning']) span[part='base'] {
    background: transparent;
    border-color: var(--lt-border-warning-strong);
    color: var(--lt-text-warning);
  }

  :host([appearance='outlined'][variant='error']) span[part='base'] {
    background: transparent;
    border-color: var(--lt-border-error-strong);
    color: var(--lt-text-error);
  }

  :host([appearance='outlined'][variant='neutral']) span[part='base'] {
    background: transparent;
    border-color: var(--lt-border-strong);
    color: var(--lt-text-neutral);
  }

  /* ── Solid (full-color bg, white text) ───────────────────────────── */

  :host([appearance='solid'][variant='primary']) span[part='base'] {
    background: var(--lt-interactive-primary-bg);
    border-color: transparent;
    color: var(--lt-text-on-primary);
  }

  :host([appearance='solid'][variant='secondary']) span[part='base'] {
    background: var(--lt-interactive-secondary-bg);
    border-color: transparent;
    color: var(--lt-text-on-secondary);
  }

  :host([appearance='solid'][variant='success']) span[part='base'] {
    background: var(--lt-interactive-success-bg);
    border-color: transparent;
    color: var(--lt-text-on-success);
  }

  :host([appearance='solid'][variant='warning']) span[part='base'] {
    background: var(--lt-interactive-warning-bg);
    border-color: transparent;
    color: var(--lt-text-on-warning);
  }

  :host([appearance='solid'][variant='error']) span[part='base'] {
    background: var(--lt-interactive-error-bg);
    border-color: transparent;
    color: var(--lt-text-on-error);
  }

  :host([appearance='solid'][variant='neutral']) span[part='base'] {
    background: var(--lt-color-neutral-500);
    border-color: transparent;
    color: var(--lt-color-white);
  }

  /* ── Dot color inherits text color ───────────────────────────────── */
  .dot {
    background: currentColor;
  }
`;
