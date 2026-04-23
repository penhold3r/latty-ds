import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { badgeStyles } from './badge.styles';
import type { BadgeVariant, BadgeSize, BadgeAppearance } from './badge.types';

/**
 * A compact status label for categories, counts, and states.
 *
 * @element lt-badge
 *
 * @example
 * ```html
 * <lt-badge variant="success" content="Active" />
 * <lt-badge variant="error" appearance="solid" content="Failed" />
 * <lt-badge variant="primary" content="New" dot />
 * <lt-badge variant="warning" />
 * ```
 */
@customElement('lt-badge')
export class Badge extends LitElement {
  static styles = badgeStyles;

  /** Visual style: tinted fill, outline only, or full-color solid. */
  @property({ reflect: true }) appearance: BadgeAppearance = 'filled';

  /** Color scheme. */
  @property({ reflect: true }) variant: BadgeVariant = 'primary';

  /** Size. */
  @property({ reflect: true }) size: BadgeSize = 'md';

  /** Label text. When empty the badge renders as a circle indicator. */
  @property({ reflect: true }) content = '';

  /** Show a leading status dot (only visible when content is set). */
  @property({ type: Boolean, reflect: true }) dot = false;

  render() {
    return html`
      <span part="base">
        ${this.dot ? html`<span class="dot" part="dot"></span>` : ''}
        ${this.content}
      </span>
    `;
  }
}
