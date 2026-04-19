import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Switch } from '../switch';
import '../switch';

describe('<lt-switch>', () => {
  let el: Switch;

  beforeEach(async () => {
    el = document.createElement('lt-switch') as Switch;
    el.label = 'Test switch';
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders a checkbox input in shadow DOM', () => {
    const input = el.shadowRoot!.querySelector('input[type="checkbox"]');
    expect(input).toBeTruthy();
  });

  it('has role="switch" on input', () => {
    const input = el.shadowRoot!.querySelector('input[role="switch"]');
    expect(input).toBeTruthy();
  });

  it('has default variant of primary', () => {
    expect(el.variant).toBe('primary');
    expect(el.getAttribute('variant')).toBe('primary');
  });

  it('has default size of md', () => {
    expect(el.size).toBe('md');
    expect(el.getAttribute('size')).toBe('md');
  });

  it('is not checked by default', () => {
    expect(el.checked).toBe(false);
    const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input.checked).toBe(false);
  });

  it('is not disabled by default', () => {
    expect(el.disabled).toBe(false);
  });

  it('can be checked', async () => {
    el.checked = true;
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it('can be disabled', async () => {
    el.disabled = true;
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('dispatches change event when toggled', async () => {
    let eventFired = false;
    let eventChecked = false;

    el.addEventListener('change', ((e: CustomEvent) => {
      eventFired = true;
      eventChecked = e.detail.checked;
    }) as EventListener);

    const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
    input.click();
    await el.updateComplete;

    expect(eventFired).toBe(true);
    expect(eventChecked).toBe(true);
    expect(el.checked).toBe(true);
  });

  it('renders label when provided', () => {
    const label = el.shadowRoot!.querySelector('.label');
    expect(label).toBeTruthy();
    expect(label?.textContent).toBe('Test switch');
  });

  it('does not render label when not provided', async () => {
    el.label = '';
    await el.updateComplete;
    const label = el.shadowRoot!.querySelector('.label');
    expect(label).toBeFalsy();
  });

  it('renders thumb element', () => {
    const thumb = el.shadowRoot!.querySelector('.thumb');
    expect(thumb).toBeTruthy();
  });

  it('supports all variants', async () => {
    const variants = ['primary', 'secondary', 'success', 'error', 'info'] as const;

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

  it('can change variant', async () => {
    el.variant = 'success';
    await el.updateComplete;
    expect(el.getAttribute('variant')).toBe('success');
  });

  it('can change size', async () => {
    el.size = 'lg';
    await el.updateComplete;
    expect(el.getAttribute('size')).toBe('lg');
  });

  it('supports name attribute', async () => {
    el.name = 'test-switch';
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input.name).toBe('test-switch');
  });

  it('supports value attribute', async () => {
    el.value = 'test-value';
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input.value).toBe('test-value');
  });

  it('supports required attribute', async () => {
    el.required = true;
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input.required).toBe(true);
  });

  it('has correct aria-checked attribute', async () => {
    const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input.getAttribute('aria-checked')).toBe('false');

    el.checked = true;
    await el.updateComplete;
    expect(input.getAttribute('aria-checked')).toBe('true');
  });
});
