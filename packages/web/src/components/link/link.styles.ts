import { css } from 'lit';

export const linkStyles = css`
  :host {
    display: inline;
  }

  a[part='base'] {
    color: var(--lt-text-primary);
    cursor: pointer;
    font: inherit;
    text-decoration: none;
  }

  a[part='base']:hover {
    color: var(--lt-text-primary);
    text-decoration: underline;
  }

  a[part='base']:focus-visible {
    border-radius: 2px;
    outline: var(--lt-border-focusRingWidth) solid var(--lt-focus-ring-color);
    outline-offset: var(--lt-border-focusRingOffset);
  }

  lt-icon[part='icon'] {
    display: inline;
    margin-inline-start: 0.15em;
    vertical-align: baseline;
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

  .sr-only {
    border: 0;
    clip: rect(0, 0, 0, 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
`;
