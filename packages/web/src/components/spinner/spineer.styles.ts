import { css } from 'lit';

/**
 * Styles for the lt-spinner component.
 *
 * Includes:
 * - Base rotating animation
 * - Size variants (sm, md, lg) using CSS custom properties
 * - Color variants (primary, secondary, neutral, current)
 * - Respects prefers-reduced-motion for accessibility
 * - Circular border with transparent segment for spinner effect
 */
export const spinnerStyles = css`
  :host {
    --spinner-size: var(--lt-spacing-4, 1rem);
    --spinner-color: currentColor;

    display: inline-block;
    line-height: 0;
  }

  /* Sizes */
  :host([size='sm']) {
    --spinner-size: var(--lt-spacing-3, 0.75rem);
  }
  :host([size='md']) {
    --spinner-size: var(--lt-spacing-4, 1rem);
  }
  :host([size='lg']) {
    --spinner-size: var(--lt-spacing-6, 1.5rem);
  }

  /* Color */
  :host([variant='primary']) {
    --spinner-color: var(--lt-color-primary-500);
  }
  :host([variant='secondary']) {
    --spinner-color: var(--lt-color-secondary-500);
  }
  :host([variant='neutral']) {
    --spinner-color: var(--lt-color-neutral-500);
  }
  :host([variant='current']) {
    --spinner-color: currentColor;
  }

  .spinner {
    animation: spin 700ms linear infinite;
    border-bottom-color: var(--spinner-color);
    border-left-color: var(--spinner-color);
    border-radius: 999px;
    border-right-color: transparent;
    border-style: solid;
    border-top-color: var(--spinner-color);
    border-width: 2px;
    box-sizing: border-box;
    display: block;
    height: var(--spinner-size);
    width: var(--spinner-size);
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
