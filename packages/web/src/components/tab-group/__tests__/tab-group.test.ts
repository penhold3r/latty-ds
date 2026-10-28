import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { TabGroup } from '../tab-group';
import '../tab-group';
import '../../tab/tab';

describe('<lt-tab-group>', () => {
  let el: TabGroup;

  beforeEach(async () => {
    el = document.createElement('lt-tab-group') as TabGroup;
    el.value = 'tab1';
    el.innerHTML = `
      <lt-tab value="tab1" label="Tab 1"></lt-tab>
      <lt-tab value="tab2" label="Tab 2"></lt-tab>
      <lt-tab value="tab3" label="Tab 3"></lt-tab>
      <div slot="panel" data-value="tab1">Panel 1</div>
      <div slot="panel" data-value="tab2">Panel 2</div>
      <div slot="panel" data-value="tab3">Panel 3</div>
    `;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders tab list in shadow DOM', () => {
    const tabList = el.shadowRoot!.querySelector('[role="tablist"]');
    expect(tabList).toBeTruthy();
  });

  it('has default appearance of default', () => {
    expect(el.appearance).toBe('default');
    expect(el.getAttribute('appearance')).toBe('default');
  });

  it('has default size of md', () => {
    expect(el.size).toBe('md');
    expect(el.getAttribute('size')).toBe('md');
  });

  it.each(['default', 'pills'] as const)('reflects %s appearance to attribute', async (appearance) => {
    el.appearance = appearance;
    await el.updateComplete;
    expect(el.getAttribute('appearance')).toBe(appearance);
  });

  it('supports all sizes', async () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    for (const size of sizes) {
      el.size = size;
      await el.updateComplete;
      expect(el.getAttribute('size')).toBe(size);
    }
  });

  it('sets initial value', () => {
    expect(el.value).toBe('tab1');
  });

  it('can change value', async () => {
    el.value = 'tab2';
    await el.updateComplete;
    expect(el.value).toBe('tab2');
  });

  it('renders tabs container', () => {
    const container = el.shadowRoot!.querySelector('.tabs-container');
    expect(container).toBeTruthy();
  });

  it('renders panels container', () => {
    const container = el.shadowRoot!.querySelector('.panels-container');
    expect(container).toBeTruthy();
  });

  it('selects a tab on click', () => {
    const [, tab2] = el.querySelectorAll('lt-tab');
    (tab2 as HTMLElement).click();
    expect(el.value).toBe('tab2');
  });

  it('keeps working after being moved in the DOM (reconnected) (TGP-2)', async () => {
    const otherParent = document.createElement('div');
    document.body.appendChild(otherParent);
    otherParent.appendChild(el); // disconnects then reconnects `el`
    await el.updateComplete;

    const [, tab2] = el.querySelectorAll('lt-tab');
    (tab2 as HTMLElement).click();
    expect(el.value).toBe('tab2');
    otherParent.remove();
  });

  it('dispatches change with the new value on click', () => {
    const handler = vi.fn();
    el.addEventListener('change', handler);
    const [, tab2] = el.querySelectorAll('lt-tab');
    (tab2 as HTMLElement).click();
    expect(handler).toHaveBeenCalledOnce();
    expect((handler.mock.calls[0][0] as CustomEvent).detail).toEqual({ value: 'tab2' });
  });

  describe('roving tabindex', () => {
    it('only the active tab is a Tab stop', () => {
      const [tab1, tab2, tab3] = el.querySelectorAll('lt-tab') as unknown as HTMLElement[];
      expect(tab1.tabIndex).toBe(0);
      expect(tab2.tabIndex).toBe(-1);
      expect(tab3.tabIndex).toBe(-1);
    });

    it('moves the tab stop when selection changes', async () => {
      const [tab1, tab2] = el.querySelectorAll('lt-tab') as unknown as HTMLElement[];
      el.value = 'tab2';
      await el.updateComplete;
      expect(tab1.tabIndex).toBe(-1);
      expect(tab2.tabIndex).toBe(0);
    });

    it('falls back to the first enabled tab when nothing matches the value', async () => {
      el.value = 'no-such-tab';
      await el.updateComplete;
      const [tab1] = el.querySelectorAll('lt-tab') as unknown as HTMLElement[];
      expect(tab1.tabIndex).toBe(0);
    });

    it('skips a disabled active tab, landing the roving stop on the first enabled one', async () => {
      const [tab1, tab2] = el.querySelectorAll('lt-tab') as unknown as (HTMLElement & {
        disabled: boolean;
        updateComplete: Promise<boolean>;
      })[];
      tab1.disabled = true;
      /*
       * Tab1's own reflection of `disabled` to an attribute, and the group's MutationObserver reacting to it,
       * both happen outside the group's own update cycle — wait for the tab's update, then flush the observer's
       * queued microtask, rather than just the group's updateComplete.
       */
      await tab1.updateComplete;
      await Promise.resolve();
      expect(tab1.tabIndex).toBe(-1);
      expect(tab2.tabIndex).toBe(0);
    });
  });

  describe('ARIA wiring', () => {
    it('gives each tab an id and points it at its panel via aria-controls', () => {
      const [tab1] = el.querySelectorAll('lt-tab');
      expect(tab1.id).toBeTruthy();
      const panel1 = el.querySelector('[data-value="tab1"]')!;
      expect(tab1.getAttribute('aria-controls')).toBe(panel1.id);
    });

    it('gives each panel role=tabpanel, tabindex=0, and aria-labelledby pointing at its tab', () => {
      const tab1 = el.querySelector('lt-tab')!;
      const panel1 = el.querySelector('[data-value="tab1"]')!;
      expect(panel1.getAttribute('role')).toBe('tabpanel');
      expect(panel1.getAttribute('tabindex')).toBe('0');
      expect(panel1.getAttribute('aria-labelledby')).toBe(tab1.id);
    });
  });

  describe('keyboard navigation', () => {
    const arrow = (target: Element, key: string) =>
      target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));

    it('ArrowRight selects and focuses the next tab', () => {
      const [tab1, tab2] = el.querySelectorAll('lt-tab');
      arrow(tab1, 'ArrowRight');
      expect(el.value).toBe('tab2');
      expect(document.activeElement).toBe(tab2);
    });

    it('ArrowRight wraps from the last tab to the first', () => {
      const [tab1, , tab3] = el.querySelectorAll('lt-tab');
      arrow(tab3, 'ArrowRight');
      expect(el.value).toBe('tab1');
      expect(document.activeElement).toBe(tab1);
    });

    it('ArrowLeft wraps from the first tab to the last', () => {
      const [tab1, , tab3] = el.querySelectorAll('lt-tab');
      arrow(tab1, 'ArrowLeft');
      expect(el.value).toBe('tab3');
      expect(document.activeElement).toBe(tab3);
    });

    it('Home/End jump to the first/last tab', () => {
      const [tab1, , tab3] = el.querySelectorAll('lt-tab');
      arrow(tab1, 'End');
      expect(el.value).toBe('tab3');
      arrow(tab3, 'Home');
      expect(el.value).toBe('tab1');
    });

    it('skips a disabled tab when navigating', async () => {
      const [tab1, tab2] = el.querySelectorAll('lt-tab') as unknown as (HTMLElement & { disabled: boolean })[];
      tab2.disabled = true;
      await el.updateComplete;
      arrow(tab1, 'ArrowRight');
      expect(el.value).toBe('tab3');
    });

    it('ignores other keys', () => {
      const [tab1] = el.querySelectorAll('lt-tab');
      arrow(tab1, 'a');
      expect(el.value).toBe('tab1');
    });
  });
});

