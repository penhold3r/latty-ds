import { css } from 'lit';

export const surfaceStyles = css`
  :host {
    display: block;
    font-family: 'Asap', sans-serif;
  }

  .surface {
    background: var(--_surface-bg, var(--lt-bg-subtle));
    border-radius: var(--lt-border-radius);
    box-sizing: border-box;
    transition:
      box-shadow 120ms ease,
      border-color 120ms ease;
  }

  /* Elevation variants */
  :host([elevation='0']) .surface { box-shadow: var(--lt-elevation-0); }
  :host([elevation='1']) .surface { box-shadow: var(--lt-elevation-1); }
  :host([elevation='2']) .surface { box-shadow: var(--lt-elevation-2); }
  :host([elevation='3']) .surface { box-shadow: var(--lt-elevation-3); }
  :host([elevation='4']) .surface { box-shadow: var(--lt-elevation-4); }
  :host([elevation='5']) .surface { box-shadow: var(--lt-elevation-5); }

  /* Visual variants */
  :host([variant='filled']) .surface {
    border: none;
  }

  :host([variant='outlined']) .surface {
    background: transparent;
    border: 1px solid var(--lt-color-neutral-300);
  }

  :host([variant='outlined']:hover) .surface {
    border-color: var(--lt-border-strong);
  }
`;
