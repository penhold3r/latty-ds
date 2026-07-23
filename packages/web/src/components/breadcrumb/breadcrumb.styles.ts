import { css } from 'lit';

export const breadcrumbStyles = css`
  :host {
    display: block;
  }

  [part='list'] {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 0;
    list-style: none;
    margin: 0;
    padding: 0;
  }
`;

export const breadcrumbItemStyles = css`
  :host {
    align-items: center;
    display: inline-flex;
    font-family: var(--lt-typography-fontFamilyPrimary, 'Hanken Grotesk', sans-serif);
    font-size: 0.875rem;
  }

  [part='link'] {
    color: var(--lt-interactive-primary-bg);
    text-decoration: none;
    transition: color 120ms ease;
  }

  [part='link']:hover {
    color: var(--lt-interactive-primary-bg-hover);
    text-decoration: underline;
  }

  [part='text'] {
    color: var(--lt-text-default);
    font-weight: 600;
  }

  [part='separator'] {
    color: var(--lt-text-muted);
    margin-inline: var(--lt-spacing-2);
    user-select: none;
  }

  [part='separator']::after {
    content: var(--lt-breadcrumb-separator, '/');
  }

  :host(:last-child) [part='separator'] {
    display: none;
  }
`;
