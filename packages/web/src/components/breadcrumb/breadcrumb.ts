import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { breadcrumbStyles, breadcrumbItemStyles } from './breadcrumb.styles';

/**
 * Navigation breadcrumb trail container.
 * Place `lt-breadcrumb-item` elements inside as direct children.
 *
 * @element lt-breadcrumb
 *
 * @example
 * ```html
 * <lt-breadcrumb>
 *   <lt-breadcrumb-item href="/">Home</lt-breadcrumb-item>
 *   <lt-breadcrumb-item href="/components">Components</lt-breadcrumb-item>
 *   <lt-breadcrumb-item current>Button</lt-breadcrumb-item>
 * </lt-breadcrumb>
 * ```
 */
@customElement('lt-breadcrumb')
export class Breadcrumb extends LitElement {
  static styles = breadcrumbStyles;

  render() {
    return html`
      <nav aria-label="breadcrumb">
        <ol part="list">
          <slot></slot>
        </ol>
      </nav>
    `;
  }
}

/**
 * A single step in a breadcrumb trail.
 * Renders as a link when `href` is provided, or as plain text when `current`.
 *
 * @element lt-breadcrumb-item
 */
@customElement('lt-breadcrumb-item')
export class BreadcrumbItem extends LitElement {
  static styles = breadcrumbItemStyles;

  /**
   * URL this item links to. Omit for the current (last) item.
   * @default ''
   */
  @property() href = '';

  /**
   * Marks this item as the current page. Renders as non-linked text with `aria-current="page"`.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) current = false;

  render() {
    return html`
      <li part="item">
        ${this.current || !this.href
          ? html`<span part="text" aria-current=${this.current ? 'page' : 'false'}><slot></slot></span>`
          : html`<a part="link" href=${this.href}><slot></slot></a>`}
        <span part="separator" aria-hidden="true">/</span>
      </li>
    `;
  }
}
