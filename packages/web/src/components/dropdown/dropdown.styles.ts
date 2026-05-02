import { css } from 'lit';

export const dropdownStyles = css`
  :host {
    display: inline-block;
    font-family: 'Asap', sans-serif;
    position: relative;
  }

  .trigger-wrap {
    display: contents;
  }

  lt-surface.menu {
    display: none;
    min-width: 10rem;
    position: absolute;
    top: calc(100% + var(--lt-spacing-1));
    left: 0;
    z-index: 1000;
  }

  :host([open]) lt-surface.menu {
    display: block;
  }

  lt-surface.menu::part(surface) {
    overflow: hidden;
  }

  /* Placement variants */
  :host([placement='bottom-end']) lt-surface.menu {
    left: auto;
    right: 0;
  }

  :host([placement='bottom']) lt-surface.menu {
    left: 50%;
    transform: translateX(-50%);
  }

  :host([placement='top-start']) lt-surface.menu {
    top: auto;
    bottom: calc(100% + var(--lt-spacing-1));
  }

  :host([placement='top-end']) lt-surface.menu {
    top: auto;
    bottom: calc(100% + var(--lt-spacing-1));
    left: auto;
    right: 0;
  }

  :host([placement='top']) lt-surface.menu {
    top: auto;
    bottom: calc(100% + var(--lt-spacing-1));
    left: 50%;
    transform: translateX(-50%);
  }
`;
