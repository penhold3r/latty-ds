import { css } from 'lit';

export const radioStyles = css`
  :host {
    display: inline-block;
    font-family: var(--lt-typography-fontFamilyPrimary, 'Hanken Grotesk', sans-serif);
  }

  .radio-wrapper {
    align-items: center;
    cursor: pointer;
    display: inline-flex;
    gap: var(--lt-spacing-2);
  }

  .radio-container {
    display: inline-flex;
    position: relative;
  }

  :host([label-position='left']) .radio-wrapper {
    flex-direction: row-reverse;
  }

  /* :host(:disabled) — the browser matches this automatically for a form-associated element inside a
     disabled <fieldset>, no JS required; :host([disabled]) covers the component's own explicit attribute. */
  :host([disabled]) .radio-wrapper,
  :host(:disabled) .radio-wrapper {
    cursor: not-allowed;
    opacity: 0.6;
  }

  input[type='radio'] {
    appearance: none;
    border-radius: 50%;
    border: 2px solid var(--lt-border-strong);
    cursor: pointer;
    flex-shrink: 0;
    margin: 0;
    position: relative;
    transition:
      background-color var(--lt-duration-fast) var(--lt-ease-standard),
      border-color var(--lt-duration-fast) var(--lt-ease-standard);
  }

  input[type='radio']:hover:not(:disabled) {
    border-color: var(--lt-interactive-neutral-bg);
  }

  input[type='radio']:focus-visible {
    outline: var(--lt-border-focusRingWidth) solid var(--lt-focus-ring-color);
    outline-offset: var(--lt-border-focusRingOffset);
  }

  input[type='radio']:disabled {
    cursor: not-allowed;
  }

  .dot {
    background: white;
    border-radius: 50%;
    display: none;
    pointer-events: none;
    position: absolute;
  }

  input[type='radio']:checked ~ .dot {
    display: block;
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
  :host([size='sm']) input[type='radio'] {
    height: 16px;
    width: 16px;
  }

  :host([size='sm']) .dot {
    height: 8px;
    width: 8px;
    inset-inline-start: 4px;
    top: 4px;
  }

  :host([size='sm']) .label {
    font-size: 0.875rem;
  }

  :host([size='md']) input[type='radio'] {
    height: 20px;
    width: 20px;
  }

  :host([size='md']) .dot {
    height: 10px;
    width: 10px;
    inset-inline-start: 5px;
    top: 5px;
  }

  :host([size='md']) .label {
    font-size: 1rem;
  }

  :host([size='lg']) input[type='radio'] {
    height: 24px;
    width: 24px;
  }

  :host([size='lg']) .dot {
    height: 12px;
    width: 12px;
    inset-inline-start: 6px;
    top: 6px;
  }

  :host([size='lg']) .label {
    font-size: 1.0625rem;
  }

  /* Variant styles */
  :host([variant='primary']) input[type='radio']:checked {
    background: var(--lt-interactive-primary-bg);
    border-color: var(--lt-interactive-primary-bg);
  }
  :host([variant='primary']) input[type='radio']:checked:hover:not(:disabled) {
    background: var(--lt-interactive-primary-bg-hover);
    border-color: var(--lt-interactive-primary-bg-hover);
  }

  :host([variant='secondary']) input[type='radio']:checked {
    background: var(--lt-interactive-secondary-bg);
    border-color: var(--lt-interactive-secondary-bg);
  }
  :host([variant='secondary']) input[type='radio']:checked:hover:not(:disabled) {
    background: var(--lt-interactive-secondary-bg-hover);
    border-color: var(--lt-interactive-secondary-bg-hover);
  }

  :host([variant='success']) input[type='radio']:checked {
    background: var(--lt-interactive-success-bg);
    border-color: var(--lt-interactive-success-bg);
  }
  :host([variant='success']) input[type='radio']:checked:hover:not(:disabled) {
    background: var(--lt-interactive-success-bg-hover);
    border-color: var(--lt-interactive-success-bg-hover);
  }

  :host([variant='error']) input[type='radio']:checked {
    background: var(--lt-interactive-error-bg);
    border-color: var(--lt-interactive-error-bg);
  }
  :host([variant='error']) input[type='radio']:checked:hover:not(:disabled) {
    background: var(--lt-interactive-error-bg-hover);
    border-color: var(--lt-interactive-error-bg-hover);
  }

  :host([variant='info']) input[type='radio']:checked {
    background: var(--lt-interactive-info-bg);
    border-color: var(--lt-interactive-info-bg);
  }
  :host([variant='info']) input[type='radio']:checked:hover:not(:disabled) {
    background: var(--lt-interactive-info-bg-hover);
    border-color: var(--lt-interactive-info-bg-hover);
  }

  /* ── Reduced motion ─────────────────────────────────────────────────────── */

  @media (prefers-reduced-motion: reduce) {
    input[type='radio'] {
      transition: none;
    }
  }

  /* ── Forced colors (Windows High Contrast) ─────────────────────────────────
     Under forced-colors, any author background-color (including every variant's token-resolved fill above) is
     flattened to Canvas — the checked indicator is a plain background:white .dot with no border of its own, so
     it disappears into the input's own (also-flattened) background, leaving checked and unchecked visually
     identical. System color keywords are exempt from that flattening and always resolve to the OS's own
     guaranteed-contrasting palette, regardless of which variant was selected — Highlight/HighlightText is the
     canonical "selected state" pairing (the same pair the OS uses for native text selection), unaffected by
     this component's own --lt-* tokens, which forced-colors mode is specifically overriding. !important is
     needed since a variant rule like :host([variant='primary']) input:checked outranks a bare
     input[type='radio']:checked in specificity — this is the standard, accepted use of !important for a
     forced-colors override (overriding the page's own author styling is the entire point). ─────────────────── */

  @media (forced-colors: active) {
    input[type='radio']:checked {
      background: Highlight !important;
      border-color: Highlight !important;
    }

    .dot {
      background: HighlightText !important;
    }
  }
`;
