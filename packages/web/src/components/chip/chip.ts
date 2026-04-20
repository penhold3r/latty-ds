import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { chipStyles } from './chip.styles';
import type { ChipVariant, ChipSize } from './chip.types';

/**
 * Chip component.
 *
 * @element lt-chip
 * @slot - Default slot content
 * @fires lt-delete
 */
@customElement('lt-chip')
export class Chip extends LitElement {
  static styles = chipStyles;

  @property({ reflect: true }) variant: ChipVariant = 'primary';

  @property({ reflect: true }) size: ChipSize = 'md';

  @property({ type: Boolean, reflect: true }) disabled = false;

  private _handleDelete() {
    this.dispatchEvent(new CustomEvent('lt-delete', { bubbles: true, composed: true }));
  }

  render() {
    return html`<slot></slot>`;
  }
}
