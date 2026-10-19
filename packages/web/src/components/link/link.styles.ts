import { css } from 'lit';

export const linkStyles = css`
  :host {
    display: inline;
  }

  a[part='base'] {
    align-items: center;
    color: var(--lt-text-primary);
    cursor: pointer;
    display: inline-flex;
    font: inherit;
    gap: 0.25em;
    text-decoration: none;
    vertical-align: baseline;
  }

  a[part='base']:hover {
    color: var(--lt-text-primary);
    text-decoration: underline;
  }

  a[part='base']:focus-visible {
    border-radius: 2px;
    outline: 2px solid var(--lt-focus-ring-color);
    outline-offset: 2px;
  }

  lt-icon[part='icon'] {
    flex-shrink: 0;
  }

  /* ── Underline ──────────────────────────────────────────────────────── 'hover' (the default) is already the
     base behaviour above; these only need to override it for the other two modes. */

  :host([underline='always']) a[part='base'] {
    text-decoration: underline;
  }

  :host([underline='none']) a[part='base'],
  :host([underline='none']) a[part='base']:hover {
    text-decoration: none;
  }
`;
