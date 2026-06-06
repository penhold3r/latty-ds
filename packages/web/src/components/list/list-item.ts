import { html, nothing } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';

import { listItemStyles } from './list-item.styles';

import '@latty-ds/icons';

/**
 * A list item component that renders a `<li>` element in shadow DOM.
 *
 * This component solves the HTML parser issue where nested `<lt-list>` components
 * cannot contain plain `<li>` elements due to browser parsing rules. By wrapping
 * the `<li>` in a custom element's shadow DOM, we can properly nest lists.
 *
 * @element lt-list-item
 *
 * @slot - Default slot for list item content
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
 */
@customElement('lt-list-item')
export class ListItem extends ThemeableElement {
  static styles = listItemStyles;

  /** Icon name to display before the item content. */
  @property({ attribute: 'icon-start' }) iconStart = '';

  /** Icon name to display after the item content. */
  @property({ attribute: 'icon-end' }) iconEnd = '';

  render() {
    return html`
      <div class="inner">
        ${this.iconStart ? html`<lt-icon class="icon-start" name=${this.iconStart}></lt-icon>` : nothing}
        <slot></slot>
        ${this.iconEnd ? html`<lt-icon class="icon-end" name=${this.iconEnd}></lt-icon>` : nothing}
      </div>
    `;
  }
}
