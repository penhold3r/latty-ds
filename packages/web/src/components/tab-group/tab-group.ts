import { enabledItems, rovingTargetOf, stepIndex } from '../shared/roving';
import { html, nothing } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property, query, queryAssignedElements, state } from 'lit/decorators.js';

import { tabGroupStyles } from './tab-group.styles';
import { TabGroupSize, TabGroupAppearance, TabGroupOrientation, TabGroupLabels } from './tab-group.types';
import type { Tab } from '../tab/tab';

import '../tab/tab';
import '../tab/tab-panel';
import '../icon-button/icon-button';

let groupCount = 0;

const DEFAULT_LABELS: TabGroupLabels = {
  scrollPrevious: 'Scroll tabs backward',
  scrollNext: 'Scroll tabs forward'
};

/**
 * A container component that manages a group of tabs.
 * @element lt-tab-group
 * @fires {CustomEvent<{value: string}>} change - Dispatched when a tab is selected
 * @slot - Tab elements
 * @slot panel - Tab panel content (use multiple panels with matching values)
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

  /** Overridable UI text (scroll button labels), for i18n. English defaults — override only the keys you need. */
  @property({ type: Object }) labels: Partial<TabGroupLabels> = {};

  private get _labels(): TabGroupLabels {
    return { ...DEFAULT_LABELS, ...this.labels };
  }

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

  @query('.tabs-container') private _tabsContainerEl!: HTMLElement;

  /*
   * Whether the tab list actually overflows its own container in the scrolling axis — controls whether the
   * scroll buttons render at all. Kept separate from _atStart/_atEnd below so toggling an edge while already
   * overflowing (the common case, every scroll tick) never adds/removes the buttons themselves and reflows the
   * available width for the tabs-container — only a genuine start/end of overflow does that, which is far rarer.
   */
  @state() private _overflowing = false;
  @state() private _atStart = false;
  @state() private _atEnd = false;

  /*
   * Measuring real DOM (scrollWidth/clientWidth) can only happen after a render has actually painted, so
   * _updateScrollButtons() sometimes sets the three @state fields above from inside firstUpdated()/updated() —
   * by that point Lit's own isUpdatePending has already gone false for the render in progress, so assigning them
   * synchronously schedules a genuinely separate follow-up update that the update() call already in flight's own
   * updateComplete promise does NOT chain to (confirmed empirically: awaiting it once still left a pending
   * update behind — and overriding getUpdateComplete() to simply `await this.updateComplete` again deadlocks,
   * since that read re-enters this same override while the outer call is still resolving). Polling
   * isUpdatePending via microtasks instead sidesteps that re-entrancy: it reads the flag rather than awaiting
   * the promise machinery that produces it, so a single `await el.updateComplete` reliably sees the final
   * settled state instead of a stale pre-measurement default.
   */
  private _scrollButtonsSettled: Promise<void> = Promise.resolve();

  private _awaitScrollButtonsSettled(): Promise<void> {
    if (!this.isUpdatePending) return Promise.resolve();
    return new Promise((resolve) => {
      const check = () => (this.isUpdatePending ? queueMicrotask(check) : resolve());
      queueMicrotask(check);
    });
  }

  protected async getUpdateComplete(): Promise<boolean> {
    const result = await super.getUpdateComplete();
    await this._scrollButtonsSettled;
    return result;
  }

  private _scrollResizeObserver?: ResizeObserver;

  /*
   * Scopes generated tab/panel ids to this instance, so two groups on the same page whose tabs happen to share a
   * `value` (e.g. two groups each with a "settings" tab) don't collide.
   */
  private readonly _uid = `lt-tab-group-${groupCount++}`;

  /*
   * Reacts to a slotted tab's `disabled` attribute changing after the fact (e.g. a consumer disabling a tab
   * dynamically, with no accompanying change to this group's own value/size/appearance), so the roving tabindex
   * and keyboard navigation immediately stop landing on it.
   */
  private readonly _tabObserver = new MutationObserver(() => this.updateTabs());

  connectedCallback() {
    super.connectedCallback();
    this._tabObserver.observe(this, { attributes: true, attributeFilter: ['disabled'], subtree: true });
    /*
     * Re-attaches listeners after a reconnect (moving the group in the DOM disconnects and reconnects it
     * without re-running firstUpdated, which only ever fires once). Harmless before the first render too —
     * updateTabs/updatePanels no-op when `this.tabs`/`this.panels` aren't populated yet.
     */
    this.updateTabs();
    this.updatePanels();
  }

  /**
   * Lifecycle: Called after the element's DOM has been updated.
   */
  firstUpdated() {
    this.updateTabs();
    this.updatePanels();
    /*
     * The container itself resizing (e.g. the window, or a sibling panel growing/shrinking) is the one
     * overflow-affecting trigger none of updateTabs/handleSlotChange's call sites cover — ResizeObserver's
     * own first callback (fired as soon as observation starts) also gives the initial measurement, so no
     * separate up-front _updateScrollButtons() call is needed here.
     */
    this._scrollResizeObserver = new ResizeObserver(this._updateScrollButtons);
    this._scrollResizeObserver.observe(this._tabsContainerEl);
  }

  /**
   * Updates all tabs with the correct active/roving-tabindex state, size, and ARIA wiring.
   * @private
   */
  private updateTabs() {
    if (!this.tabs) return;

    /*
     * Roving tabindex (WAI-ARIA Tabs pattern): only one tab is ever a Tab stop. It's the active tab, or — if
     * none is active, or the active one is disabled — the first enabled tab, so the tablist is still reachable
     * in one Tab press.
     */
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

      /*
       * Listen for tab clicks and arrow/Home/End key navigation. Re-adding the same bound function reference is
       * a no-op per addEventListener's own de-duplication, so calling this repeatedly (slotchange, value/size/
       * appearance changes) never stacks up duplicate listeners.
       */
      tab.addEventListener('click', this.handleTabClick);
      tab.addEventListener('keydown', this.handleTabKeydown);
    });

    this._updateScrollButtons();
  }

  /**
   * Recomputes whether the tab list overflows its container, and if so, whether it's scrolled to either edge.
   * Bound to the container's own `scroll` event, a `ResizeObserver` on it (catches window-resize-driven layout
   * changes), and called from every place that can change which/how many tabs are rendered.
   * @private
   */
  private _updateScrollButtons = () => {
    const el = this._tabsContainerEl;
    if (!el) return;
    /*
     * A 1px tolerance absorbs sub-pixel scroll-position rounding, which would otherwise flicker the buttons'
     * disabled state right at either edge.
     */
    if (this.orientation === 'vertical') {
      this._overflowing = el.scrollHeight > el.clientHeight + 1;
      this._atStart = el.scrollTop <= 1;
      this._atEnd = el.scrollTop >= el.scrollHeight - el.clientHeight - 1;
    } else {
      this._overflowing = el.scrollWidth > el.clientWidth + 1;
      this._atStart = el.scrollLeft <= 1;
      this._atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1;
    }
    /*
     * Captures a promise that resolves once any update the three assignments above just (re-)triggered has
     * actually settled — see the field's own comment for why this can't just be `this.updateComplete` directly.
     */
    this._scrollButtonsSettled = this._awaitScrollButtonsSettled();
  };

  /**
   * Scrolls the tab list by ~80% of its own visible size in the scrolling axis — far enough to feel like real
   * progress, short enough to keep context with what was already visible. Instant instead of smooth for anyone
   * who's asked the OS/browser to reduce motion.
   * @param {1 | -1} direction - The scroll direction (-1 for previous, 1 for next).
   * @returns {void}
   * @private
   */
  private _scrollBy(direction: 1 | -1) {
    const el = this._tabsContainerEl;
    if (!el) return;
    const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'instant'
      : 'smooth';
    if (this.orientation === 'vertical') {
      el.scrollBy({ top: el.clientHeight * 0.8 * direction, behavior });
    } else {
      el.scrollBy({ left: el.clientWidth * 0.8 * direction, behavior });
    }
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

    /*
     * A tab only points at a panel that actually exists, and only once that panel has its id — otherwise
     * aria-controls dangles (a tab with no panel, or a tab whose panel hasn't been wired up yet).
     */
    this.tabs?.forEach((tab) => {
      const panel = this.panels.find((p) => (p.getAttribute('value') ?? p.getAttribute('data-value')) === tab.value);
      if (panel) tab.setAttribute('aria-controls', panel.id);
      else tab.removeAttribute('aria-controls');
    });
  }

  /**
   * Selects a tab (used by both the click and keyboard-navigation handlers below).
   * @param {Tab} tab - The tab to select.
   * @returns {void}
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
   * @param {Event} e - The click event.
   * @returns {void}
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
   * @param {KeyboardEvent} e - The keyboard event.
   * @returns {void}
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
    this._scrollResizeObserver?.disconnect();
    if (this.tabs) {
      this.tabs.forEach((tab) => {
        tab.removeEventListener('click', this.handleTabClick);
        tab.removeEventListener('keydown', this.handleTabKeydown);
      });
    }
  }

  /**
   * Watch for value changes.
   * @param {Map<string, unknown>} changedProperties - The properties that changed.
   * @returns {void}
   */
  protected updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('value')) {
      this.updateTabs();
      this.updatePanels();
      /*
       * Keeps the active tab visible in a scrollable tablist even when `value` is set directly (not via click
       * or arrow-key navigation, where focus()'s own default scroll-into-view already covers it). `nearest`
       * on both axes scrolls the minimum necessary — never the whole page — and is a no-op when already in view.
       */
      this.tabs?.find((tab) => tab.value === this.value)?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }

    if (changedProperties.has('size') || changedProperties.has('appearance') || changedProperties.has('orientation')) {
      this.updateTabs();
    }
  }

  render() {
    const vertical = this.orientation === 'vertical';
    return html`
      <div class="tab-group">
        <div class="tablist-row">
          ${this._overflowing
            ? html`<lt-icon-button
                class="scroll-button scroll-prev"
                icon=${vertical ? 'caret-up' : 'caret-left'}
                label=${this._labels.scrollPrevious}
                size=${this.size}
                ?disabled=${this._atStart}
                @click=${() => this._scrollBy(-1)}
              ></lt-icon-button>`
            : nothing}
          <div
            class="tabs-container"
            role="tablist"
            aria-orientation=${vertical ? 'vertical' : nothing}
            @scroll=${this._updateScrollButtons}
          >
            <slot @slotchange=${this.handleSlotChange}></slot>
          </div>
          ${this._overflowing
            ? html`<lt-icon-button
                class="scroll-button scroll-next"
                icon=${vertical ? 'caret-down' : 'caret-right'}
                label=${this._labels.scrollNext}
                size=${this.size}
                ?disabled=${this._atEnd}
                @click=${() => this._scrollBy(1)}
              ></lt-icon-button>`
            : nothing}
        </div>
        <div class="panels-container" part="panels-container">
          <slot name="panel"></slot>
        </div>
      </div>
    `;
  }
}
