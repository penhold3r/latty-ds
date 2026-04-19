import { LitElement, html } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';

import { tabGroupStyles } from './tab-group.styles';
import { TabGroupSize, TabGroupVariant } from './tab-group.types';
import type { Tab } from '../tab/tab';

import '../tab/tab';

/**
 * A container component that manages a group of tabs.
 *
 * @element lt-tab-group
 *
 * @fires {CustomEvent<{value: string}>} change - Dispatched when a tab is selected
 *
 * @slot - Tab elements
 * @slot panel - Tab panel content (use multiple panels with matching values)
 *
 * @example
 * ```html
 * <lt-tab-group value="profile">
 *   <lt-tab value="profile" label="Profile"></lt-tab>
 *   <lt-tab value="settings" label="Settings"></lt-tab>
 *
 *   <div slot="panel" data-value="profile">Profile content</div>
 *   <div slot="panel" data-value="settings">Settings content</div>
 * </lt-tab-group>
 * ```
 *
 * @example
 * ```html
 * <lt-tab-group variant="pills" value="home">
 *   <lt-tab value="home" icon="home" label="Home"></lt-tab>
 *   <lt-tab value="search" icon="search" label="Search"></lt-tab>
 *   <lt-tab value="settings" icon="settings" label="Settings"></lt-tab>
 *
 *   <div slot="panel" data-value="home">Home content</div>
 *   <div slot="panel" data-value="search">Search content</div>
 *   <div slot="panel" data-value="settings">Settings content</div>
 * </lt-tab-group>
 * ```
 */
@customElement('lt-tab-group')
export class TabGroup extends LitElement {
  static styles = tabGroupStyles;

  /**
   * Currently selected tab value.
   * @default ''
   */
  @property() value = '';

  /**
   * Visual variant of the tab group.
   * @default 'default'
   */
  @property({ reflect: true }) variant: TabGroupVariant = 'default';

  /**
   * Size of the tabs.
   * @default 'md'
   */
  @property({ reflect: true }) size: TabGroupSize = 'md';

  /**
   * Reference to all slotted tab elements.
   * @private
   */
  @queryAssignedElements({ selector: 'lt-tab' })
  private tabs!: Tab[];

  /**
   * Reference to all slotted panel elements.
   * @private
   */
  @queryAssignedElements({ slot: 'panel' })
  private panels!: HTMLElement[];

  /**
   * Lifecycle: Called after the element's DOM has been updated.
   */
  firstUpdated() {
    this.updateTabs();
    this.updatePanels();
  }

  /**
   * Updates all tabs with the correct active state and size.
   * @private
   */
  private updateTabs() {
    if (!this.tabs) return;

    this.tabs.forEach((tab) => {
      // Set size
      tab.size = this.size;

      // Set active state
      tab.active = tab.value === this.value;

      // Set variant attribute for styling
      if (this.variant === 'pills') {
        tab.setAttribute('data-variant', 'pills');
      } else {
        tab.removeAttribute('data-variant');
      }

      // Listen for tab clicks
      tab.addEventListener('tab-click', this.handleTabClick as EventListener);
    });
  }

  /**
   * Updates panel visibility based on selected value.
   * @private
   */
  private updatePanels() {
    if (!this.panels) return;

    this.panels.forEach((panel) => {
      const panelValue = panel.getAttribute('data-value');
      if (panelValue === this.value) {
        panel.setAttribute('active', '');
      } else {
        panel.removeAttribute('active');
      }
    });
  }

  /**
   * Handles click events from tabs.
   * @private
   */
  private handleTabClick = (e: CustomEvent) => {
    const tab = e.target as Tab;

    if (tab.disabled) return;

    this.value = tab.value;
    this.updateTabs();
    this.updatePanels();

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true
      })
    );
  };

  /**
   * Handles slot changes.
   * @private
   */
  private handleSlotChange() {
    this.updateTabs();
    this.updatePanels();
  }

  /**
   * Cleanup event listeners when component is removed.
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.tabs) {
      this.tabs.forEach((tab) => {
        tab.removeEventListener('tab-click', this.handleTabClick as EventListener);
      });
    }
  }

  /**
   * Watch for value changes.
   */
  protected updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('value')) {
      this.updateTabs();
      this.updatePanels();
    }

    if (changedProperties.has('size') || changedProperties.has('variant')) {
      this.updateTabs();
    }
  }

  render() {
    return html`
      <div class="tab-group" role="tablist">
        <div class="tabs-container">
          <slot @slotchange=${this.handleSlotChange}></slot>
        </div>
        <div class="panels-container">
          <slot name="panel"></slot>
        </div>
      </div>
    `;
  }
}
