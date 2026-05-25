import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Combobox } from '../combobox';
import '../combobox';

vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn().mockResolvedValue({ x: 0, y: 0 }),
  autoUpdate: vi.fn().mockReturnValue(vi.fn()),
  offset: vi.fn(),
  flip: vi.fn(),
  shift: vi.fn()
}));

const OPTIONS = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico', disabled: true }
];

describe('<lt-combobox>', () => {
  let el: Combobox;

  beforeEach(async () => {
    el = document.createElement('lt-combobox') as Combobox;
    el.options = OPTIONS;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders in shadow DOM', () => {
    expect(el.shadowRoot).toBeTruthy();
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

  it('renders a label when set', async () => {
    el.label = 'Country';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('label')!.textContent!.trim()).toContain('Country');
  });

  it('renders helper text when set', async () => {
    el.helperText = 'Choose your country';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.helper-text')!.textContent).toBe('Choose your country');
  });

  it('opens dropdown on input focus', async () => {
    const input = el.shadowRoot!.querySelector('input')!;
    input.dispatchEvent(new FocusEvent('focus'));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.dropdown')).toBeTruthy();
  });

  it('filters options when typing', async () => {
    const input = el.shadowRoot!.querySelector('input')!;
    input.dispatchEvent(new FocusEvent('focus'));
    await el.updateComplete;

    input.value = 'can';
    input.dispatchEvent(new Event('input'));
    await el.updateComplete;

    const options = el.shadowRoot!.querySelectorAll('.option');
    expect(options.length).toBe(1);
    expect(options[0].textContent!.trim()).toBe('Canada');
  });

  it('shows no-results when filter has no matches', async () => {
    const input = el.shadowRoot!.querySelector('input')!;
    input.dispatchEvent(new FocusEvent('focus'));
    await el.updateComplete;

    input.value = 'zzz';
    input.dispatchEvent(new Event('input'));
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('.no-results')).toBeTruthy();
  });

  it('dispatches lt-change when an option is selected', async () => {
    const events: Array<{ value: string; label: string }> = [];
    el.addEventListener('lt-change', (e) => events.push((e as CustomEvent).detail));

    const input = el.shadowRoot!.querySelector('input')!;
    input.dispatchEvent(new FocusEvent('focus'));
    await el.updateComplete;

    const firstOption = el.shadowRoot!.querySelector('.option') as HTMLButtonElement;
    firstOption.click();

    expect(events).toHaveLength(1);
    expect(events[0].value).toBe('us');
    expect(events[0].label).toBe('United States');
  });

  it('does not open when disabled', async () => {
    el.disabled = true;
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('input')!;
    input.dispatchEvent(new FocusEvent('focus'));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.dropdown')).toBeNull();
  });
});
