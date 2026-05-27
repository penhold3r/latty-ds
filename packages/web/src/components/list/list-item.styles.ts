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

  lt-icon {
    flex-shrink: 0;
    color: var(--lt-color-neutral-500);
    font-size: inherit;
  }
`;
