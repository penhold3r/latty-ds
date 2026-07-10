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
 * - Supports multiple fixed sizes (xs, sm, md, lg, xl) plus `inherit` (1em, scales with font-size)
 * - Overridable via the `--lt-icon-size` custom property (wins over the `size` attribute)
 * - Inherits color from parent via currentColor
 * - Loads icons from the global icon registry
 * - Automatically cleans SVG attributes for consistent sizing
 *
 * Note: setting `font-size` on the icon has no effect on its own — use `size="inherit"`
 * (then `font-size` drives the 1em box) or `--lt-icon-size` for fluid sizing.
 *
 * @cssprop [--lt-icon-size] - Width/height of the icon; overrides the `size` attribute (e.g. `1.5em`, `18px`)
 *
 * @example
 * ```html
 * <lt-icon name="search" size="md"></lt-icon>
 * <lt-icon name="user" size="lg" style="color: blue;"></lt-icon>
 * <lt-icon name="star" size="inherit"></lt-icon> <!-- scales with surrounding text -->
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

    /* sizes — --lt-icon-size always wins over the size attribute */
    :host([size='xs']) {
      width: var(--lt-icon-size, 12px);
      height: var(--lt-icon-size, 12px);
    }

    :host([size='sm']) {
      width: var(--lt-icon-size, 16px);
      height: var(--lt-icon-size, 16px);
    }

    :host([size='md']) {
      width: var(--lt-icon-size, 20px);
      height: var(--lt-icon-size, 20px);
    }

    :host([size='lg']) {
      width: var(--lt-icon-size, 24px);
      height: var(--lt-icon-size, 24px);
    }

    :host([size='xl']) {
      width: var(--lt-icon-size, 32px);
      height: var(--lt-icon-size, 32px);
    }

    /* 1em box — scales with the inherited font-size */
    :host([size='inherit']) {
      width: var(--lt-icon-size, 1em);
      height: var(--lt-icon-size, 1em);
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

  private _unsubscribeRegistry?: () => void;

  connectedCallback() {
    super.connectedCallback();
    this._unsubscribeRegistry = iconRegistry.subscribe(() => this.loadIcon());
    this.loadIcon();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unsubscribeRegistry?.();
  }

  willUpdate(changedProperties: Map<string, unknown>) {
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
      // eslint-disable-next-line no-console
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
    // Strip width, height, and stroke-width only from the root <svg> tag so
    // child elements can carry their own stroke-width without being affected.
    return svg.replace(/<svg([^>]*)>/, (_, attrs: string) => {
      const cleaned = attrs
        .replace(/\s*width="[^"]*"/g, '')
        .replace(/\s*height="[^"]*"/g, '')
        .replace(/\s*stroke-width="[^"]*"/g, '');
      return `<svg${cleaned}>`;
    });
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
