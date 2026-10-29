import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { iconRegistry } from '../registry/icon-registry.js';
import type { IconSize } from '../types/icons.types.js';

/**
 * Icon component for displaying SVG icons from the icon registry.
 * @element lt-icon
 *
 * Features:
 * - Supports multiple fixed sizes (xs, sm, md, lg, xl) plus `inherit` (1em, scales with font-size)
 * - Overridable via the `--lt-icon-size` custom property (wins over the `size` attribute)
 * - Inherits color from parent via currentColor
 * - Loads icons from the global icon registry
 * - Automatically cleans SVG attributes for consistent sizing
 * - Decorative by default (`aria-hidden="true"`); set `label` for informative icons
 *
 * Note: setting `font-size` on the icon has no effect on its own — use `size="inherit"`
 * (then `font-size` drives the 1em box) or `--lt-icon-size` for fluid sizing.
 * @cssprop [--lt-icon-size] - Width/height of the icon; overrides the `size` attribute (e.g. `1.5em`, `18px`)
 * @example
 * ```html
 * <lt-icon name="search" size="md"></lt-icon>
 * <lt-icon name="user" size="lg" style="color: blue;"></lt-icon>
 * <lt-icon name="star" size="inherit"></lt-icon> <!-- scales with surrounding text -->
 * <lt-icon name="warning-triangle" label="Warning"></lt-icon> <!-- informative -->
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

    /* :not([fill]) — a shape with its own fill attribute (a solid accent dot/path inside an otherwise
       outline icon, e.g. info-circle's center dot) is meant to render as a plain filled shape with no
       outline; without this, it inherits an unset stroke-width's SVG-spec default of 1px, and forcing
       stroke: currentColor on top of that paints a visible ring around it. An outline shape has no fill
       attribute of its own (it inherits the root <svg>'s fill="none"), so this never affects it. */
    svg path:not([fill]),
    svg circle:not([fill]),
    svg rect:not([fill]),
    svg line:not([fill]),
    svg polyline:not([fill]),
    svg polygon:not([fill]) {
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
   * Accessible label for informative icons. When set, the icon gets `role="img"`
   * and `aria-label`. When absent, the icon is decorative (`aria-hidden="true"`).
   * @default ''
   */
  @property({ reflect: true }) label = '';

  /**
   * Internal SVG content loaded from registry.
   * @private
   */
  @state() private svgContent = '';

  private _unsubscribeRegistry?: () => void;
  private _lastWarnedName = '';

  connectedCallback() {
    super.connectedCallback();
    this._unsubscribeRegistry = iconRegistry.subscribe(() => this.loadIcon());
    // The first render loads it in willUpdate; only a re-attached element (already rendered) needs this.
    if (this.hasUpdated) this.loadIcon();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unsubscribeRegistry?.();
  }

  willUpdate(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('name')) {
      this.loadIcon();
    }
    if (changedProperties.has('label')) {
      if (this.label) {
        this.setAttribute('role', 'img');
        this.setAttribute('aria-label', this.label);
        this.removeAttribute('aria-hidden');
      } else {
        this.removeAttribute('role');
        this.removeAttribute('aria-label');
        this.setAttribute('aria-hidden', 'true');
      }
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
      this._lastWarnedName = '';
    } else {
      if (this._lastWarnedName !== this.name && import.meta.env?.DEV !== false) {
        // eslint-disable-next-line no-console
        console.warn(`[lt-icon] "${this.name}" not found in registry`);
        this._lastWarnedName = this.name;
      }
      this.svgContent = '';
    }
  }

  /**
   * Cleans SVG markup for consistent rendering.
   * Removes fixed width/height/stroke-width attributes to allow CSS control.
   * Preserves viewBox for proper scaling.
   * @param {string} svg - Raw SVG string.
   * @returns {string} Cleaned SVG string.
   * @private
   */
  private cleanSVG(svg: string): string {
    return svg.replace(/<svg([^>]*)>/, (_, attrs: string) => {
      const cleaned = attrs.replace(/\s*width="[^"]*"/g, '').replace(/\s*height="[^"]*"/g, '');
      return `<svg${cleaned}>`;
    });
  }

  /**
   * Renders the icon SVG.
   * Returns empty template if no content is available.
   * @returns {TemplateResult} The icon SVG template.
   */
  render() {
    if (!this.svgContent) {
      return html``;
    }

    return html`${unsafeSVG(this.svgContent)}`;
  }
}
