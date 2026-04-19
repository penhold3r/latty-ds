import { describe, it, expect, beforeEach, afterEach } from 'vitest';
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

  it('has default variant of default', () => {
    expect(el.variant).toBe('default');
    expect(el.getAttribute('variant')).toBe('default');
  });

  it('has default size of md', () => {
    expect(el.size).toBe('md');
    expect(el.getAttribute('size')).toBe('md');
  });

  it('supports all variants', async () => {
    const variants = ['default', 'pills'] as const;

    for (const variant of variants) {
      el.variant = variant;
      await el.updateComplete;
      expect(el.getAttribute('variant')).toBe(variant);
    }
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
});
