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

  it('has default orientation of horizontal', () => {
    expect(el.orientation).toBe('horizontal');
    expect(el.getAttribute('orientation')).toBe('horizontal');
  });

  it('reflects vertical orientation to attribute', async () => {
    el.orientation = 'vertical';
    await el.updateComplete;
    expect(el.getAttribute('orientation')).toBe('vertical');
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

  it.each(['Enter', ' '] as const)('activates with a native click on the host when %j is pressed', async (key) => {
    let clicks = 0;
    el.addEventListener('click', () => clicks++);

    el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    await el.updateComplete;

    expect(clicks).toBe(1);
  });

  it('ignores other keys', async () => {
    let clicks = 0;
    el.addEventListener('click', () => clicks++);

    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true, cancelable: true }));
    await el.updateComplete;

    expect(clicks).toBe(0);
  });

  it('does not activate from the keyboard when disabled', async () => {
    el.disabled = true;
    await el.updateComplete;

    let clicks = 0;
    el.addEventListener('click', () => clicks++);
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    await el.updateComplete;

    expect(clicks).toBe(0);
  });
});
