import { html } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';

import { dividerStyles } from './divider.styles';
import type { DividerOrientation, DividerAppearance } from './divider.types';

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
 * <lt-divider appearance="dashed"></lt-divider>
 * <lt-divider orientation="vertical"></lt-divider>
 * ```
 */
@customElement('lt-divider')
export class Divider extends ThemeableElement {
  static styles = dividerStyles;

  /**
   * Layout orientation of the divider line.
   * @default 'horizontal'
   */
  @property({ reflect: true }) orientation: DividerOrientation = 'horizontal';

  /**
   * Line appearance of the divider.
   * @default 'solid'
   */
  @property({ reflect: true }) appearance: DividerAppearance = 'solid';

  /**
   * Optional label text centered within the divider line.
   * @default ''
   */
  @property({ reflect: true }) label = '';

  render() {
    return html`
      <div part="base" role="separator" aria-orientation=${this.orientation}>
        ${this.label ? html`<span part="label">${this.label}</span>` : ''}
      </div>
    `;
  }
}
