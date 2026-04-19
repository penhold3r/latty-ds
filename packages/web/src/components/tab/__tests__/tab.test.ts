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

  it('renders a button in shadow DOM', () => {
    const button = el.shadowRoot!.querySelector('button');
    expect(button).toBeTruthy();
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

  it('can be set to active', async () => {
    el.active = true;
    await el.updateComplete;
    const button = el.shadowRoot!.querySelector('button');
    expect(button?.getAttribute('aria-selected')).toBe('true');
  });

  it('can be disabled', async () => {
    el.disabled = true;
    await el.updateComplete;
    const button = el.shadowRoot!.querySelector('button');
    expect(button?.hasAttribute('disabled')).toBe(true);
  });

  it('supports all sizes', async () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    for (const size of sizes) {
      el.size = size;
      await el.updateComplete;
      expect(el.getAttribute('size')).toBe(size);
    }
  });

  it('renders icon when provided', async () => {
    el.icon = 'home';
    await el.updateComplete;
    const icon = el.shadowRoot!.querySelector('lt-icon');
    expect(icon).toBeTruthy();
    expect(icon?.getAttribute('name')).toBe('home');
  });

  it('does not render icon when not provided', () => {
    const icon = el.shadowRoot!.querySelector('lt-icon');
    expect(icon).toBeFalsy();
  });

  it('dispatches tab-click event when clicked', async () => {
    let eventFired = false;
    let eventValue = '';

    el.addEventListener('tab-click', ((e: CustomEvent) => {
      eventFired = true;
      eventValue = e.detail.value;
    }) as EventListener);

    const button = el.shadowRoot!.querySelector('button') as HTMLButtonElement;
    button.click();

    await el.updateComplete;

    expect(eventFired).toBe(true);
    expect(eventValue).toBe('test');
  });

  it('does not dispatch event when disabled', async () => {
    el.disabled = true;
    await el.updateComplete;

    let eventFired = false;

    el.addEventListener('tab-click', () => {
      eventFired = true;
    });

    const button = el.shadowRoot!.querySelector('button') as HTMLButtonElement;
    button.click();

    await el.updateComplete;

    expect(eventFired).toBe(false);
  });
});
