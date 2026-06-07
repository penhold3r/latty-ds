import { html } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';

import { tabStyles } from './tab.styles';
import { TabSize } from './tab.types';

import '@latty-ds/icons';

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
 * <lt-tab value="settings" icon-start="settings">Settings</lt-tab>
 * ```
 */
@customElement('lt-tab')
export class Tab extends ThemeableElement {
  static styles = tabStyles;

  /**
   * Label text for the tab.
   * @default ''
   */
  @property({ reflect: true }) label = '';

  /**
   * Value identifier for the tab.
   * @default ''
   */
  @property({ reflect: true }) value = '';

  /**
   * Icon name to display at the start of the tab.
   * @default ''
   */
  @property({ attribute: 'icon-start' }) iconStart = '';

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

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'tab');
    this.tabIndex = 0;
    this.addEventListener('click', this._handleHostClick);
    this.addEventListener('keydown', this._handleHostKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this._handleHostClick);
    this.removeEventListener('keydown', this._handleHostKeydown);
  }

  protected updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has('active')) {
      this.setAttribute('aria-selected', String(this.active));
    }
    if (changedProperties.has('disabled')) {
      this.setAttribute('aria-disabled', String(this.disabled));
    }
  }

  private _handleHostClick = () => {
    if (this.disabled) return;
    this.dispatchEvent(
      new CustomEvent('tab-click', {
        detail: { value: this.value },
        bubbles: true,
        composed: true
      })
    );
  };

  private _handleHostKeydown = (e: KeyboardEvent) => {
    if (this.disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handleHostClick();
    }
  };

  render() {
    return html`
      <span class="tab">
        ${this.iconStart ? html`<lt-icon class="icon" name="${this.iconStart}"></lt-icon>` : ''}
        <span class="label"><slot>${this.label}</slot></span>
      </span>
    `;
  }
}
