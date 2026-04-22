import { css } from 'lit';

export const accordionStyles = css`
  :host {
    display: block;
    font-family: 'Asap', sans-serif;
    width: 100%;
  }

  details {
    border-radius: var(--lt-border-radius);
    transition:
      background-color 120ms ease,
      border-color 120ms ease;
  }

  summary {
    cursor: pointer;
    list-style: none;
    user-select: none;
    border-radius: var(--lt-border-radius);
    overflow: hidden;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  .summary-content {
    align-items: center;
    display: flex;
    gap: var(--lt-spacing-3);
    justify-content: space-between;
    padding: var(--lt-spacing-4);
  }

  .start-icon {
    color: var(--lt-color-neutral-700);
    flex-shrink: 0;
    font-size: 1.25rem;
  }

  .summary-text {
    color: var(--lt-text-default);
    flex: 1;
    font-size: 1rem;
    font-weight: 500;
  }

  .chevron {
    color: var(--lt-text-subtle);
    flex-shrink: 0;
    height: 20px;
    transition: transform 200ms ease;
    width: 20px;
  }

  details[open] .chevron {
    transform: rotate(180deg);
  }

  summary:hover .chevron {
    color: var(--lt-text-default);
  }

  summary:focus-visible {
    outline: 3px solid var(--lt-border-focus);
    outline-offset: -3px;
  }

  .content {
    height: 0;
    overflow: hidden;
    transition: height 200ms ease;
  }

  .content-inner {
    color: var(--lt-color-neutral-700);
    font-size: 0.9375rem;
    line-height: 1.6;
    padding: 0 var(--lt-spacing-4) var(--lt-spacing-4);
  }

  /* Variant: default */
  :host([variant='default']) details {
    background: var(--lt-bg-subtle);
    border: 1px solid var(--lt-border-default);
  }

  :host([variant='default']) details:hover {
    border-color: var(--lt-color-neutral-300);
  }

  /* Variant: filled */
  :host([variant='filled']) details {
    background: var(--lt-bg-surface);
    border: none;
  }

  :host([variant='filled']) details:hover {
    background: var(--lt-bg-overlay);
  }

  /* Variant: outlined */
  :host([variant='outlined']) details {
    background: transparent;
    border: 1px solid var(--lt-color-neutral-300);
  }

  :host([variant='outlined']) details:hover {
    border-color: var(--lt-border-strong);
  }

  /* Disabled state */
  :host([disabled]) details {
    opacity: 0.6;
    pointer-events: none;
  }
`;
