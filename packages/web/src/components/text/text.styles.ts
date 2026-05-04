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
    font-family: var(--lt-typography-fontfamily);
  }

  /* ── Display ─────────────────────────────────────────────────────────── */

  :host([variant='display-2xl']) [part='base'] {
    font-size: 4.5rem;
    font-weight: 200;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  :host([variant='display-xl']) [part='base'] {
    font-size: 3.75rem;
    font-weight: 200;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  :host([variant='display-lg']) [part='base'] {
    font-size: 3rem;
    font-weight: 200;
    line-height: 1.15;
    letter-spacing: -0.01em;
  }

  /* ── Headings ─────────────────────────────────────────────────────────── */

  :host([variant='h1']) [part='base'] {
    font-size: 2.5rem;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  :host([variant='h2']) [part='base'] {
    font-size: 2rem;
    font-weight: 600;
    line-height: 1.25;
    letter-spacing: -0.01em;
  }

  :host([variant='h3']) [part='base'] {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.3;
  }

  :host([variant='h4']) [part='base'] {
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.35;
  }

  :host([variant='h5']) [part='base'] {
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.4;
  }

  :host([variant='h6']) [part='base'] {
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.4;
  }

  /* ── Body ─────────────────────────────────────────────────────────────── */

  :host([variant='lead']) [part='base'] {
    font-size: 1.25rem;
    font-weight: 400;
    line-height: 1.6;
  }

  :host([variant='body']) [part='base'],
  :host(:not([variant])) [part='base'] {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.6;
  }

  :host([variant='body-sm']) [part='base'] {
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.6;
  }

  /* ── Inline ───────────────────────────────────────────────────────────── */

  :host([variant='caption']) [part='base'] {
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.5;
  }

  :host([variant='overline']) [part='base'] {
    font-size: 0.6875rem;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  :host([variant='label']) [part='base'] {
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.4;
  }
`;
