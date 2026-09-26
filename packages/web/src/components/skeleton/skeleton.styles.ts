import { css } from 'lit';

export const skeletonStyles = css`
  :host {
    display: block;
  }

  [part='base'] {
    background: var(--lt-bg-overlay);
    border-radius: var(--lt-border-radius);
    height: 1.25rem;
    overflow: hidden;
    width: 100%;
  }

  :host([shape='text']) [part='base'] {
    border-radius: 4px;
    height: 1em;
  }

  :host([shape='circle']) [part='base'] {
    border-radius: 50%;
    height: 2.5rem;
    width: 2.5rem;
  }

  :host([animated]) [part='base'] {
    animation: shimmer 1.5s ease-in-out infinite;
    background: linear-gradient(90deg, var(--lt-bg-surface) 25%, var(--lt-bg-overlay) 50%, var(--lt-bg-surface) 75%);
    background-size: 200% 100%;
  }

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :host([animated]) [part='base'] {
      animation: none;
      background: var(--lt-bg-overlay);
    }
  }
`;
