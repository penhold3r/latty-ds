import { css } from 'lit';

export const spinnerStyles = css`
  :host {
    --lt-spinner-size: var(--lt-spacing-4, 1rem);
    --lt-spinner-color: currentColor;

    display: inline-block;
    line-height: 0;
  }

  /* Sizes */
  :host([size='sm']) {
    --lt-spinner-size: var(--lt-spacing-3, 0.75rem);
  }
  :host([size='md']) {
    --lt-spinner-size: var(--lt-spacing-4, 1rem);
  }
  :host([size='lg']) {
    --lt-spinner-size: var(--lt-spacing-6, 1.5rem);
  }

  /* Color */
  :host([variant='primary']) {
    --lt-spinner-color: var(--lt-interactive-primary-bg);
  }
  :host([variant='secondary']) {
    --lt-spinner-color: var(--lt-interactive-secondary-bg);
  }
  :host([variant='neutral']) {
    --lt-spinner-color: var(--lt-color-neutral-500);
  }
  :host([variant='current']) {
    --lt-spinner-color: currentColor;
  }

  .spinner {
    animation: spin 700ms linear infinite;
    border-bottom-color: var(--lt-spinner-color);
    border-left-color: var(--lt-spinner-color);
    border-radius: 999px;
    border-right-color: transparent;
    border-style: solid;
    border-top-color: var(--lt-spinner-color);
    border-width: 2px;
    box-sizing: border-box;
    display: block;
    height: var(--lt-spinner-size);
    width: var(--lt-spinner-size);
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .spinner {
      animation: none;
    }
  }
`;
