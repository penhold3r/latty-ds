import { html, nothing, type PropertyValues } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { chipStyles } from './chip.styles';
import '@latty-ds/icons';
import type { ChipVariant, ChipSize, ChipAppearance, ChipLabels } from './chip.types';
import { resolveColorValue, pickTextColor, dispatch } from '../../utils';

const DEFAULT_LABELS: ChipLabels = {
  remove: 'Remove'
};

/**
 * Compact label element for tags, filters, and attributes.
 * @element lt-chip
 * @slot - Label content
 * @slot icon - Leading icon or avatar
 * @fires delete - Fires when the delete button is clicked, or Backspace is pressed while the chip or its delete
 *   button has focus (only when `deletable`)
 * @fires {CustomEvent<{selected: boolean}>} change - Fires when `selectable` is set and the chip is activated
 *   (click, or Enter/Space while the chip itself has focus)
 * @example
 * ```html
 * <lt-chip variant="primary">Design</lt-chip>
 * <lt-chip variant="success" deletable>Active</lt-chip>
 * ```
 * @example
 * ```html
 * <!-- Filter chip: clicking toggles `selected` and dispatches `change` -->
 * <lt-chip variant="primary" selectable selected>In stock</lt-chip>
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

  /** Shows a delete/dismiss button that fires `delete` when clicked. */
  @property({ type: Boolean, reflect: true }) deletable = false;

  /**
   * Enables filter-chip behavior: the chip itself becomes a toggle button (`role="button"`, keyboard-reachable,
   * `aria-pressed` reflecting `selected`). Clicking it (outside the delete button) or pressing Enter/Space while
   * it has focus flips `selected` and dispatches `change`.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) selectable = false;

  /**
   * Current selected state. Only meaningful with `selectable`; settable directly for a controlled filter chip.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) selected = false;

  /** Background color override. Accepts a hex value (#1a1a2e) or a CSS token name (--lt-color-primary-600). */
  @property({ reflect: true }) background = '';

  /** Overridable UI text (the delete button's accessible name), for i18n. English defaults — override only the keys you need. */
  @property({ type: Object }) labels: Partial<ChipLabels> = {};

  private get _labels(): ChipLabels {
    return { ...DEFAULT_LABELS, ...this.labels };
  }

  private get _deleteIconSize() {
    return this.size === 'lg' ? 'sm' : 'xs';
  }

  private _handleDelete(e: Event) {
    /*
     * Stops the click from also bubbling to the chip's own click handler below — the delete button and
     * selectable-chip toggling are two independent actions sharing the same element.
     */
    e.stopPropagation();
    dispatch(this, 'delete');
  }

  private _toggleSelected() {
    this.selected = !this.selected;
    dispatch(this, 'change', { selected: this.selected });
  }

  private _handleClick() {
    if (!this.selectable || this.disabled) return;
    this._toggleSelected();
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (this.disabled) return;
    if (e.key === 'Backspace' && this.deletable) {
      e.preventDefault();
      this._handleDelete(e);
      return;
    }
    /*
     * e.target === e.currentTarget scopes this to the chip itself — the delete button is a real native <button>
     * and already handles its own Enter/Space activation; re-triggering selection here too would double-fire.
     */
    if (this.selectable && e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      this._toggleSelected();
    }
  }

  protected override updated(changed: PropertyValues<this>) {
    super.updated(changed);
    if (changed.has('background')) {
      if (this.background) {
        const color = pickTextColor(this, 'base');
        this.style.setProperty('--_chip-on-bg', color);
      } else {
        this.style.removeProperty('--_chip-on-bg');
      }
    }
  }

  render() {
    const bgStyle = styleMap(this.background ? { background: resolveColorValue(this.background) } : {});
    return html`
      <span
        part="base"
        style=${bgStyle}
        tabindex=${this.selectable && !this.disabled ? '0' : nothing}
        role=${this.selectable ? 'button' : nothing}
        aria-pressed=${this.selectable ? (this.selected ? 'true' : 'false') : nothing}
        aria-disabled=${this.selectable && this.disabled ? 'true' : nothing}
        @click=${this._handleClick}
        @keydown=${this._handleKeydown}
      >
        <slot name="icon"></slot>
        <slot></slot>
        ${this.deletable
          ? html`
              <button
                class="delete"
                part="delete-button"
                ?disabled=${this.disabled}
                aria-label=${this._labels.remove}
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
