import { css } from 'lit';

export const paginationStyles = css`
  :host {
    display: inline-flex;
    font-family: var(--lt-typography-fontFamily, 'Hanken Grotesk', sans-serif);
  }

  nav {
    align-items: center;
    display: flex;
    gap: var(--lt-spacing-1);
  }

  button {
    align-items: center;
    background: transparent;
    border-radius: var(--lt-border-radius);
    border: 1px solid transparent;
    color: var(--lt-text-default);
    cursor: pointer;
    display: inline-flex;
    font-family: inherit;
    font-weight: 500;
    justify-content: center;
    line-height: 1;
    transition:
      background 120ms ease,
      border-color 120ms ease,
      color 120ms ease;
    user-select: none;
  }

  /* Sizes */
  :host([size='sm']) button {
    font-size: 0.75rem;
    height: 28px;
    min-width: 28px;
    padding: 0 var(--lt-spacing-1);
  }
  :host([size='md']) button,
  :host(:not([size])) button {
    font-size: 0.8125rem;
    height: 36px;
    min-width: 36px;
    padding: 0 var(--lt-spacing-2);
  }
  :host([size='lg']) button {
    font-size: 0.9375rem;
    height: 44px;
    min-width: 44px;
    padding: 0 var(--lt-spacing-3);
  }

  button:hover:not(:disabled) {
    background: var(--lt-bg-neutral-subtle);
    border-color: var(--lt-border-default);
  }

  button[aria-current='page'] {
    background: var(--lt-bg-primary-subtle);
    border-color: var(--lt-border-primary);
    color: var(--lt-color-primary-700);
    font-weight: 600;
  }

  button.ellipsis {
    cursor: default;
    pointer-events: none;
  }

  button:disabled {
    color: var(--lt-color-neutral-400);
    cursor: not-allowed;
  }

  :host([disabled]) button {
    color: var(--lt-color-neutral-400);
    cursor: not-allowed;
    pointer-events: none;
  }
`;
