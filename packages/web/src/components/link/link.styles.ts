import { css } from 'lit';

export const linkStyles = css`
  :host {
    display: inline;
  }

  a[part='base'] {
    align-items: center;
    color: var(--lt-interactive-primary-bg);
    cursor: pointer;
    display: inline-flex;
    font: inherit;
    gap: 0.25em;
    text-decoration: none;
    vertical-align: baseline;
  }

  a[part='base']:hover {
    color: var(--lt-interactive-primary-bg-hover);
    text-decoration: underline;
  }

  a[part='base']:focus-visible {
    border-radius: 2px;
    outline: 2px solid var(--lt-border-focus);
    outline-offset: 2px;
  }

  lt-icon[part='icon'] {
    flex-shrink: 0;
  }
`;
