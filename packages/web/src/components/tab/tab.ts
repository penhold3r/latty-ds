import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { tabStyles } from './tab.styles';
import { TabSize } from './tab.types';

import '@latty/icons';

/**
 * A tab component that represents a single tab within a tab group.
 *
 * @element lt-tab
 *
 * @slot - The label/content of the tab
 *
 * @example
 * ```html
 * <lt-tab value="profile" active>Profile</lt-tab>
 * ```
 *
 * @example
 * ```html
 * <lt-tab value="settings" icon="settings">Settings</lt-tab>
 * ```
 */
@customElement('lt-tab')
export class Tab extends LitElement {
  static styles = tabStyles;

  /**
   * Label text for the tab.
   * @default ''
   */
  @property() label = '';

  /**
   * Value identifier for the tab.
   * @default ''
   */
  @property() value = '';

  /**
   * Icon name to display in the tab.
   * @default ''
   */
  @property() icon = '';

  /**
   * Whether this tab is currently active.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) active = false;

  /**
   * Whether the tab is disabled.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Size of the tab.
   * @default 'md'
   */
  @property({ reflect: true }) size: TabSize = 'md';

  /**
   * Handles tab click.
   * @private
   */
  private handleClick() {
    if (this.disabled) return;

    this.dispatchEvent(
      new CustomEvent('tab-click', {
        detail: { value: this.value },
        bubbles: true,
        composed: true
      })
    );
  }

  render() {
    return html`
      <button
        class="tab"
        role="tab"
        aria-selected=${this.active}
        ?disabled=${this.disabled}
        @click=${this.handleClick}
      >
        ${this.icon ? html`<lt-icon class="icon" name="${this.icon}"></lt-icon>` : ''}
        <span class="label"><slot>${this.label}</slot></span>
      </button>
    `;
  }
}
