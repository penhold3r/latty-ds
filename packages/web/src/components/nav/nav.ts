import { html, nothing } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';

import { navStyles } from './nav.styles';
import { NavOrientation } from './nav.types';

import './nav-item';

/**
 * Navigation container. Renders a `<nav>` element wrapping a list of `<lt-nav-item>` links.
 * Supports horizontal or vertical orientation and propagates the orientation to all
 * `<lt-nav-item>` children so nested items behave correctly.
 *
 * @element lt-nav
 *
 * @slot - Slot for `<lt-nav-item>` elements
 *
 * @example
 * ```html
 * <!-- Vertical (default) -->
 * <lt-nav>
 *   <lt-nav-item href="/" label="Home" icon-start="home"></lt-nav-item>
 *   <lt-nav-item href="/about" label="About"></lt-nav-item>
 * </lt-nav>
 * ```
 *
 * @example
 * ```html
 * <!-- Horizontal with nested dropdown -->
 * <lt-nav orientation="horizontal">
 *   <lt-nav-item href="/" label="Home"></lt-nav-item>
 *   <lt-nav-item label="Products">
 *     <lt-nav-item href="/products/a" label="Product A"></lt-nav-item>
 *     <lt-nav-item href="/products/b" label="Product B"></lt-nav-item>
 *   </lt-nav-item>
 * </lt-nav>
 * ```
 */
@customElement('lt-nav')
export class Nav extends ThemeableElement {
  static styles = navStyles;

  /**
   * Accessible label for the navigation region. Required when multiple nav elements appear on one page.
   * @default ''
   */
  @property() label = '';

  /**
   * Layout direction of the navigation.
   * @default 'vertical'
   */
  @property({ reflect: true }) orientation: NavOrientation = 'vertical';

  private _propagateOrientation() {
    this.querySelectorAll<HTMLElement>(':scope > lt-nav-item').forEach((item) => {
      item.setAttribute('orientation', this.orientation);
    });
  }

  protected updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('orientation')) this._propagateOrientation();
  }

  render() {
    return html`
      <nav role="navigation" aria-label=${this.label || nothing}>
        <slot @slotchange=${this._propagateOrientation}></slot>
      </nav>
    `;
  }
}
