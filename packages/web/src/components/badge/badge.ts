import { html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';

import { badgeStyles } from './badge.styles';
import type { BadgeVariant, BadgeSize, BadgeAppearance } from './badge.types';
import { SlottedContentController } from '../shared/slotted-content';

/**
 * A compact status label for categories, counts, and states.
 *
 * @element lt-badge
 *
 * @slot - Rich content, in place of the `content` attribute (icons, multiple text runs). `content`/`max` are
 *   ignored when anything is slotted.
 *
 * @example
 * ```html
 * <lt-badge variant="success" content="Active"></lt-badge>
 * <lt-badge variant="error" appearance="solid" content="Failed"></lt-badge>
 * <lt-badge variant="primary" content="New" dot></lt-badge>
 * <lt-badge variant="warning"></lt-badge>
 * <lt-badge variant="error" appearance="solid" content="150" max="99"></lt-badge>
 * ```
 */
@customElement('lt-badge')
export class Badge extends ThemeableElement {
  static styles = badgeStyles;

  private _slotted = new SlottedContentController(this);

  /** Visual style: tinted fill, outline only, or full-color solid. */
  @property({ reflect: true }) appearance: BadgeAppearance = 'filled';

  /** Color scheme. */
  @property({ reflect: true }) variant: BadgeVariant = 'primary';

  /** Size. */
  @property({ reflect: true }) size: BadgeSize = 'md';

  /** Label text. When empty (and nothing is slotted) the badge renders as a circle indicator. */
  @property({ reflect: true }) content = '';

  /**
   * Caps a numeric `content` at this value, past which it displays as `${max}+` (e.g. `content="150" max="99"` →
   * "99+"). Ignored when `content` isn't a plain non-negative integer, or when anything is slotted.
   */
  @property({ type: Number }) max?: number;

  /** Show a leading status dot (only visible when content is set). */
  @property({ type: Boolean, reflect: true }) dot = false;

  private get _displayContent(): string {
    if (this.max === undefined || this.content === '') return this.content;
    const n = Number(this.content);
    if (!Number.isInteger(n)) return this.content;
    return n > this.max ? `${this.max}+` : this.content;
  }

  render() {
    const hasContent = Boolean(this.content) || this._slotted.hasContent;
    return html`
      <span part="base" class=${classMap({ empty: !hasContent })}>
        ${this.dot ? html`<span class="dot" part="dot"></span>` : ''}
        <span class="content"><slot @slotchange=${this._slotted.onSlotChange}>${this._displayContent}</slot></span>
      </span>
    `;
  }
}
