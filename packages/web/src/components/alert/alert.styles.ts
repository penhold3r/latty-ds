import { css } from 'lit';

export const alertStyles = css`
  :host {
    display: block;
    font-family: 'Asap', sans-serif;
    opacity: 1;
    transform: translateY(0);
    transition: opacity 200ms ease, transform 200ms ease;

    /* Default variant tokens */
    --_bg-subtle: var(--lt-bg-neutral-subtle);
    --_bg-solid: var(--lt-bg-inverse);
    --_border: var(--lt-border-strong);
    --_color: var(--lt-text-default);
    --_color-solid: var(--lt-text-inverse);
  }

  :host([dismissed]) {
    opacity: 0;
    transform: translateY(-4px);
  }

  /* ── Per-variant tokens ──────────────────────────────────── */

  :host([variant='success']) {
    --_bg-subtle: var(--lt-bg-success-subtle);
    --_bg-solid: var(--lt-bg-success);
    --_border: var(--lt-border-success-strong);
    --_color: var(--lt-text-success);
    --_color-solid: var(--lt-text-on-success);
  }

  :host([variant='warning']) {
    --_bg-subtle: var(--lt-bg-warning-subtle);
    --_bg-solid: var(--lt-bg-warning);
    --_border: var(--lt-border-warning-strong);
    --_color: var(--lt-text-warning);
    --_color-solid: var(--lt-text-on-warning);
  }

  :host([variant='error']) {
    --_bg-subtle: var(--lt-bg-error-subtle);
    --_bg-solid: var(--lt-bg-error);
    --_border: var(--lt-border-error-strong);
    --_color: var(--lt-text-error);
    --_color-solid: var(--lt-text-on-error);
  }

  :host([variant='info']) {
    --_bg-subtle: var(--lt-bg-info-subtle);
    --_bg-solid: var(--lt-bg-info);
    --_border: var(--lt-border-info-strong);
    --_color: var(--lt-text-info);
    --_color-solid: var(--lt-text-on-info);
  }

  /* ── Layout ──────────────────────────────────────────────── */

  .inner {
    align-items: flex-start;
    border-radius: var(--lt-border-radius);
    display: flex;
    gap: var(--lt-spacing-3);
    padding: var(--lt-spacing-3) var(--lt-spacing-4);
  }

  /* ── Appearances ─────────────────────────────────────────── */

  /* filled (default) — subtle tinted bg + full border */
  :host([appearance='filled']) .inner,
  :host(:not([appearance])) .inner {
    background: var(--_bg-subtle);
    border: 1px solid var(--_border);
    color: var(--_color);
  }

  /* outlined — white bg + colored border */
  :host([appearance='outlined']) .inner {
    background: var(--lt-bg-default);
    border: 1px solid var(--_border);
    color: var(--_color);
  }

  /* solid — solid color bg, no border */
  :host([appearance='solid']) .inner {
    background: var(--_bg-solid);
    border: none;
    color: var(--_color-solid);
  }

  /* ── Icon ────────────────────────────────────────────────── */

  .icon {
    flex-shrink: 0;
    font-size: 1.125rem;
    margin-top: 1px;
  }

  /* ── Body ────────────────────────────────────────────────── */

  .body {
    flex: 1;
    min-width: 0;
  }

  .title {
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.4;
    margin: 0 0 var(--lt-spacing-1);
  }

  .content {
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .title + .content {
    opacity: 0.8;
  }

  /* ── Close button ────────────────────────────────────────── */

  .close {
    align-items: center;
    background: transparent;
    border: none;
    color: inherit;
    cursor: pointer;
    display: flex;
    flex-shrink: 0;
    justify-content: center;
    margin-top: 1px;
    opacity: 0.6;
    padding: 0;
  }

  .close:hover {
    opacity: 1;
  }
`;
