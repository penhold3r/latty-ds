import { css } from 'lit';

/**
 * Styles for the lt-tab-group component.
 */
export const tabGroupStyles = css`
  :host {
    display: block;
    font-family: 'Asap', sans-serif;
  }

  .tab-group {
    display: flex;
    flex-direction: column;
  }

  .tabs-container {
    border-bottom: 1px solid var(--lt-color-neutral-200);
    display: flex;
    gap: var(--lt-spacing-1);
    overflow-x: auto;
    scrollbar-width: thin;
  }

  .tabs-container::-webkit-scrollbar {
    height: 4px;
  }

  .tabs-container::-webkit-scrollbar-track {
    background: var(--lt-color-neutral-100);
  }

  .tabs-container::-webkit-scrollbar-thumb {
    background: var(--lt-color-neutral-300);
    border-radius: 2px;
  }

  .panels-container {
    padding: var(--lt-spacing-4) 0;
  }

  ::slotted([slot='panel']) {
    display: none;
  }

  ::slotted([slot='panel'][active]) {
    display: block;
  }

  /* Pills variant */
  :host([variant='pills']) .tabs-container {
    background: var(--lt-color-neutral-100);
    border: none;
    border-radius: var(--lt-border-radius);
    gap: var(--lt-spacing-2);
    padding: var(--lt-spacing-1);
  }
`;
