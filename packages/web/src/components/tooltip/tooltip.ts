import { html, type PropertyValues } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { tooltipStyles } from './tooltip.styles';
import type { TooltipPlacement } from './tooltip.types';
import { resolveColorValue } from '../../utils';
import '../text/text';

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
 * <lt-tooltip content="Opens in a new tab" placement="bottom"
 *   background="--lt-color-primary-600" color="#fff">
 *   <a href="#">Learn more</a>
 * </lt-tooltip>
 * ```
 */
@customElement('lt-tooltip')
export class Tooltip extends ThemeableElement {
  static styles = tooltipStyles;

  private _tooltipId = `lt-tooltip-${++_tooltipIdCounter}`;

  @query('slot') private _slot!: HTMLSlotElement;

  /** Tooltip label text. */
  @property({ reflect: true }) content = '';

  /** Placement of the tooltip relative to the trigger: top, bottom, left, or right. */
  @property({ reflect: true }) placement: TooltipPlacement = 'top';

  /** Prevent the tooltip from showing. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Background color override. Accepts a hex value (#1a1a2e) or a CSS token name (--lt-color-primary-600). */
  @property({ reflect: true }) background = '';

  /** Text color override. Accepts a hex value (#ffffff) or a CSS token name (--lt-color-neutral-50). */
  @property({ reflect: true }) color = '';

  // aria-describedby's id lookup only works within one tree: the tooltip bubble lives in this element's own
  // shadow root, but the trigger the id is set on is the slotted (light DOM) element — an id reference can't
  // cross that boundary, so no AT ever actually announces it (verified: resolves to nothing in the accessibility
  // tree). aria-description carries the text itself, so there's no id, and nothing to fail to resolve.
  private _describeTrigger() {
    const trigger = this._slot?.assignedElements()[0];
    trigger?.setAttribute('aria-description', this.content);
  }

  protected firstUpdated() {
    this._describeTrigger();
  }

  protected updated(changed: PropertyValues<this>) {
    super.updated(changed);
    if (changed.has('content')) this._describeTrigger();
  }

  render() {
    const tooltipStyle = styleMap({
      ...(this.background ? { '--_tooltip-bg': resolveColorValue(this.background) } : {}),
      ...(this.color ? { '--_tooltip-color': resolveColorValue(this.color) } : {})
    });

    return html`
      <slot></slot>
      <div class="tooltip" id=${this._tooltipId} role="tooltip" part="tooltip" aria-hidden="true" style=${tooltipStyle}>
        <lt-text variant="caption" as="span">${this.content}</lt-text>
        <span class="arrow" part="arrow"></span>
      </div>
    `;
  }
}
