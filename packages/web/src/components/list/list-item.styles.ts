import { css } from 'lit';

export const listItemStyles = css`
  :host {
    display: list-item;
    margin: 0;
    padding: 0;
  }

  .inner {
    display: flex;
    align-items: flex-start;
    gap: var(--lt-spacing-2);
  }

  /* Keep the slotted content as a single flex item so rich inline markup
     (strong, code, multiple text runs) flows as normal prose instead of each
     node becoming its own shrunk flex item. min-width: 0 lets it wrap. */
  .content {
    flex: 1 1 auto;
    min-width: 0;
  }

  lt-icon {
    flex-shrink: 0;
    color: var(--lt-color-neutral-500);
    font-size: inherit;
  }

  /* interactive rows — native button/anchor reset + states */
  a.inner,
  button.inner {
    background: transparent;
    border: none;
    border-radius: var(--lt-border-radius);
    box-sizing: border-box;
    color: inherit;
    cursor: pointer;
    font: inherit;
    margin: 0;
    padding: var(--lt-spacing-2);
    text-align: start;
    text-decoration: none;
    transition: background-color 120ms ease;
    width: 100%;
  }

  a.inner:hover:not([aria-disabled='true']),
  button.inner:hover:not([disabled]) {
    background: var(--lt-list-item-hover-bg, var(--lt-bg-subtle));
  }

  a.inner:active:not([aria-disabled='true']),
  button.inner:active:not([disabled]) {
    background: var(--lt-list-item-active-bg, var(--lt-bg-surface));
  }

  a.inner:focus-visible,
  button.inner:focus-visible {
    outline: 3px solid var(--lt-border-focus);
    outline-offset: -3px;
  }

  button.inner[disabled],
  a.inner[aria-disabled='true'] {
    cursor: not-allowed;
    opacity: 0.6;
    pointer-events: none;
  }
`;
