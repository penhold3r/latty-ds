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
    font-family: 'Asap', sans-serif;
    font-size: 0.875rem;
    gap: var(--lt-spacing-2);
    padding: var(--lt-spacing-2) var(--lt-spacing-4);
    text-align: left;
    text-decoration: none;
    width: 100%;
  }

  .item:hover,
  .item:focus-visible {
    background: var(--lt-bg-neutral-subtle);
    outline: none;
  }

  .item:active {
    background: var(--lt-bg-overlay);
  }

  :host([selected]) .item {
    background: var(--lt-bg-primary-subtle);
    color: var(--lt-text-primary);
    font-weight: 500;
  }

  :host([disabled]) {
    pointer-events: none;
  }

  :host([disabled]) .item {
    color: var(--lt-text-disabled);
    cursor: not-allowed;
  }

`;
