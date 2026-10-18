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
      z-index: var(--lt-z-overlay);
    }

    lt-surface.menu::part(surface) {
      max-height: var(--lt-dropdown-max-height, min(24rem, 60vh));
      overflow-x: hidden;
      overflow-y: auto;
      padding-block: var(--lt-dropdown-menu-padding, var(--lt-spacing-2));
    }
  `
];
