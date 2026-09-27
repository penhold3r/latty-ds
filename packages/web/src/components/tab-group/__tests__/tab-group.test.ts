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
      // Tab1's own reflection of `disabled` to an attribute, and the group's MutationObserver reacting to it,
      // both happen outside the group's own update cycle — wait for the tab's update, then flush the observer's
      // queued microtask, rather than just the group's updateComplete.
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
