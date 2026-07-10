import { html, nothing } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { listItemStyles } from './list-item.styles';

import '@latty-ds/icons';

/**
 * A list item component that renders a `<li>` element in shadow DOM.
 *
 * This component solves the HTML parser issue where nested `<lt-list>` components
 * cannot contain plain `<li>` elements due to browser parsing rules. By wrapping
 * the `<li>` in a custom element's shadow DOM, we can properly nest lists.
 *
 * Items can also be interactive: set `clickable` to render the row as a native
 * `<button>` (picker rows, settings rows), or `href` to render it as an `<a>`.
 * Interactive rows get hover/active/focus states and a disabled state.
 *
 * @element lt-list-item
 *
 * @slot - Default slot for list item content
 *
 * @csspart base - The row container (`<div>`, `<button>` when `clickable`, or `<a>` when `href` is set)
 *
 * @example
 * ```html
 * <lt-list>
 *   <lt-list-item>First item</lt-list-item>
 *   <lt-list-item>Second item</lt-list-item>
 *   <lt-list-item>Third item</lt-list-item>
 * </lt-list>
 * ```
 *
 * @example
 * With icons:
 * ```html
 * <lt-list>
 *   <lt-list-item icon-start="check">Done</lt-list-item>
 *   <lt-list-item icon-start="clock">Pending</lt-list-item>
 *   <lt-list-item icon-start="info" icon-end="arrow-right">Details</lt-list-item>
 * </lt-list>
 * ```
 *
 * @example
 * Interactive rows:
 * ```html
 * <lt-list>
 *   <lt-list-item clickable>Pick me</lt-list-item>
 *   <lt-list-item href="/settings/profile" icon-end="arrow-right">Profile</lt-list-item>
 * </lt-list>
 * ```
 */
@customElement('lt-list-item')
export class ListItem extends ThemeableElement {
  static styles = listItemStyles;

  override connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute('role')) this.setAttribute('role', 'listitem');
  }

  /** Icon name to display before the item content. */
  @property({ attribute: 'icon-start' }) iconStart = '';

  /** Icon name to display after the item content. */
  @property({ attribute: 'icon-end' }) iconEnd = '';

  /**
   * Renders the row as a native `<button>` with hover/active/focus states.
   * Listen for `click` on the element to react. Ignored when `href` is set.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) clickable = false;

  /** When set, renders the row as an `<a>` with hover/active/focus states. */
  @property() href = '';

  /** Forwarded to the anchor's `target` attribute when `href` is set. */
  @property() target = '';

  /**
   * Forwarded to the anchor's `rel` attribute when `href` is set.
   * Defaults to `noopener noreferrer` when `target="_blank"` and `rel` is not specified.
   */
  @property() rel = '';

  /**
   * Disables the interactive row. Only relevant with `clickable` or `href`.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  render() {
    const inner = html`
      ${this.iconStart ? html`<lt-icon class="icon-start" name=${this.iconStart}></lt-icon>` : nothing}
      <span class="content"><slot></slot></span>
      ${this.iconEnd ? html`<lt-icon class="icon-end" name=${this.iconEnd}></lt-icon>` : nothing}
    `;

    if (this.href) {
      const rel = this.rel || (this.target === '_blank' ? 'noopener noreferrer' : undefined);
      return html`
        <a
          class="inner"
          part="base"
          href=${this.href}
          target=${ifDefined(this.target || undefined)}
          rel=${ifDefined(rel)}
          aria-disabled=${this.disabled ? 'true' : nothing}
          tabindex=${this.disabled ? '-1' : nothing}
          >${inner}</a
        >
      `;
    }

    if (this.clickable) {
      return html`<button class="inner" part="base" type="button" ?disabled=${this.disabled}>${inner}</button>`;
    }

    return html`<div class="inner" part="base">${inner}</div>`;
  }
}
