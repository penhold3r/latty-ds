import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Tab } from '../tab';
import '../tab';

describe('<lt-tab>', () => {
  let el: Tab;

  beforeEach(async () => {
    el = document.createElement('lt-tab') as Tab;
    el.label = 'Test tab';
    el.value = 'test';
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders a span in shadow DOM (not a button — avoids nested-interactive)', () => {
    const span = el.shadowRoot!.querySelector('span.tab');
    expect(span).toBeTruthy();
    expect(el.shadowRoot!.querySelector('button')).toBeNull();
  });

  it('has default size of md', () => {
    expect(el.size).toBe('md');
    expect(el.getAttribute('size')).toBe('md');
  });

  it('is not active by default', () => {
    expect(el.active).toBe(false);
  });

  it('is not disabled by default', () => {
    expect(el.disabled).toBe(false);
  });

  it('renders label text', () => {
    const label = el.shadowRoot!.querySelector('.label');
    expect(label?.textContent).toContain('Test tab');
  });

  it('has role="tab" on host element', () => {
    expect(el.getAttribute('role')).toBe('tab');
  });

  it('sets aria-selected on host element', async () => {
    expect(el.getAttribute('aria-selected')).toBe('false');
    el.active = true;
    await el.updateComplete;
    expect(el.getAttribute('aria-selected')).toBe('true');
  });

  it('reflects disabled attribute to host element', async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute('disabled')).toBe(true);
  });

  it.each(['sm', 'md', 'lg'] as const)('reflects %s size to attribute', async (size) => {
    el.size = size;
    await el.updateComplete;
    expect(el.getAttribute('size')).toBe(size);
  });

  it('renders icon when provided', async () => {
    el.iconStart = 'home';
    await el.updateComplete;
    const icon = el.shadowRoot!.querySelector('lt-icon');
    expect(icon).toBeTruthy();
    expect(icon?.getAttribute('name')).toBe('home');
  });

  it('does not render icon when not provided', () => {
    const icon = el.shadowRoot!.querySelector('lt-icon');
    expect(icon).toBeFalsy();
  });

  it('dispatches tab-click event when host is clicked', async () => {
    let eventFired = false;
    let eventValue = '';

    el.addEventListener('tab-click', ((e: CustomEvent) => {
      eventFired = true;
      eventValue = e.detail.value;
    }) as EventListener);

    el.click();
    await el.updateComplete;

    expect(eventFired).toBe(true);
    expect(eventValue).toBe('test');
  });

  it('does not dispatch event when disabled and clicked', async () => {
    el.disabled = true;
    await el.updateComplete;

    let eventFired = false;
    el.addEventListener('tab-click', () => {
      eventFired = true;
    });

    el.click();
    await el.updateComplete;

    expect(eventFired).toBe(false);
  });
});
