import { html } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';

import { dropdownItemStyles } from './dropdown-item.styles';
import { dispatch } from '../../utils';

/**
 * A menu item for use inside lt-dropdown.
 *
 * @element lt-dropdown-item
 * @slot - Item label / content
 * @fires {CustomEvent} lt-select - Fired when the item is activated (click or Enter/Space)
 */
@customElement('lt-dropdown-item')
export class DropdownItem extends ThemeableElement {
  static styles = dropdownItemStyles;
  static shadowRootOptions = { ...ThemeableElement.shadowRootOptions, delegatesFocus: true };

  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) selected = false;
  @property() href = '';

  private _onActivate() {
    if (this.disabled) return;
    dispatch(this, 'lt-select', { item: this });
  }

  render() {
    if (this.href) {
      return html`
        <a
          class="item"
          href=${this.href}
          role="menuitem"
          tabindex=${this.disabled ? '-1' : '0'}
          aria-disabled=${this.disabled}
          @click=${this._onActivate}
        >
          <slot></slot>
        </a>
      `;
    }

    return html`
      <button
        class="item"
        role="menuitem"
        tabindex=${this.disabled ? '-1' : '0'}
        ?disabled=${this.disabled}
        @click=${this._onActivate}
      >
        <slot></slot>
      </button>
    `;
  }
}
