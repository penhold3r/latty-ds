import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { dividerStyles } from './divider.styles';
import type { DividerOrientation, DividerVariant } from './divider.types';

/**
 * A visual separator between content sections.
 * Supports horizontal and vertical orientations, an optional centered label, and line styles.
 *
 * @element lt-divider
 *
 * @example
 * ```html
 * <lt-divider></lt-divider>
 * <lt-divider label="or"></lt-divider>
 * <lt-divider variant="dashed"></lt-divider>
 * <lt-divider orientation="vertical"></lt-divider>
 * ```
 */
@customElement('lt-divider')
export class Divider extends LitElement {
  static styles = dividerStyles;

  /**
   * Layout orientation of the divider line.
   * @default 'horizontal'
   */
  @property({ reflect: true }) orientation: DividerOrientation = 'horizontal';

  /**
   * Line style of the divider.
   * @default 'solid'
   */
  @property({ reflect: true }) variant: DividerVariant = 'solid';

  /**
   * Optional label text centered within the divider line.
   * @default ''
   */
  @property() label = '';

  render() {
    return html`
      <div part="base" role="separator" aria-orientation=${this.orientation}>
        ${this.label ? html`<span part="label">${this.label}</span>` : ''}
      </div>
    `;
  }
}
