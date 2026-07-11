import { css } from 'lit';

export const textStyles = css`
  :host {
    display: block;
    color: inherit;
  }

  /* Inline variants sit in text flow */
  :host([variant='caption']),
  :host([variant='overline']),
  :host([variant='label']) {
    display: inline;
  }

  [part='base'] {
    margin: 0;
    color: inherit;
    font-family: var(--lt-typography-fontFamily, 'Hanken Grotesk', sans-serif);
  }

  /* ── Display ─────────────────────────────────────────────────────────── */

  :host([variant='display-2xl']) [part='base'] {
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: var(--lt-text-weight, 200);
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  :host([variant='display-xl']) [part='base'] {
    font-size: clamp(2rem, 5vw, 3.75rem);
    font-weight: var(--lt-text-weight, 200);
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  :host([variant='display-lg']) [part='base'] {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: var(--lt-text-weight, 200);
    line-height: 1.15;
    letter-spacing: -0.01em;
  }

  /* ── Headings ─────────────────────────────────────────────────────────── */

  :host([variant='h1']) [part='base'] {
    font-size: clamp(1.75rem, 2.5vw + 0.75rem, 2.5rem);
    font-weight: var(--lt-text-weight, 600);
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  :host([variant='h2']) [part='base'] {
    font-size: clamp(1.5rem, 2vw + 0.5rem, 2rem);
    font-weight: var(--lt-text-weight, 600);
    line-height: 1.25;
    letter-spacing: -0.01em;
  }

  :host([variant='h3']) [part='base'] {
    font-size: clamp(1.25rem, 1.5vw + 0.5rem, 1.5rem);
    font-weight: var(--lt-text-weight, 600);
    line-height: 1.3;
  }

  :host([variant='h4']) [part='base'] {
    font-size: 1.25rem;
    font-weight: var(--lt-text-weight, 600);
    line-height: 1.35;
  }

  :host([variant='h5']) [part='base'] {
    font-size: 1.125rem;
    font-weight: var(--lt-text-weight, 600);
    line-height: 1.4;
  }

  :host([variant='h6']) [part='base'] {
    font-size: 1rem;
    font-weight: var(--lt-text-weight, 600);
    line-height: 1.4;
  }

  /* ── Body ─────────────────────────────────────────────────────────────── */

  :host([variant='lead']) [part='base'] {
    font-size: 1.25rem;
    font-weight: var(--lt-text-weight, 400);
    line-height: 1.6;
  }

  :host([variant='body']) [part='base'],
  :host(:not([variant])) [part='base'] {
    font-size: 1rem;
    font-weight: var(--lt-text-weight, 400);
    line-height: 1.6;
  }

  :host([variant='body-sm']) [part='base'] {
    font-size: 0.875rem;
    font-weight: var(--lt-text-weight, 400);
    line-height: 1.6;
  }

  /* ── Inline ───────────────────────────────────────────────────────────── */

  :host([variant='caption']) [part='base'] {
    font-size: 0.75rem;
    font-weight: var(--lt-text-weight, 400);
    line-height: 1.5;
  }

  :host([variant='overline']) [part='base'] {
    font-size: 0.6875rem;
    font-weight: var(--lt-text-weight, 600);
    line-height: 1.2;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  :host([variant='label']) [part='base'] {
    font-size: 0.875rem;
    font-weight: var(--lt-text-weight, 600);
    line-height: 1.4;
  }
`;
