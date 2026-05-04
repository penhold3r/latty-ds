import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { listItemStyles } from './list-item.styles';

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
 * Nested lists:
 * ```html
 * <lt-list>
 *   <lt-list-item>
 *     Main item
 *     <lt-list type="ordered">
 *       <lt-list-item>Nested item 1</lt-list-item>
 *       <lt-list-item>Nested item 2</lt-list-item>
 *     </lt-list>
 *   </lt-list-item>
 * </lt-list>
 * ```
 */
@customElement('lt-list-item')
export class ListItem extends LitElement {
  static styles = listItemStyles;

  render() {
    return html`<slot></slot>`;
  }
}
