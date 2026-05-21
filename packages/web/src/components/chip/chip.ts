import { html } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { chipStyles } from './chip.styles';
import '@latty/icons';
import type { ChipVariant, ChipSize, ChipAppearance } from './chip.types';
import { resolveColorValue, dispatch } from '../../utils';

/**
 * Compact label element for tags, filters, and attributes.
 *
 * @element lt-chip
 * @slot - Label content
 * @slot icon - Leading icon or avatar
 * @fires lt-delete - Fires when the delete button is clicked (only when `deletable`)
 *
 * @example
 * ```html
 * <lt-chip variant="primary">Design</lt-chip>
 * <lt-chip variant="success" deletable>Active</lt-chip>
 * ```
 */
@customElement('lt-chip')
export class Chip extends ThemeableElement {
  static styles = chipStyles;

  /** Visual appearance (filled tinted background or outlined border only). */
  @property({ reflect: true }) appearance: ChipAppearance = 'filled';

  /** Color scheme. */
  @property({ reflect: true }) variant: ChipVariant = 'primary';

  /** Size (affects height, font, and padding). */
  @property({ reflect: true }) size: ChipSize = 'md';

  /** Disables the chip and its delete button. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Shows a delete/dismiss button that fires `lt-delete` when clicked. */
  @property({ type: Boolean, reflect: true }) deletable = false;

  /** Background color override. Accepts a hex value (#1a1a2e) or a CSS token name (--lt-color-primary-600). */
  @property({ reflect: true }) background = '';

  private get _deleteIconSize() {
    return this.size === 'lg' ? 'sm' : 'xs';
  }

  private _handleDelete() {
    dispatch(this, 'lt-delete');
  }

  render() {
    const bgStyle = styleMap(this.background ? { background: resolveColorValue(this.background) } : {});
    return html`
      <span part="base" style=${bgStyle}>
        <slot name="icon"></slot>
        <slot></slot>
        ${this.deletable
          ? html`
              <button
                class="delete"
                part="delete-button"
                ?disabled=${this.disabled}
                aria-label="Remove"
                @click=${this._handleDelete}
              >
                <lt-icon name="xmark" size=${this._deleteIconSize}></lt-icon>
              </button>
            `
          : ''}
      </span>
    `;
  }
}
