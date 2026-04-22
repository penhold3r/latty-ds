import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { chipStyles } from './chip.styles';
import '@latty/icons';
import type { ChipVariant, ChipSize, ChipAppearance } from './chip.types';

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
export class Chip extends LitElement {
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

  private get _deleteIconSize() {
    return this.size === 'lg' ? 'sm' : 'xs';
  }

  private _handleDelete() {
    this.dispatchEvent(new CustomEvent('lt-delete', { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <span part="base">
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
