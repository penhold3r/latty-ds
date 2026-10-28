import { css } from 'lit';

export const dropdownItemStyles = css`
  :host {
    display: block;
  }

  .item {
    align-items: center;
    background: none;
    border: none;
    border-radius: 0;
    color: var(--lt-text-default);
    cursor: pointer;
    display: flex;
    font-family: var(--lt-typography-fontFamilyPrimary, 'Hanken Grotesk', sans-serif);
    font-size: 0.875rem;
    gap: var(--lt-spacing-2);
    padding: var(--lt-spacing-2) var(--lt-spacing-4);
    text-align: start;
    text-decoration: none;
    width: 100%;
  }

  .item:hover {
    background: var(--lt-bg-neutral-subtle);
  }

  .item:focus-visible {
    background: var(--lt-bg-neutral-subtle);
    outline: var(--lt-border-focusRingWidth) solid var(--lt-focus-ring-color);
    outline-offset: calc(-1 * var(--lt-border-focusRingWidth));
  }

  .item:active {
    background: var(--lt-bg-overlay);
  }

  :host([selected]) .item {
    background: var(--lt-bg-primary-subtle);
    color: var(--lt-text-primary);
    font-weight: 600;
  }

  :host([disabled]) {
    pointer-events: none;
  }

  :host([disabled]) .item {
    color: var(--lt-text-disabled);
    cursor: not-allowed;
  }
`;
