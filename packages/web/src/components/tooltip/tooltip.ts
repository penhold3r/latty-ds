import { LitElement, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { tooltipStyles } from './tooltip.styles';
import type { TooltipPosition } from './tooltip.types';

let _tooltipIdCounter = 0;

/**
 * Floating label that appears on hover or focus of its trigger element.
 *
 * @element lt-tooltip
 *
 * @slot - The trigger element the tooltip is anchored to.
 *
 * @example
 * ```html
 * <lt-tooltip content="Save document">
 *   <lt-button>Save</lt-button>
 * </lt-tooltip>
 * ```
 *
 * @example
 * ```html
 * <lt-tooltip content="Opens in a new tab" position="bottom"
 *   background-color="--lt-color-primary-600" color="#fff">
 *   <a href="#">Learn more</a>
 * </lt-tooltip>
 * ```
 */
@customElement('lt-tooltip')
export class Tooltip extends LitElement {
  static styles = tooltipStyles;

  private _tooltipId = `lt-tooltip-${++_tooltipIdCounter}`;

  @query('slot') private _slot!: HTMLSlotElement;

  /** Tooltip label text. */
  @property({ reflect: true }) content = '';

  /** Position of the tooltip relative to the trigger: top, bottom, left, or right. */
  @property({ reflect: true }) position: TooltipPosition = 'top';

  /** Prevent the tooltip from showing. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Tooltip background color. Accepts a hex value (#1a1a2e) or a token name (--lt-color-primary-600). */
  @property({ attribute: 'background-color', reflect: true }) backgroundColor = '';

  /** Tooltip text color. Accepts a hex value (#ffffff) or a token name (--lt-color-neutral-50). */
  @property({ reflect: true }) color = '';

  private _resolve(value: string): string {
    return value.startsWith('--') ? `var(${value})` : value;
  }

  protected firstUpdated() {
    const trigger = this._slot?.assignedElements()[0];
    if (trigger) {
      trigger.setAttribute('aria-describedby', this._tooltipId);
    }
  }

  render() {
    const tooltipStyle = styleMap({
      ...(this.backgroundColor ? { '--_tooltip-bg': this._resolve(this.backgroundColor) } : {}),
      ...(this.color ? { '--_tooltip-color': this._resolve(this.color) } : {}),
    });

    return html`
      <slot></slot>
      <div
        class="tooltip"
        id=${this._tooltipId}
        role="tooltip"
        part="tooltip"
        aria-hidden="true"
        style=${tooltipStyle}
      >
        ${this.content}
        <span class="arrow" part="arrow"></span>
      </div>
    `;
  }
}
