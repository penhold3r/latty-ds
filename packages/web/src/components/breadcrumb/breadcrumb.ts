import { html, type PropertyValues } from 'lit';
import { ThemeableElement } from '../../base';
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
 * <lt-breadcrumb separator=">">
 *   <lt-breadcrumb-item href="/">Home</lt-breadcrumb-item>
 *   <lt-breadcrumb-item href="/components">Components</lt-breadcrumb-item>
 *   <lt-breadcrumb-item current>Button</lt-breadcrumb-item>
 * </lt-breadcrumb>
 * ```
 */
@customElement('lt-breadcrumb')
export class Breadcrumb extends ThemeableElement {
  static styles = breadcrumbStyles;

  /**
   * The character or element to use as a separator between breadcrumb items.
   * This is passed down to all children items via CSS variables.
   * @default '/'
   */
  @property() separator = '/';

  override updated(changed: PropertyValues<this>) {
    super.updated(changed);
    if (changed.has('separator')) {
      // Guard against null/undefined being coerced to strings
      if (this.separator !== null && this.separator !== undefined) {
        this.style.setProperty('--lt-breadcrumb-separator', `"${this.separator}"`);
      } else {
        this.style.removeProperty('--lt-breadcrumb-separator');
      }
    }
  }

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
export class BreadcrumbItem extends ThemeableElement {
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

  /**
   * Custom separator for this specific item. Overrides the parent's separator.
   * @default ''
   */
  @property() separator = '';

  render() {
    // Only apply local override if separator is explicitly provided and not nullish/empty
    const hasSeparatorOverride = this.separator !== null && this.separator !== undefined && this.separator !== '';

    return html`
      <li part="item">
        ${this.current || !this.href
          ? html`<span part="text" aria-current=${this.current ? 'page' : 'false'}><slot></slot></span>`
          : html`<a part="link" href=${this.href}><slot></slot></a>`}
        <span
          part="separator"
          aria-hidden="true"
          style=${hasSeparatorOverride ? `--lt-breadcrumb-separator: "${this.separator}"` : ''}
        ></span>
      </li>
    `;
  }
}
