import { css } from 'lit';

export const chipStyles = css`
  :host {
    display: inline-block;
  }

  /* Sizes */
  :host([size='sm']) {
    /* TODO: sm styles */
  }
  :host([size='md']) {
    /* TODO: md styles */
  }
  :host([size='lg']) {
    /* TODO: lg styles */
  }

  /* Variants */
  :host([variant='primary']) {
    /* TODO: use var(--lt-color-primary-500) */
  }
  :host([variant='secondary']) {
    /* TODO: use var(--lt-color-secondary-500) */
  }
  :host([variant='neutral']) {
    /* TODO: use var(--lt-color-neutral-500) */
  }
  :host([variant='success']) {
    /* TODO: use var(--lt-color-success-500) */
  }
  :host([variant='warning']) {
    /* TODO: use var(--lt-color-warning-500) */
  }
  :host([variant='error']) {
    /* TODO: use var(--lt-color-error-500) */
  }
  :host([variant='info']) {
    /* TODO: use var(--lt-color-info-500) */
  }

  /* Disabled */
  :host([disabled]) {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: none;
  }
`;
