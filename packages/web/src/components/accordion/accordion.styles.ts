import { css } from 'lit';

/**
 * Styles for the lt-accordion component.
 *
 * Includes:
 * - Native details/summary styling
 * - Smooth expand/collapse animation
 * - Visual variants (default, filled, outlined)
 * - Custom chevron icon
 * - Focus states for accessibility
 */
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

  /* Remove default marker */
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
    color: var(--lt-color-neutral-900);
    flex: 1;
    font-size: 1rem;
    font-weight: 500;
  }

  .chevron {
    color: var(--lt-color-neutral-600);
    flex-shrink: 0;
    height: 20px;
    transition: transform 200ms ease;
    width: 20px;
  }

  details[open] .chevron {
    transform: rotate(180deg);
  }

  summary:hover .chevron {
    color: var(--lt-color-neutral-900);
  }

  summary:focus-visible {
    outline: 3px solid var(--lt-color-primary-200);
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
    background: var(--lt-color-neutral-50);
    border: 1px solid var(--lt-color-neutral-200);
  }

  :host([variant='default']) details:hover {
    border-color: var(--lt-color-neutral-300);
  }

  /* Variant: filled */
  :host([variant='filled']) details {
    background: var(--lt-color-neutral-100);
    border: none;
  }

  :host([variant='filled']) details:hover {
    background: var(--lt-color-neutral-200);
  }

  /* Variant: outlined */
  :host([variant='outlined']) details {
    background: transparent;
    border: 1px solid var(--lt-color-neutral-300);
  }

  :host([variant='outlined']) details:hover {
    border-color: var(--lt-color-neutral-400);
  }

  /* Disabled state */
  :host([disabled]) details {
    opacity: 0.6;
    pointer-events: none;
  }
`;
