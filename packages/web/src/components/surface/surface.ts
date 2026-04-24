import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { surfaceStyles } from './surface.styles';
import { SurfaceElevation, SurfaceVariant } from './surface.types';

/**
 * A container component that provides elevation and surface styling.
 * Used for cards, dropdowns, modals, and other elevated UI elements.
 *
 * @element lt-surface
 *
 * @slot - Content to be displayed within the surface
 *
 * @example
 * ```html
 * <lt-surface elevation="2">
 *   <p>This is a card with medium elevation</p>
 * </lt-surface>
 * ```
 *
 * @example
 * ```html
 * <lt-surface variant="outlined" elevation="0">
 *   <p>This is an outlined surface with no shadow</p>
 * </lt-surface>
 * ```
 *
 * @example
 * ```html
 * <lt-surface elevation="4">
 *   <h3>Modal Dialog</h3>
 *   <p>Content with high elevation for modals</p>
 * </lt-surface>
 * ```
 */
@customElement('lt-surface')
export class Surface extends LitElement {
  static styles = surfaceStyles;

  /**
   * Elevation level that determines shadow depth.
   * @default '1'
   */
  @property({ reflect: true }) elevation: SurfaceElevation = '1';

  /**
   * Visual variant that determines border and background.
   * @default 'filled'
   */
  @property({ reflect: true }) variant: SurfaceVariant = 'filled';

  /** Background color. Accepts a hex value (#1a1a2e) or a token name (--lt-color-primary-600). */
  @property({ attribute: 'background-color', reflect: true }) backgroundColor = '';

  private _resolve(value: string): string {
    return value.startsWith('--') ? `var(${value})` : value;
  }

  render() {
    const style = this.backgroundColor
      ? { '--_surface-bg': this._resolve(this.backgroundColor) }
      : {};

    return html`
      <div class="surface" part="surface" style=${styleMap(style)}>
        <slot></slot>
      </div>
    `;
  }
}
