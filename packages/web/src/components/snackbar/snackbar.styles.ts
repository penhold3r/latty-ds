import { css } from 'lit';

export const snackbarStyles = css`
  :host {
    display: block;
    bottom: 24px;
    left: 50%;
    max-width: calc(100vw - 48px);
    opacity: 0;
    position: fixed;
    transform: translateX(-50%) translateY(8px);
    transition: opacity 200ms ease, transform 200ms ease, visibility 200ms ease;
    visibility: hidden;
    width: max-content;
    z-index: 9000;
  }

  :host([open]) {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
    visibility: visible;
  }

  /* ── Layout ──────────────────────────────────────────────── */

  .inner {
    align-items: center;
    color: var(--lt-text-inverse);
    display: flex;
    font-family: 'Asap', sans-serif;
    font-size: 0.875rem;
    gap: var(--lt-spacing-2);
    line-height: 1.4;
    padding: var(--lt-spacing-3) var(--lt-spacing-4);
  }

  /* ── Variant text colors ─────────────────────────────────── */

  :host([variant='success']) .inner { color: var(--lt-text-on-success); }
  :host([variant='warning']) .inner { color: var(--lt-text-on-warning); }
  :host([variant='error']) .inner { color: var(--lt-text-on-error); }
  :host([variant='info']) .inner { color: var(--lt-text-on-info); }

  /* ── Variant icon ────────────────────────────────────────── */

  .variant-icon {
    flex-shrink: 0;
    font-size: 1.125rem;
  }

  /* ── Message ─────────────────────────────────────────────── */

  .message {
    flex: 1;
  }

  /* ── Action button ───────────────────────────────────────── */

  .action {
    background: transparent;
    border: none;
    color: inherit;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    opacity: 0.85;
    padding: 0 var(--lt-spacing-1);
    text-transform: uppercase;
  }

  .action:hover {
    opacity: 1;
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
    opacity: 0.7;
    padding: 0;
  }

  .close:hover {
    opacity: 1;
  }
`;
