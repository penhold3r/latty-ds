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
    --_fill-color: var(--lt-interactive-neutral-bg);
  }

  [part='track'] {
    background: var(--lt-progress-track-color, var(--lt-bg-overlay));
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

  /* ── Forced colors (Windows High Contrast) ─────────────────────────────────
     Under forced-colors, both the track's neutral background and the fill's variant-coloured background are
     flattened to Canvas, with no border on the track to fall back on — the whole bar disappears. A border on
     the track (its boundary) plus a Highlight-coloured fill (the OS's own "active/selected" system color,
     exempt from the flattening) keeps the progress amount legible regardless of which variant was set —
     forced-colors mode overrides variant branding anyway, by design. ───────────────────────────────────────── */

  @media (forced-colors: active) {
    [part='track'] {
      border: 1px solid CanvasText;
    }

    [part='fill'] {
      background: Highlight;
    }
  }
`;
