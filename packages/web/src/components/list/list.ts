import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { listStyles } from './list.styles';
import { ListType, ListSize } from './list.types';

/**
 * A customizable list component supporting both ordered and unordered lists.
 *
 * @element lt-list
 *
 * @slot - Default slot for list items (`<li>` elements)
 *
 * @csspart list - The underlying `<ul>` or `<ol>` element
 *
 * @cssprop --list-marker-color - Color of the bullet points or numbers (default: neutral-500)
 *
 * @example
 * ```html
 * <lt-list>
 *   <li>First item</li>
 *   <li>Second item</li>
 *   <li>Third item</li>
 * </lt-list>
 * ```
 *
 * @example
 * ```html
 * <lt-list type="ordered" size="lg">
 *   <li>Step one</li>
 *   <li>Step two</li>
 *   <li>Step three</li>
 * </lt-list>
 * ```
 *
 * @example
 * ```html
 * <lt-list marker-color="var(--lt-color-primary-500)">
 *   <li>Highlighted item</li>
 *   <li>Another item</li>
 * </lt-list>
 * ```
 *
 * @example
 * Nested lists:
 * ```html
 * <lt-list>
 *   <li>
 *     Main item
 *     <lt-list type="ordered">
 *       <li>Nested item 1</li>
 *       <li>Nested item 2</li>
 *     </lt-list>
 *   </li>
 * </lt-list>
 * ```
 */
@customElement('lt-list')
export class List extends LitElement {
  static styles = listStyles;

  /**
   * Type of list to render.
   * @default 'unordered'
   */
  @property({ reflect: true }) type: ListType = 'unordered';

  /**
   * Size of the list items.
   * @default 'md'
   */
  @property({ reflect: true }) size: ListSize = 'md';

  /**
   * Custom color for the list markers (bullets or numbers).
   * Accepts any valid CSS color value.
   * @default ''
   */
  @property({ attribute: 'marker-color' }) markerColor = '';

  render() {
    const isOrdered = this.type === 'ordered';
    const styles = this.markerColor
      ? { '--list-marker-color': this.markerColor }
      : {};

    return isOrdered
      ? html`<ol part="list" style=${styleMap(styles)}><slot></slot></ol>`
      : html`<ul part="list" style=${styleMap(styles)}><slot></slot></ul>`;
  }
}
