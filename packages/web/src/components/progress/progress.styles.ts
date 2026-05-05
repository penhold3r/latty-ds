import { css } from 'lit';

export const progressStyles = css`
  :host {
    display: block;
  }

  [part='track'] {
    background: var(--lt-color-neutral-200);
    border-radius: 999px;
    overflow: hidden;
    width: 100%;
  }

  [part='fill'] {
    border-radius: 999px;
    height: 100%;
    transition: width 300ms ease;
  }

  /* ── Sizes ──────────────────────────────────────────────────────────────── */

  :host([size='sm']) [part='track'] { height: 4px; }
  :host([size='md']) [part='track'] { height: 8px; }
  :host([size='lg']) [part='track'] { height: 12px; }

  /* ── Variants ───────────────────────────────────────────────────────────── */

  :host([variant='primary']) [part='fill'] { background: var(--lt-interactive-primary-bg); }
  :host([variant='success']) [part='fill'] { background: var(--lt-bg-success-strong); }
  :host([variant='warning']) [part='fill'] { background: var(--lt-bg-warning-strong); }
  :host([variant='error']) [part='fill'] { background: var(--lt-bg-error-strong); }
  :host([variant='neutral']) [part='fill'] { background: var(--lt-color-neutral-600); }

  /* ── Indeterminate ──────────────────────────────────────────────────────── */

  :host([indeterminate]) [part='fill'] {
    animation: indeterminate 1.5s ease-in-out infinite;
    width: 40%;
  }

  @keyframes indeterminate {
    0% { transform: translateX(-250%); }
    100% { transform: translateX(350%); }
  }

  @media (prefers-reduced-motion: reduce) {
    [part='fill'] { transition: none; }
    :host([indeterminate]) [part='fill'] {
      animation: none;
      width: 100%;
    }
  }
`;
