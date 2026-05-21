import { html } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { surfaceStyles } from './surface.styles';
import { SurfaceElevation, SurfaceAppearance } from './surface.types';
import { resolveColorValue } from '../../utils';

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
 * <lt-surface appearance="outlined" elevation="0">
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
export class Surface extends ThemeableElement {
  static styles = surfaceStyles;

  /**
   * Elevation level that determines shadow depth.
   * @default '1'
   */
  @property({ reflect: true }) elevation: SurfaceElevation = '1';

  /**
   * Visual appearance that determines border and background.
   * @default 'filled'
   */
  @property({ reflect: true }) appearance: SurfaceAppearance = 'filled';

  /** Background color override. Accepts a hex value (#1a1a2e) or a CSS token name (--lt-color-primary-600). */
  @property({ reflect: true }) background = '';

  render() {
    const style = this.background ? { '--_surface-bg': resolveColorValue(this.background) } : {};

    return html`
      <div class="surface" part="surface" style=${styleMap(style)}>
        <slot></slot>
      </div>
    `;
  }
}
