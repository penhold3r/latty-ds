import { css } from 'lit';

export const emptyStateStyles = css`
  :host {
    display: flex;
    font-family: 'Hanken Grotesk', sans-serif;
  }

  .empty-state {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: var(--lt-spacing-3);
    margin: 0 auto;
    padding: var(--lt-spacing-10) var(--lt-spacing-6);
    text-align: center;
  }

  :host([size='sm']) .empty-state {
    max-width: 320px;
  }
  :host([size='md']) .empty-state,
  :host(:not([size])) .empty-state {
    max-width: 440px;
  }
  :host([size='lg']) .empty-state {
    max-width: 560px;
  }

  .icon-wrap {
    align-items: center;
    background: var(--lt-bg-neutral-subtle);
    border-radius: 50%;
    color: var(--lt-color-neutral-500);
    display: flex;
    flex-shrink: 0;
    justify-content: center;
  }

  :host([size='sm']) .icon-wrap {
    height: 48px;
    width: 48px;
  }
  :host([size='md']) .icon-wrap,
  :host(:not([size])) .icon-wrap {
    height: 64px;
    width: 64px;
  }
  :host([size='lg']) .icon-wrap {
    height: 80px;
    width: 80px;
  }

  .title {
    color: var(--lt-text-default);
    font-size: 1.0625rem;
    font-weight: 600;
    line-height: 1.4;
    margin: 0;
  }

  :host([size='lg']) .title {
    font-size: 1.25rem;
  }
  :host([size='sm']) .title {
    font-size: 0.9375rem;
  }

  .description {
    color: var(--lt-text-subtle);
    font-size: 0.875rem;
    line-height: 1.6;
    margin: 0;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--lt-spacing-2);
    justify-content: center;
    margin-top: var(--lt-spacing-1);
  }

  .actions:empty {
    display: none;
  }
`;
