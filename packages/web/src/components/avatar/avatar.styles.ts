import { css } from 'lit';

export const avatarStyles = css`
  :host {
    display: inline-flex;
    flex-shrink: 0;
    vertical-align: middle;
  }

  span[part='base'] {
    align-items: center;
    background: var(--lt-bg-overlay);
    box-sizing: border-box;
    color: var(--lt-color-neutral-700);
    display: inline-flex;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }

  img[part='image'] {
    height: 100%;
    object-fit: cover;
    width: 100%;
  }

  .initials {
    font-family: 'Asap', sans-serif;
    font-weight: 500;
    letter-spacing: 0.02em;
    line-height: 1;
    user-select: none;
  }

  /* ── Colors (fallback bg + text) ────────────────────────────────────── */
  :host([color='neutral']) span[part='base'] {
    background: var(--lt-bg-overlay);
    color: var(--lt-color-neutral-700);
  }

  :host([color='primary']) span[part='base'] {
    background: var(--lt-bg-primary-subtle);
    color: var(--lt-color-primary-800);
  }

  :host([color='secondary']) span[part='base'] {
    background: var(--lt-bg-secondary-subtle);
    color: var(--lt-color-secondary-800);
  }

  :host([color='success']) span[part='base'] {
    background: var(--lt-bg-success-subtle);
    color: var(--lt-color-success-800);
  }

  :host([color='warning']) span[part='base'] {
    background: var(--lt-bg-warning-subtle);
    color: var(--lt-color-warning-800);
  }

  :host([color='error']) span[part='base'] {
    background: var(--lt-bg-error-subtle);
    color: var(--lt-color-error-800);
  }

  :host([color='info']) span[part='base'] {
    background: var(--lt-bg-info-subtle);
    color: var(--lt-color-info-800);
  }

  /* ── Shape ───────────────────────────────────────────────────────────── */
  :host([shape='circle']) span[part='base'] {
    border-radius: 999px;
  }

  :host([shape='square']) span[part='base'] {
    border-radius: var(--lt-border-radius);
  }

  /* ── Sizes ───────────────────────────────────────────────────────────── */
  :host([size='xs']) span[part='base'] {
    height: 24px;
    width: 24px;
  }

  :host([size='xs']) .initials {
    font-size: 0.625rem;
  }

  :host([size='sm']) span[part='base'] {
    height: 32px;
    width: 32px;
  }

  :host([size='sm']) .initials {
    font-size: 0.75rem;
  }

  :host([size='md']) span[part='base'] {
    height: 40px;
    width: 40px;
  }

  :host([size='md']) .initials {
    font-size: 0.9375rem;
  }

  :host([size='lg']) span[part='base'] {
    height: 52px;
    width: 52px;
  }

  :host([size='lg']) .initials {
    font-size: 1.125rem;
  }

  :host([size='xl']) span[part='base'] {
    height: 68px;
    width: 68px;
  }

  :host([size='xl']) .initials {
    font-size: 1.5rem;
  }
`;
