import { css } from 'lit';

export const progressStyles = css`
  :host {
    display: block;
  }

  :host {
    --_fill-color: var(--lt-interactive-primary-bg);
  }

  :host([variant='primary']) {
    --_fill-color: var(--lt-interactive-primary-bg);
  }
  :host([variant='success']) {
    --_fill-color: var(--lt-interactive-success-bg);
  }
  :host([variant='warning']) {
    --_fill-color: var(--lt-interactive-warning-bg);
  }
  :host([variant='error']) {
    --_fill-color: var(--lt-interactive-error-bg);
  }
  :host([variant='neutral']) {
    --_fill-color: var(--lt-color-neutral-600);
  }

  [part='track'] {
    background: var(--lt-progress-track-color, var(--lt-color-neutral-200));
    border-radius: 999px;
    overflow: hidden;
    width: 100%;
  }

  [part='fill'] {
    background: var(--lt-progress-color, var(--_fill-color));
    border-radius: 999px;
    height: 100%;
    transition: width 300ms ease;
  }

  /* ── Sizes ──────────────────────────────────────────────────────────────── */

  :host([size='sm']) [part='track'] {
    height: var(--lt-progress-height, 4px);
  }
  :host([size='md']) [part='track'] {
    height: var(--lt-progress-height, 8px);
  }
  :host([size='lg']) [part='track'] {
    height: var(--lt-progress-height, 12px);
  }

  /* ── Indeterminate ──────────────────────────────────────────────────────── */

  :host([indeterminate]) [part='fill'] {
    animation: indeterminate 1.5s ease-in-out infinite;
    width: 40%;
  }

  @keyframes indeterminate {
    0% {
      transform: translateX(-250%);
    }
    100% {
      transform: translateX(350%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    [part='fill'] {
      transition: none;
    }
    :host([indeterminate]) [part='fill'] {
      animation: none;
      width: 100%;
    }
  }
`;
