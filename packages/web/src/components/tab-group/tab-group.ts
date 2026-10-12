import { enabledItems, rovingTargetOf, stepIndex } from '../shared/roving';
import { html, nothing } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';

import { tabGroupStyles } from './tab-group.styles';
import { TabGroupSize, TabGroupAppearance, TabGroupOrientation } from './tab-group.types';
import type { Tab } from '../tab/tab';

import '../tab/tab';
import '../tab/tab-panel';

let groupCount = 0;

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
 * <lt-tab-group appearance="pills" value="home">
 *   <lt-tab value="home" icon-start="home" label="Home"></lt-tab>
 *   <lt-tab value="search" icon-start="search" label="Search"></lt-tab>
 *   <lt-tab value="settings" icon-start="settings" label="Settings"></lt-tab>
 *
 *   <div slot="panel" data-value="home">Home content</div>
 *   <div slot="panel" data-value="search">Search content</div>
 *   <div slot="panel" data-value="settings">Settings content</div>
 * </lt-tab-group>
 * ```
 */
@customElement('lt-tab-group')
export class TabGroup extends ThemeableElement {
  static styles = tabGroupStyles;

  /**
   * Currently selected tab value.
   * @default ''
   */
  @property({ reflect: true }) value = '';

  /**
   * Visual appearance of the tab group.
   * @default 'default'
   */
  @property({ reflect: true }) appearance: TabGroupAppearance = 'default';

  /**
   * Size of the tabs.
   * @default 'md'
   */
  @property({ reflect: true }) size: TabGroupSize = 'md';

  /**
   * Orientation of the tab list. Vertical stacks the tabs in a column beside the panels and swaps the keyboard
   * navigation from ArrowLeft/Right to ArrowUp/Down, per the WAI-ARIA Tabs pattern.
   * @default 'horizontal'
   */
  @property({ reflect: true }) orientation: TabGroupOrientation = 'horizontal';

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

  // Scopes generated tab/panel ids to this instance, so two groups on the same page whose tabs happen to share a
  // `value` (e.g. two groups each with a "settings" tab) don't collide.
  private readonly _uid = `lt-tab-group-${groupCount++}`;

  // Reacts to a slotted tab's `disabled` attribute changing after the fact (e.g. a consumer disabling a tab
  // dynamically, with no accompanying change to this group's own value/size/appearance), so the roving tabindex
  // and keyboard navigation immediately stop landing on it.
  private readonly _tabObserver = new MutationObserver(() => this.updateTabs());

  connectedCallback() {
    super.connectedCallback();
    this._tabObserver.observe(this, { attributes: true, attributeFilter: ['disabled'], subtree: true });
    // Re-attaches listeners after a reconnect (moving the group in the DOM disconnects and reconnects it
    // without re-running firstUpdated, which only ever fires once). Harmless before the first render too —
    // updateTabs/updatePanels no-op when `this.tabs`/`this.panels` aren't populated yet.
    this.updateTabs();
    this.updatePanels();
  }

  /**
   * Lifecycle: Called after the element's DOM has been updated.
   */
  firstUpdated() {
    this.updateTabs();
    this.updatePanels();
  }

  /**
   * Updates all tabs with the correct active/roving-tabindex state, size, and ARIA wiring.
   * @private
   */
  private updateTabs() {
    if (!this.tabs) return;

    // Roving tabindex (WAI-ARIA Tabs pattern): only one tab is ever a Tab stop. It's the active tab, or — if
    // none is active, or the active one is disabled — the first enabled tab, so the tablist is still reachable
    // in one Tab press.
    const enabled = enabledItems(this.tabs);
    const rovingTarget = rovingTargetOf(enabled, this.value);

    this.tabs.forEach((tab) => {
      // Set size
      tab.size = this.size;
      tab.orientation = this.orientation;

      // Set active state
      tab.active = tab.value === this.value;

      tab.tabIndex = tab === rovingTarget ? 0 : -1;
      if (!tab.id) tab.id = `${this._uid}-tab-${tab.value}`;

      // Set variant attribute for styling
      if (this.appearance === 'pills') {
        tab.setAttribute('data-variant', 'pills');
      } else {
        tab.removeAttribute('data-variant');
      }

      // Listen for tab clicks and arrow/Home/End key navigation. Re-adding the same bound function reference is
      // a no-op per addEventListener's own de-duplication, so calling this repeatedly (slotchange, value/size/
      // appearance changes) never stacks up duplicate listeners.
      tab.addEventListener('click', this.handleTabClick);
      tab.addEventListener('keydown', this.handleTabKeydown);
    });
  }

  /**
   * Updates panel visibility and ARIA wiring based on selected value.
   * @private
   */
  private updatePanels() {
    if (!this.panels) return;

    this.panels.forEach((panel) => {
      const panelValue = panel.getAttribute('value') ?? panel.getAttribute('data-value');
      if (panelValue === this.value) {
        panel.setAttribute('active', '');
      } else {
        panel.removeAttribute('active');
      }
      if (!panel.id) panel.id = `${this._uid}-panel-${panelValue}`;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', `${this._uid}-tab-${panelValue}`);
      if (!panel.hasAttribute('tabindex')) panel.setAttribute('tabindex', '0');
    });

    // A tab only points at a panel that actually exists, and only once that panel has its id — otherwise
    // aria-controls dangles (a tab with no panel, or a tab whose panel hasn't been wired up yet).
    this.tabs?.forEach((tab) => {
      const panel = this.panels.find((p) => (p.getAttribute('value') ?? p.getAttribute('data-value')) === tab.value);
      if (panel) tab.setAttribute('aria-controls', panel.id);
      else tab.removeAttribute('aria-controls');
    });
  }

  /**
   * Selects a tab (used by both the click and keyboard-navigation handlers below).
   * @private
   */
  private _select(tab: Tab) {
    if (tab.disabled || tab.value === this.value) return;

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
  }

  /**
   * Handles click events from tabs.
   * @private
   */
  private handleTabClick = (e: Event) => {
    this._select(e.currentTarget as Tab);
  };

  /**
   * ArrowLeft/Right (or ArrowUp/Down when `orientation="vertical"`, per the WAI-ARIA Tabs pattern) move the
   * roving tab stop (and, per the automatic-activation model, select the tab); Home/End jump to the first/last
   * enabled tab. Disabled tabs are skipped entirely, matching the radiogroup/listbox patterns elsewhere in the
   * DS.
   * @private
   */
  private handleTabKeydown = (e: KeyboardEvent) => {
    const enabled = enabledItems(this.tabs ?? []);
    if (enabled.length === 0) return;

    const forwardKey = this.orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
    const backwardKey = this.orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';

    const index = enabled.indexOf(e.currentTarget as Tab);
    let next: Tab | undefined;
    switch (e.key) {
      case forwardKey:
        next = enabled[stepIndex(index, enabled.length, 1)];
        break;
      case backwardKey:
        next = enabled[stepIndex(index, enabled.length, -1)];
        break;
      case 'Home':
        next = enabled[0];
        break;
      case 'End':
        next = enabled[enabled.length - 1];
        break;
    }
    if (!next) return;

    e.preventDefault();
    this._select(next);
    next.focus();
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
    this._tabObserver.disconnect();
    if (this.tabs) {
      this.tabs.forEach((tab) => {
        tab.removeEventListener('click', this.handleTabClick);
        tab.removeEventListener('keydown', this.handleTabKeydown);
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

    if (changedProperties.has('size') || changedProperties.has('appearance') || changedProperties.has('orientation')) {
      this.updateTabs();
    }
  }

  render() {
    return html`
      <div class="tab-group">
        <div
          class="tabs-container"
          role="tablist"
          aria-orientation=${this.orientation === 'vertical' ? 'vertical' : nothing}
        >
          <slot @slotchange=${this.handleSlotChange}></slot>
        </div>
        <div class="panels-container" part="panels-container">
          <slot name="panel"></slot>
        </div>
      </div>
    `;
  }
}
