import { css } from 'lit';

export const switchStyles = css`
  :host {
    display: inline-block;
    font-family: var(--lt-typography-fontFamilyPrimary, 'Hanken Grotesk', sans-serif);
  }

  .switch-wrapper {
    align-items: center;
    cursor: pointer;
    display: inline-flex;
    gap: var(--lt-spacing-2);
  }

  :host([label-position='left']) .switch-wrapper {
    flex-direction: row-reverse;
  }

  /* :host(:disabled) — the browser matches this automatically for a form-associated element inside a
     disabled <fieldset>, no JS required; :host([disabled]) covers the component's own explicit attribute. */
  :host([disabled]) .switch-wrapper,
  :host(:disabled) .switch-wrapper {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .switch-container {
    display: inline-flex;
    position: relative;
  }

  input[type='checkbox'] {
    appearance: none;
    background: var(--lt-border-default);
    border-radius: 999px;
    cursor: pointer;
    flex-shrink: 0;
    margin: 0;
    position: relative;
    transition: background-color var(--lt-duration-moderate) ease;
  }

  input[type='checkbox']:hover:not(:disabled) {
    background: var(--lt-border-strong);
  }

  input[type='checkbox']:focus-visible {
    outline: 3px solid var(--lt-focus-ring-color);
    outline-offset: 2px;
  }

  input[type='checkbox']:disabled {
    cursor: not-allowed;
  }

  .thumb {
    background: white;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgb(var(--lt-shadow-rgb) / 0.2);
    pointer-events: none;
    position: absolute;
    transition: left var(--lt-duration-moderate) ease;
  }

  .label {
    color: var(--lt-text-default);
    user-select: none;
  }

  .helper-text {
    color: var(--lt-text-subtle);
    display: block;
    margin-top: var(--lt-spacing-1);
  }

  .helper-text::part(base) {
    font-weight: 200;
  }

  :host([variant='error']) .helper-text {
    color: var(--lt-text-error);
  }

  /* Size variants */
  :host([size='sm']) input[type='checkbox'] {
    height: 18px;
    width: 32px;
  }

  :host([size='sm']) .thumb {
    height: 14px;
    width: 14px;
    left: 2px;
    top: 2px;
  }

  :host([size='sm']) input[type='checkbox']:checked ~ .thumb {
    left: 16px;
  }

  :host([size='sm']) .label {
    font-size: 0.875rem;
  }

  :host([size='md']) input[type='checkbox'] {
    height: 22px;
    width: 40px;
  }

  :host([size='md']) .thumb {
    height: 18px;
    width: 18px;
    left: 2px;
    top: 2px;
  }

  :host([size='md']) input[type='checkbox']:checked ~ .thumb {
    left: 20px;
  }

  :host([size='md']) .label {
    font-size: 1rem;
  }

  :host([size='lg']) input[type='checkbox'] {
    height: 26px;
    width: 48px;
  }

  :host([size='lg']) .thumb {
    height: 22px;
    width: 22px;
    left: 2px;
    top: 2px;
  }

  :host([size='lg']) input[type='checkbox']:checked ~ .thumb {
    left: 24px;
  }

  :host([size='lg']) .label {
    font-size: 1.0625rem;
  }

  /* Variant styles */
  :host([variant='primary']) input[type='checkbox']:checked {
    background: var(--lt-interactive-primary-bg);
  }
  :host([variant='primary']) input[type='checkbox']:checked:hover:not(:disabled) {
    background: var(--lt-interactive-primary-bg-hover);
  }

  :host([variant='secondary']) input[type='checkbox']:checked {
    background: var(--lt-interactive-secondary-bg);
  }
  :host([variant='secondary']) input[type='checkbox']:checked:hover:not(:disabled) {
    background: var(--lt-interactive-secondary-bg-hover);
  }

  :host([variant='success']) input[type='checkbox']:checked {
    background: var(--lt-interactive-success-bg);
  }
  :host([variant='success']) input[type='checkbox']:checked:hover:not(:disabled) {
    background: var(--lt-interactive-success-bg-hover);
  }

  :host([variant='error']) input[type='checkbox']:checked {
    background: var(--lt-interactive-error-bg);
  }
  :host([variant='error']) input[type='checkbox']:checked:hover:not(:disabled) {
    background: var(--lt-interactive-error-bg-hover);
  }

  :host([variant='info']) input[type='checkbox']:checked {
    background: var(--lt-interactive-info-bg);
  }
  :host([variant='info']) input[type='checkbox']:checked:hover:not(:disabled) {
    background: var(--lt-interactive-info-bg-hover);
  }

  /* ── Reduced motion ─────────────────────────────────────────────────────── */

  @media (prefers-reduced-motion: reduce) {
    input[type='checkbox'],
    .thumb {
      transition: none;
    }
  }

  /* ── Forced colors (Windows High Contrast) ─────────────────────────────────
     Under forced-colors, every author background-color here (the unchecked track's neutral fill, every
     variant's checked fill, and the thumb's plain white) is flattened to Canvas — the track has no border of
     its own to fall back on, and the thumb disappears into it, leaving neither track nor thumb visible at all.
     System color keywords are exempt from that flattening; Highlight/HighlightText is the canonical OS
     "selected state" pairing, unaffected by which variant was selected (forced-colors overrides that anyway).
     !important matches every variant's own :checked rule in specificity — standard for a forced-colors
     override, whose entire point is overriding the page's own author styling. ─────────────────────────────── */

  @media (forced-colors: active) {
    input[type='checkbox'] {
      border: 1px solid ButtonText;
    }

    input[type='checkbox']:checked {
      background: Highlight !important;
      border-color: Highlight !important;
    }

    .thumb {
      background: ButtonText;
    }

    input[type='checkbox']:checked ~ .thumb {
      background: HighlightText;
    }
  }
`;
