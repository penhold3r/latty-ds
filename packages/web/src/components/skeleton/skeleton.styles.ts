import { css } from 'lit';

export const skeletonStyles = css`
  :host {
    display: block;
  }

  [part='base'] {
    background: var(--lt-color-neutral-200);
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
    background: linear-gradient(
      90deg,
      var(--lt-color-neutral-100) 25%,
      var(--lt-color-neutral-200) 50%,
      var(--lt-color-neutral-100) 75%
    );
    background-size: 200% 100%;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    :host([animated]) [part='base'] {
      animation: none;
      background: var(--lt-color-neutral-200);
    }
  }
`;
