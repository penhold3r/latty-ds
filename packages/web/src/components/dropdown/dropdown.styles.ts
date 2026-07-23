import { css } from 'lit';
import { floatingPanelReset } from '../shared/floating';

export const dropdownStyles = [
  floatingPanelReset,
  css`
    :host {
      display: inline-block;
      font-family: var(--lt-typography-fontFamilyPrimary, 'Hanken Grotesk', sans-serif);
    }

    .trigger-wrap {
      display: contents;
    }

    lt-surface.menu {
      display: none;
      min-width: 10rem;
      z-index: 1000;
    }

    lt-surface.menu::part(surface) {
      overflow: hidden;
    }
  `
];
