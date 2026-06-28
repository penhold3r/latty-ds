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
`;
