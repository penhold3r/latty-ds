import { html } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';

import { tabPanelStyles } from './tab-panel.styles';

/**
 * A panel associated with a tab. Shown when the matching tab is active.
 * Place inside `lt-tab-group` using `slot="panel"`.
 *
 * @element lt-tab-panel
 *
 * @slot - Panel content
 *
 * @example
 * ```html
 * <lt-tab-group value="overview">
 *   <lt-tab value="overview" label="Overview"></lt-tab>
 *   <lt-tab value="settings" label="Settings"></lt-tab>
 *
 *   <lt-tab-panel slot="panel" value="overview">Overview content</lt-tab-panel>
 *   <lt-tab-panel slot="panel" value="settings">Settings content</lt-tab-panel>
 * </lt-tab-group>
 * ```
 */
@customElement('lt-tab-panel')
export class TabPanel extends ThemeableElement {
  static styles = tabPanelStyles;

  /** Value that matches the corresponding `lt-tab`. */
  @property({ reflect: true }) value = '';

  /** Set by `lt-tab-group` when this panel's tab is active. */
  @property({ type: Boolean, reflect: true }) active = false;

  render() {
    return html`<slot></slot>`;
  }
}
