import { css } from 'lit';

export const tabStyles = css`
  :host {
    display: inline-block;
    font-family: var(--lt-typography-fontFamilyPrimary, 'Hanken Grotesk', sans-serif);
  }

  .tab {
    align-items: center;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--lt-text-subtle);
    cursor: pointer;
    display: flex;
    font-family: inherit;
    font-size: 0.9375rem;
    font-weight: 600;
    gap: var(--lt-spacing-2);
    outline: none;
    padding: var(--lt-spacing-3) var(--lt-spacing-4);
    transition:
      color 150ms ease,
      border-color 150ms ease;
    user-select: none;
    white-space: nowrap;
  }

  :host(:not([disabled])):hover .tab {
    color: var(--lt-text-default);
  }

  :host(:focus-visible) .tab {
    color: var(--lt-text-primary);
    outline: 2px solid var(--lt-border-focus);
    outline-offset: 2px;
  }

  :host([active]) .tab {
    border-color: var(--lt-border-primary-strong);
    color: var(--lt-text-primary);
  }

  :host([disabled]) .tab {
    color: var(--lt-text-disabled);
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

  /* ── Vertical orientation ─────────────────────────────────────────────── The active indicator moves from the
     bottom edge to the inline-start (leading) edge, so it stays legible when tabs stack in a column instead of
     a row. */
  :host([orientation='vertical']) .tab {
    border-bottom: none;
    border-inline-start: 2px solid transparent;
  }

  :host([orientation='vertical'][active]) .tab {
    border-inline-start-color: var(--lt-border-primary-strong);
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
    background: var(--lt-bg-default);
    box-shadow: 0 1px 3px 0 rgb(var(--lt-shadow-rgb) / 0.1);
    color: var(--lt-text-primary);
  }

  /* ── Reduced motion ─────────────────────────────────────────────────────── */

  @media (prefers-reduced-motion: reduce) {
    /* :host([data-variant='pills']) .tab must be listed explicitly, not just .tab — it outranks a bare .tab in
       specificity (an extra :host() attribute selector), so it would otherwise keep its own transition. */
    .tab,
    :host([data-variant='pills']) .tab {
      transition: none;
    }
  }
`;