describe('scrolls the active tab into view', () => {
  let el: TabGroup;

  beforeEach(async () => {
    el = document.createElement('lt-tab-group') as TabGroup;
    el.value = 'tab1';
    el.innerHTML = `
      <lt-tab value="tab1" label="Tab 1"></lt-tab>
      <lt-tab value="tab2" label="Tab 2"></lt-tab>
      <lt-tab value="tab3" label="Tab 3"></lt-tab>
      <div slot="panel" data-value="tab1">Panel 1</div>
      <div slot="panel" data-value="tab2">Panel 2</div>
      <div slot="panel" data-value="tab3">Panel 3</div>
    `;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('scrolls the newly active tab into view when value is set directly', async () => {
    const [, tab2] = el.querySelectorAll('lt-tab');
    const spy = vi.spyOn(tab2, 'scrollIntoView');

    el.value = 'tab2';
    await el.updateComplete;

    expect(spy).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' });
  });

  it('does not scroll a tab that is not becoming active', async () => {
    const [tab1] = el.querySelectorAll('lt-tab');
    const spy = vi.spyOn(tab1, 'scrollIntoView');

    el.value = 'tab2';
    await el.updateComplete;

    expect(spy).not.toHaveBeenCalled();
  });

  it('does nothing when value does not match any tab', async () => {
    const tabs = el.querySelectorAll('lt-tab');
    const spies = [...tabs].map((t) => vi.spyOn(t, 'scrollIntoView'));

    el.value = 'no-such-tab';
    await el.updateComplete;

    spies.forEach((spy) => expect(spy).not.toHaveBeenCalled());
  });
});

describe('orientation', () => {
  let el: TabGroup;

  beforeEach(async () => {
    el = document.createElement('lt-tab-group') as TabGroup;
    el.value = 'tab1';
    el.innerHTML = `
      <lt-tab value="tab1" label="Tab 1"></lt-tab>
      <lt-tab value="tab2" label="Tab 2"></lt-tab>
      <lt-tab value="tab3" label="Tab 3"></lt-tab>
      <div slot="panel" data-value="tab1">Panel 1</div>
      <div slot="panel" data-value="tab2">Panel 2</div>
      <div slot="panel" data-value="tab3">Panel 3</div>
    `;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  const arrow = (target: Element, key: string) =>
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));

  it('defaults to horizontal and omits aria-orientation', () => {
    expect(el.orientation).toBe('horizontal');
    expect(el.getAttribute('orientation')).toBe('horizontal');
    expect(el.shadowRoot!.querySelector('[role="tablist"]')!.hasAttribute('aria-orientation')).toBe(false);
  });

  it('sets aria-orientation="vertical" on the tablist', async () => {
    el.orientation = 'vertical';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('[role="tablist"]')!.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('forwards orientation to each tab', async () => {
    el.orientation = 'vertical';
    await el.updateComplete;
    const tabs = el.querySelectorAll('lt-tab');
    tabs.forEach((tab) => expect(tab.getAttribute('orientation')).toBe('vertical'));
  });

  it('ArrowDown/Up navigate when vertical; ArrowRight/Left do nothing', async () => {
    el.orientation = 'vertical';
    await el.updateComplete;
    const [tab1, tab2] = el.querySelectorAll('lt-tab');

    arrow(tab1, 'ArrowRight');
    expect(el.value).toBe('tab1');

    arrow(tab1, 'ArrowDown');
    expect(el.value).toBe('tab2');
    expect(document.activeElement).toBe(tab2);

    arrow(tab2, 'ArrowUp');
    expect(el.value).toBe('tab1');
  });

  it('ArrowRight/Left still navigate when horizontal; ArrowDown/Up do nothing', () => {
    const [tab1] = el.querySelectorAll('lt-tab');

    arrow(tab1, 'ArrowDown');
    expect(el.value).toBe('tab1');

    arrow(tab1, 'ArrowRight');
    expect(el.value).toBe('tab2');
  });

  it('Home/End still work regardless of orientation', async () => {
    el.orientation = 'vertical';
    await el.updateComplete;
    const [tab1, , tab3] = el.querySelectorAll('lt-tab');
    arrow(tab1, 'End');
    expect(el.value).toBe('tab3');
    arrow(tab3, 'Home');
    expect(el.value).toBe('tab1');
  });
});

describe('manual activation', () => {
  let el: TabGroup;

  const arrow = (target: Element, key: string) =>
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));

  beforeEach(async () => {
    el = document.createElement('lt-tab-group') as TabGroup;
    el.value = 'tab1';
    el.activation = 'manual';
    el.innerHTML = `
      <lt-tab value="tab1" label="Tab 1"></lt-tab>
      <lt-tab value="tab2" label="Tab 2"></lt-tab>
      <lt-tab value="tab3" label="Tab 3"></lt-tab>
      <div slot="panel" data-value="tab1">Panel 1</div>
      <div slot="panel" data-value="tab2">Panel 2</div>
      <div slot="panel" data-value="tab3">Panel 3</div>
    `;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('arrow keys move focus without changing the selected value', () => {
    const [tab1, tab2] = el.querySelectorAll('lt-tab');
    arrow(tab1, 'ArrowRight');
    expect(el.value).toBe('tab1');
    expect(document.activeElement).toBe(tab2);
  });

  it('Enter confirms the focused tab as the new selection', () => {
    const [tab1, tab2] = el.querySelectorAll('lt-tab');
    arrow(tab1, 'ArrowRight');
    expect(el.value).toBe('tab1');
    arrow(tab2, 'Enter');
    expect(el.value).toBe('tab2');
  });

  it('Space confirms the focused tab as the new selection', () => {
    const [tab1, tab2] = el.querySelectorAll('lt-tab');
    arrow(tab1, 'ArrowRight');
    arrow(tab2, ' ');
    expect(el.value).toBe('tab2');
  });

  it('moves roving tabindex to the focused tab so Tab lands back on it', () => {
    const [tab1, tab2] = el.querySelectorAll('lt-tab') as unknown as HTMLElement[];
    arrow(tab1, 'ArrowRight');
    expect(tab1.tabIndex).toBe(-1);
    expect(tab2.tabIndex).toBe(0);
  });

  it('Home/End move focus without selecting', () => {
    const [tab1, , tab3] = el.querySelectorAll('lt-tab');
    arrow(tab1, 'End');
    expect(el.value).toBe('tab1');
    expect(document.activeElement).toBe(tab3);
  });

  it('works with vertical orientation', async () => {
    el.orientation = 'vertical';
    await el.updateComplete;
    const [tab1, tab2] = el.querySelectorAll('lt-tab');
    arrow(tab1, 'ArrowDown');
    expect(el.value).toBe('tab1');
    expect(document.activeElement).toBe(tab2);
    arrow(tab2, 'Enter');
    expect(el.value).toBe('tab2');
  });

  it('dispatches change only on Enter/Space, not on arrow', () => {
    const handler = vi.fn();
    el.addEventListener('change', handler);
    const [tab1, tab2] = el.querySelectorAll('lt-tab');
    arrow(tab1, 'ArrowRight');
    expect(handler).not.toHaveBeenCalled();
    arrow(tab2, 'Enter');
    expect(handler).toHaveBeenCalledOnce();
  });
});

describe('aria-controls only points at a real panel', () => {
  it('links each tab to its own panel and leaves a tab with no panel unlinked', async () => {
    const group = document.createElement('lt-tab-group') as TabGroup;
    group.innerHTML = `
      <lt-tab value="a" label="A"></lt-tab>
      <lt-tab value="b" label="B"></lt-tab>
      <div slot="panel" data-value="a">A content</div>
    `;
    document.body.appendChild(group);
    await group.updateComplete;
    await new Promise((r) => setTimeout(r, 0));

    const tabA = group.querySelector('lt-tab[value="a"]')!;
    const tabB = group.querySelector('lt-tab[value="b"]')!;
    const panelA = group.querySelector('[data-value="a"]')!;
    expect(panelA.id).toBeTruthy();
    expect(tabA.getAttribute('aria-controls')).toBe(panelA.id);
    expect(document.getElementById(tabA.getAttribute('aria-controls')!)).toBe(panelA);
    expect(tabB.hasAttribute('aria-controls')).toBe(false);
    group.remove();
  });

  it('stays unlinked when a panel-less tab is disabled (the attribute observer runs updateTabs alone)', async () => {
    const group = document.createElement('lt-tab-group') as TabGroup;
    group.innerHTML = `
      <lt-tab value="a" label="A"></lt-tab>
      <lt-tab value="b" label="B"></lt-tab>
      <div slot="panel" data-value="a">A content</div>
    `;
    document.body.appendChild(group);
    await group.updateComplete;
    await new Promise((r) => setTimeout(r, 0));

    const tabB = group.querySelector('lt-tab[value="b"]')!;
    tabB.setAttribute('disabled', '');
    await new Promise((r) => setTimeout(r, 0));

    expect(tabB.hasAttribute('aria-controls')).toBe(false);
    group.remove();
  });
});

describe('scroll buttons', () => {
  let el: TabGroup;

  const container = () => el.shadowRoot!.querySelector<HTMLElement>('.tabs-container')!;
  const prevButton = () => el.shadowRoot!.querySelector<HTMLElement & { label: string; icon: string }>('.scroll-prev');
  const nextButton = () => el.shadowRoot!.querySelector<HTMLElement & { label: string; icon: string }>('.scroll-next');

  /*
   * jsdom reports 0 for every layout dimension, so "overflow" has to be simulated by overriding the relevant
   * getters directly on the real container element, then forcing a recompute the same way a real resize/scroll
   * would — dispatching the container's own `scroll` event, which the component already listens for.
   */
  const mockLayout = (dims: {
    scrollWidth?: number;
    clientWidth?: number;
    scrollLeft?: number;
    scrollHeight?: number;
    clientHeight?: number;
    scrollTop?: number;
  }) => {
    const el2 = container();
    for (const [key, value] of Object.entries(dims)) {
      Object.defineProperty(el2, key, { value, configurable: true });
    }
    el2.dispatchEvent(new Event('scroll'));
  };

  beforeEach(async () => {
    el = document.createElement('lt-tab-group') as TabGroup;
    el.value = 'tab1';
    el.innerHTML = `
      <lt-tab value="tab1" label="Tab 1"></lt-tab>
      <lt-tab value="tab2" label="Tab 2"></lt-tab>
      <lt-tab value="tab3" label="Tab 3"></lt-tab>
    `;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
    vi.restoreAllMocks();
  });

  it('settles after a single updateComplete, with no lingering pending update left behind', async () => {
    /*
     * Regression guard: _updateScrollButtons sets @state from inside firstUpdated()/updated(), which schedules
     * a genuinely separate follow-up update a naive `await el.updateComplete` would NOT wait for — confirmed
     * empirically while building this feature. getUpdateComplete() is overridden specifically to fix this.
     */
    const fresh = document.createElement('lt-tab-group') as TabGroup;
    fresh.value = 'tab1';
    fresh.innerHTML = '<lt-tab value="tab1" label="Tab 1"></lt-tab>';
    document.body.appendChild(fresh);
    await fresh.updateComplete;
    expect((fresh as unknown as { isUpdatePending: boolean }).isUpdatePending).toBe(false);
    fresh.remove();
  });

  it('renders no scroll buttons when the tab list does not overflow', () => {
    expect(prevButton()).toBeNull();
    expect(nextButton()).toBeNull();
  });

  it('renders both scroll buttons once the tab list overflows', async () => {
    mockLayout({ scrollWidth: 500, clientWidth: 200, scrollLeft: 0 });
    await el.updateComplete;
    expect(prevButton()).not.toBeNull();
    expect(nextButton()).not.toBeNull();
  });

  it('disables only the previous button while scrolled all the way to the start', async () => {
    mockLayout({ scrollWidth: 500, clientWidth: 200, scrollLeft: 0 });
    await el.updateComplete;
    expect(prevButton()!.hasAttribute('disabled')).toBe(true);
    expect(nextButton()!.hasAttribute('disabled')).toBe(false);
  });

  it('disables only the next button while scrolled all the way to the end', async () => {
    mockLayout({ scrollWidth: 500, clientWidth: 200, scrollLeft: 300 });
    await el.updateComplete;
    expect(prevButton()!.hasAttribute('disabled')).toBe(false);
    expect(nextButton()!.hasAttribute('disabled')).toBe(true);
  });

  it('disables neither button in the middle of a scroll', async () => {
    mockLayout({ scrollWidth: 500, clientWidth: 200, scrollLeft: 150 });
    await el.updateComplete;
    expect(prevButton()!.hasAttribute('disabled')).toBe(false);
    expect(nextButton()!.hasAttribute('disabled')).toBe(false);
  });

  it('removes the buttons again once content no longer overflows', async () => {
    mockLayout({ scrollWidth: 500, clientWidth: 200, scrollLeft: 0 });
    await el.updateComplete;
    expect(prevButton()).not.toBeNull();

    mockLayout({ scrollWidth: 200, clientWidth: 200, scrollLeft: 0 });
    await el.updateComplete;
    expect(prevButton()).toBeNull();
    expect(nextButton()).toBeNull();
  });

  it('clicking previous scrolls backward by ~80% of the visible width', async () => {
    mockLayout({ scrollWidth: 500, clientWidth: 200, scrollLeft: 150 });
    await el.updateComplete;
    const scrollBySpy = vi.spyOn(Element.prototype, 'scrollBy');

    prevButton()!.dispatchEvent(new Event('click', { bubbles: true }));
    expect(scrollBySpy).toHaveBeenCalledWith(expect.objectContaining({ left: -160 }));
  });

  it('clicking next scrolls forward by ~80% of the visible width', async () => {
    mockLayout({ scrollWidth: 500, clientWidth: 200, scrollLeft: 150 });
    await el.updateComplete;
    const scrollBySpy = vi.spyOn(Element.prototype, 'scrollBy');

    nextButton()!.dispatchEvent(new Event('click', { bubbles: true }));
    expect(scrollBySpy).toHaveBeenCalledWith(expect.objectContaining({ left: 160 }));
  });

  it('scrolls with a smooth behavior by default', async () => {
    mockLayout({ scrollWidth: 500, clientWidth: 200, scrollLeft: 150 });
    await el.updateComplete;
    const scrollBySpy = vi.spyOn(Element.prototype, 'scrollBy');

    nextButton()!.dispatchEvent(new Event('click', { bubbles: true }));
    expect(scrollBySpy).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'smooth' }));
  });

  it('scrolls instantly when the user has asked to reduce motion', async () => {
    mockLayout({ scrollWidth: 500, clientWidth: 200, scrollLeft: 150 });
    await el.updateComplete;
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query) => ({ matches: query === '(prefers-reduced-motion: reduce)' }) as MediaQueryList
    );
    const scrollBySpy = vi.spyOn(Element.prototype, 'scrollBy');

    nextButton()!.dispatchEvent(new Event('click', { bubbles: true }));
    expect(scrollBySpy).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'instant' }));
  });

  it('uses left/right caret icons and scrollWidth/scrollLeft when horizontal', async () => {
    mockLayout({ scrollWidth: 500, clientWidth: 200, scrollLeft: 0 });
    await el.updateComplete;
    expect(prevButton()!.icon).toBe('caret-left');
    expect(nextButton()!.icon).toBe('caret-right');
  });

  it('uses up/down caret icons and scrollHeight/scrollTop when vertical', async () => {
    el.orientation = 'vertical';
    await el.updateComplete;
    mockLayout({ scrollHeight: 500, clientHeight: 200, scrollTop: 0 });
    await el.updateComplete;
    expect(prevButton()!.icon).toBe('caret-up');
    expect(nextButton()!.icon).toBe('caret-down');
    expect(prevButton()!.hasAttribute('disabled')).toBe(true);
  });

  it('applies default English labels', async () => {
    mockLayout({ scrollWidth: 500, clientWidth: 200, scrollLeft: 0 });
    await el.updateComplete;
    expect(prevButton()!.label).toBe('Scroll tabs backward');
    expect(nextButton()!.label).toBe('Scroll tabs forward');
  });

  it('overrides only the given label keys', async () => {
    el.labels = { scrollPrevious: 'Back' };
    mockLayout({ scrollWidth: 500, clientWidth: 200, scrollLeft: 0 });
    await el.updateComplete;
    expect(prevButton()!.label).toBe('Back');
    expect(nextButton()!.label).toBe('Scroll tabs forward');
  });

  it('disconnects the ResizeObserver on disconnect', async () => {
    const disconnectSpy = vi.spyOn(globalThis.ResizeObserver.prototype, 'disconnect');
    el.remove();
    expect(disconnectSpy).toHaveBeenCalled();
  });
});
