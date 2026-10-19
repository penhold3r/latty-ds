import { css } from 'lit';

export const surfaceStyles = css`
  :host {
    display: block;
    font-family: var(--lt-typography-fontFamilyPrimary, 'Hanken Grotesk', sans-serif);
  }

  .surface {
    background: var(--lt-surface-bg, var(--lt-bg-subtle));
    border-radius: var(--lt-border-radius);
    box-sizing: border-box;
    /* So lt-surface responds to a stretched flex/grid parent the way a plain
       element would: a percentage height only resolves against a definite
       height, so this is a no-op (computes to auto) for the common
       content-sized host, and only takes effect when something actually
       stretches :host — exactly a flex/grid "stretch" child's default. */
    height: 100%;
    transition:
      box-shadow var(--lt-duration-fast) var(--lt-ease-standard),
      border-color var(--lt-duration-fast) var(--lt-ease-standard);
  }

  /* Elevation variants */
  :host([elevation='0']) .surface {
    box-shadow: var(--lt-elevation-0);
  }
  :host([elevation='1']) .surface {
    box-shadow: var(--lt-elevation-1);
  }
  :host([elevation='2']) .surface {
    box-shadow: var(--lt-elevation-2);
  }
  :host([elevation='3']) .surface {
    box-shadow: var(--lt-elevation-3);
  }
  :host([elevation='4']) .surface {
    box-shadow: var(--lt-elevation-4);
  }
  :host([elevation='5']) .surface {
    box-shadow: var(--lt-elevation-5);
  }

  /* Visual appearances */
  :host([appearance='filled']) .surface {
    border: none;
  }

  :host([appearance='outlined']) .surface {
    background: var(--lt-surface-bg, transparent);
    border: var(--lt-border-width, 1px) solid var(--lt-border-default);
  }

  :host([appearance='outlined']:hover) .surface {
    border-color: var(--lt-border-strong);
  }

  /* ── Reduced motion ─────────────────────────────────────────────────────── */

  @media (prefers-reduced-motion: reduce) {
    .surface {
      transition: none;
    }
  }
`;
