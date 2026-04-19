import { css } from 'lit';

/**
 * Styles for the lt-tab component.
 */
export const tabStyles = css`
  :host {
    display: inline-block;
    font-family: 'Asap', sans-serif;
  }

  .tab {
    align-items: center;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--lt-color-neutral-600);
    cursor: pointer;
    display: flex;
    font-family: inherit;
    font-size: 0.9375rem;
    font-weight: 500;
    gap: var(--lt-spacing-2);
    outline: none;
    padding: var(--lt-spacing-3) var(--lt-spacing-4);
    transition:
      color 150ms ease,
      border-color 150ms ease;
    user-select: none;
    white-space: nowrap;
  }

  .tab:hover:not(:disabled) {
    color: var(--lt-color-neutral-900);
  }

  .tab:focus-visible {
    color: var(--lt-color-primary-600);
    outline: 2px solid var(--lt-color-primary-200);
    outline-offset: 2px;
  }

  :host([active]) .tab {
    border-color: var(--lt-color-primary-500);
    color: var(--lt-color-primary-600);
  }

  .tab:disabled {
    color: var(--lt-color-neutral-300);
    cursor: not-allowed;
    opacity: 0.5;
  }

  .icon {
    font-size: 1.125rem;
  }

  /* Size variants */
  :host([size='sm']) .tab {
    font-size: 0.875rem;
    padding: var(--lt-spacing-2) var(--lt-spacing-3);
  }

  :host([size='sm']) .icon {
    font-size: 1rem;
  }

  :host([size='lg']) .tab {
    font-size: 1rem;
    padding: var(--lt-spacing-4) var(--lt-spacing-5);
  }

  :host([size='lg']) .icon {
    font-size: 1.25rem;
  }

  /* Pills variant (applied by parent tab-group) */
  :host([data-variant='pills']) .tab {
    border-bottom: none;
    border-radius: var(--lt-border-radius);
    transition:
      color 150ms ease,
      background-color 150ms ease,
      box-shadow 150ms ease;
  }

  :host([data-variant='pills'][active]) .tab {
    background: var(--lt-color-neutral-0);
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
    color: var(--lt-color-primary-600);
  }
`;
