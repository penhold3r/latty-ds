import { css } from 'lit';

export const dividerStyles = css`
  :host {
    display: block;
  }

  :host([orientation='vertical']) {
    align-self: stretch;
    display: inline-flex;
    width: auto;
  }

  /* ── Horizontal ─────────────────────────────────────────────────────────── */

  :host([orientation='horizontal']) [part='base'],
  :host(:not([orientation])) [part='base'] {
    align-items: center;
    display: flex;
    width: 100%;
  }

  :host([orientation='horizontal']) [part='base']::before,
  :host(:not([orientation])) [part='base']::before,
  :host([orientation='horizontal']) [part='base']::after,
  :host(:not([orientation])) [part='base']::after {
    border-top: 1px solid var(--lt-border-default);
    border-top-style: var(--_divider-style, solid);
    content: '';
    flex: 1;
  }

  /* ── Vertical ───────────────────────────────────────────────────────────── */

  :host([orientation='vertical']) [part='base'] {
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  :host([orientation='vertical']) [part='base']::before,
  :host([orientation='vertical']) [part='base']::after {
    border-left: 1px solid var(--lt-border-default);
    border-left-style: var(--_divider-style, solid);
    content: '';
    flex: 1;
  }

  /* ── Label ──────────────────────────────────────────────────────────────── */

  [part='label'] {
    color: var(--lt-text-subtle);
    font-family: var(--lt-typography-fontFamily, 'Hanken Grotesk', sans-serif);
    font-size: 0.75rem;
    font-weight: 600;
    padding-inline: var(--lt-spacing-3);
    white-space: nowrap;
  }

  :host([orientation='vertical']) [part='label'] {
    padding-block: var(--lt-spacing-3);
    padding-inline: 0;
  }

  /* ── Appearances ────────────────────────────────────────────────────────── */

  :host([appearance='solid']) {
    --_divider-style: solid;
  }
  :host([appearance='dashed']) {
    --_divider-style: dashed;
  }
  :host([appearance='dotted']) {
    --_divider-style: dotted;
  }
`;
