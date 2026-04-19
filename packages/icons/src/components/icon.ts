import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { iconRegistry } from '../registry/icon-registry';
import type { IconSize } from '../types/icons.types';

/**
 * Icon component for displaying SVG icons from the icon registry.
 *
 * @element lt-icon
 *
 * Features:
 * - Supports multiple sizes (xs, sm, md, lg, xl)
 * - Inherits color from parent via currentColor
 * - Loads icons from the global icon registry
 * - Automatically cleans SVG attributes for consistent sizing
 *
 * @example
 * ```html
 * <lt-icon name="search" size="md"></lt-icon>
 * <lt-icon name="user" size="lg" style="color: blue;"></lt-icon>
 * ```
 */
@customElement('lt-icon')
export class Icon extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;
    }

    svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    /* sizes */
    :host([size='xs']) {
      width: 12px;
      height: 12px;
    }

    :host([size='sm']) {
      width: 16px;
      height: 16px;
    }

    :host([size='md']) {
      width: 20px;
      height: 20px;
    }

    :host([size='lg']) {
      width: 24px;
      height: 24px;
    }

    :host([size='xl']) {
      width: 32px;
      height: 32px;
    }

    /* Allow color inheritance */
    svg {
      color: currentColor;
    }

    svg path,
    svg circle,
    svg rect,
    svg line,
    svg polyline,
    svg polygon {
      stroke: currentColor;
    }
  `;

  /**
   * Icon name to display from the registry.
   * @default ''
   */
  @property({ reflect: true }) name = '';

  /**
   * Size of the icon.
   * @default 'md'
   */
  @property({ reflect: true }) size: IconSize = 'md';

  /**
   * Internal SVG content loaded from registry.
   * @private
   */
  @state() private svgContent = '';

  /**
   * Lifecycle: Component connected to DOM.
   * Loads the icon on initial mount.
   */
  connectedCallback() {
    super.connectedCallback();
    this.loadIcon();
  }

  /**
   * Lifecycle: Property changed.
   * Reloads icon when name changes.
   */
  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('name')) {
      this.loadIcon();
    }
  }

  /**
   * Loads icon SVG from the registry and cleans it for rendering.
   * Logs a warning if the icon is not found.
   * @private
   */
  private loadIcon() {
    if (!this.name) {
      this.svgContent = '';
      return;
    }

    const svg = iconRegistry.getIcon(this.name);

    if (svg) {
      this.svgContent = this.cleanSVG(svg);
    } else {
      console.warn(`Icon "${this.name}" not found in registry`);
      this.svgContent = '';
    }
  }

  /**
   * Cleans SVG markup for consistent rendering.
   * Removes fixed width/height/stroke-width attributes to allow CSS control.
   * Preserves viewBox for proper scaling.
   *
   * @param svg - Raw SVG string
   * @returns Cleaned SVG string
   * @private
   */
  private cleanSVG(svg: string): string {
    // Remove width/height attributes to allow CSS sizing
    // Keep viewBox for proper scaling
    return svg
      .replace(/\s*width="[^"]*"/g, '')
      .replace(/\s*height="[^"]*"/g, '')
      .replace(/\s*stroke-width="[^"]*"/g, '');
  }

  /**
   * Renders the icon SVG.
   * Returns empty template if no content is available.
   */
  render() {
    if (!this.svgContent) {
      return html``;
    }

    return html`${unsafeSVG(this.svgContent)}`;
  }
}
