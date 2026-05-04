import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { headerStyles } from './header.styles';
import type { HeaderVariant } from './header.types';

/**
 * A layout component that organises content into a sticky app bar.
 * Renders a native `<header>` element for semantics and the ARIA `banner` landmark.
 *
 * @element lt-header
 *
 * @slot before - Far-left area, typically a hamburger menu or back button
 * @slot logo - Logo or brand mark, placed to the right of `before`
 * @slot content - Main content area (nav links, search…); stretches to fill available space
 * @slot after - Far-right area, typically user actions or icons
 */
@customElement('lt-header')
export class Header extends LitElement {
  static styles = headerStyles;

  /** Visual variant that controls background and text colours. */
  @property({ reflect: true }) variant: HeaderVariant = 'primary';

  render() {
    return html`
      <header>
        <slot name="before"></slot>
        <slot name="logo"></slot>
        <div class="content"><slot name="content"></slot></div>
        <slot name="after"></slot>
      </header>
    `;
  }
}
