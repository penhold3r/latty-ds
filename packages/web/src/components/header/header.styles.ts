import { css } from 'lit';

export const headerStyles = css`
  :host {
    display: block;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: var(--lt-elevation-1);
  }

  :host([variant='primary']) {
    background: var(--lt-bg-primary);
    color: var(--lt-text-inverse);
  }

  :host([variant='surface']) {
    background: var(--lt-bg-default);
    color: var(--lt-text-default);
  }

  header {
    display: flex;
    align-items: center;
    gap: var(--lt-spacing-2);
    padding: 0 var(--lt-spacing-4);
    min-height: var(--lt-spacing-px-16);
    box-sizing: border-box;
    color: inherit;
  }

  .content {
    flex: 1;
    display: flex;
    align-items: center;
  }
`;
