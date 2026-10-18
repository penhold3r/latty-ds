import { css } from 'lit';

export const avatarStyles = css`
  :host {
    display: inline-flex;
    flex-shrink: 0;
    position: relative;
    vertical-align: middle;
  }

  span[part='base'] {
    align-items: center;
    background: var(--lt-avatar-bg, var(--lt-bg-overlay));
    box-sizing: border-box;
    color: var(--lt-avatar-color, var(--lt-text-neutral));
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
    font-family: var(--lt-typography-fontFamilyPrimary, 'Hanken Grotesk', sans-serif);
    font-weight: 600;
    letter-spacing: 0.02em;
    line-height: 1;
    user-select: none;
  }

  /* ── Status ──────────────────────────────────────────────────────────── Positioned relative to the host (not
     span[part='base'], which clips to the circle/square with overflow:hidden) so it sits outside that crop. */
  .status {
    border: 2px solid var(--lt-avatar-status-ring, var(--lt-bg-default));
    border-radius: 50%;
    box-sizing: border-box;
    inset-block-end: 0;
    inset-inline-end: 0;
    position: absolute;
  }

  :host([status='online']) .status {
    background: var(--lt-interactive-success-bg);
  }

  :host([status='away']) .status {
    background: var(--lt-interactive-warning-bg);
  }

  :host([status='busy']) .status {
    background: var(--lt-interactive-error-bg);
  }

  :host([status='offline']) .status {
    background: var(--lt-interactive-neutral-bg);
  }

  /* ── Colors (fallback bg + text) ────────────────────────────────────── */
  :host([color='neutral']) span[part='base'] {
    background: var(--lt-bg-overlay);
    color: var(--lt-text-neutral);
  }

  :host([color='primary']) span[part='base'] {
    background: var(--lt-bg-primary-subtle);
    color: var(--lt-text-primary);
  }

  :host([color='secondary']) span[part='base'] {
    background: var(--lt-bg-secondary-subtle);
    color: var(--lt-text-secondary);
  }

  :host([color='success']) span[part='base'] {
    background: var(--lt-bg-success-subtle);
    color: var(--lt-text-success);
  }

  :host([color='warning']) span[part='base'] {
    background: var(--lt-bg-warning-subtle);
    color: var(--lt-text-warning);
  }

  :host([color='error']) span[part='base'] {
    background: var(--lt-bg-error-subtle);
    color: var(--lt-text-error);
  }

  :host([color='info']) span[part='base'] {
    background: var(--lt-bg-info-subtle);
    color: var(--lt-text-info);
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

  :host([size='xs']) .status {
    height: 8px;
    width: 8px;
  }

  :host([size='sm']) span[part='base'] {
    height: 32px;
    width: 32px;
  }

  :host([size='sm']) .initials {
    font-size: 0.75rem;
  }

  :host([size='sm']) .status {
    height: 9px;
    width: 9px;
  }

  :host([size='md']) span[part='base'] {
    height: 40px;
    width: 40px;
  }

  :host([size='md']) .initials {
    font-size: 0.9375rem;
  }

  :host([size='md']) .status {
    height: 10px;
    width: 10px;
  }

  :host([size='lg']) span[part='base'] {
    height: 52px;
    width: 52px;
  }

  :host([size='lg']) .initials {
    font-size: 1.125rem;
  }

  :host([size='lg']) .status {
    border-width: 2.5px;
    height: 13px;
    width: 13px;
  }

  :host([size='xl']) span[part='base'] {
    height: 68px;
    width: 68px;
  }

  :host([size='xl']) .initials {
    font-size: 1.5rem;
  }

  :host([size='xl']) .status {
    border-width: 3px;
    height: 16px;
    width: 16px;
  }
`;
