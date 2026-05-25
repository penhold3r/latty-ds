import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Datepicker } from '../datepicker';
import '../datepicker';

describe('<lt-datepicker>', () => {
  let el: Datepicker;

  beforeEach(async () => {
    el = document.createElement('lt-datepicker') as Datepicker;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders in shadow DOM', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('has default type of date', () => {
    expect(el.type).toBe('date');
    expect(el.getAttribute('type')).toBe('date');
  });

  it.each(['date', 'time', 'datetime-local'] as const)('reflects %s type to attribute', async (type) => {
    el.type = type;
    await el.updateComplete;
    expect(el.getAttribute('type')).toBe(type);
    expect(el.shadowRoot!.querySelector('input')!.type).toBe(type);
  });

  it('has default variant of default', () => {
    expect(el.variant).toBe('default');
    expect(el.getAttribute('variant')).toBe('default');
  });

  it.each(['default', 'success', 'warning', 'error'] as const)('reflects %s variant to attribute', async (variant) => {
    el.variant = variant;
    await el.updateComplete;
    expect(el.getAttribute('variant')).toBe(variant);
  });

  it('has default size of md', () => {
    expect(el.size).toBe('md');
    expect(el.getAttribute('size')).toBe('md');
  });

  it.each(['sm', 'md', 'lg'] as const)('reflects %s size to attribute', async (size) => {
    el.size = size;
    await el.updateComplete;
    expect(el.getAttribute('size')).toBe(size);
  });

  it('renders label when set', async () => {
    el.label = 'Start date';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('label')!.textContent!.trim()).toContain('Start date');
  });

  it('does not render label element when label is empty', async () => {
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('label')).toBeNull();
  });

  it('renders helper text when set', async () => {
    el.helperText = 'Must be a future date';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.helper-text')!.textContent).toBe('Must be a future date');
  });

  it('disables the native input when disabled', async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('input')!.hasAttribute('disabled')).toBe(true);
  });

  it('dispatches lt-input on input event', async () => {
    const events: string[] = [];
    el.addEventListener('input', (e) => events.push((e as CustomEvent<{ value: string }>).detail.value));
    const input = el.shadowRoot!.querySelector('input')!;
    input.value = '2025-06-01';
    input.dispatchEvent(new Event('input'));
    expect(events).toEqual(['2025-06-01']);
  });

  it('dispatches lt-change on change event', async () => {
    const events: string[] = [];
    el.addEventListener('change', (e) => events.push((e as CustomEvent<{ value: string }>).detail.value));
    const input = el.shadowRoot!.querySelector('input')!;
    input.value = '2025-06-15';
    input.dispatchEvent(new Event('change'));
    expect(events).toEqual(['2025-06-15']);
  });
});
