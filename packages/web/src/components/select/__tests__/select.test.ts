import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Select } from '../select';
import type { SelectOption } from '../select.types';
import '../select';

describe('<lt-select>', () => {
  let el: Select;
  const mockOptions: SelectOption[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
    { value: 'grape', label: 'Grape', disabled: true }
  ];

  beforeEach(async () => {
    el = document.createElement('lt-select') as Select;
    el.options = mockOptions;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders a select trigger in shadow DOM', () => {
    const trigger = el.shadowRoot!.querySelector('.select-trigger');
    expect(trigger).toBeTruthy();
  });

  it('has default variant of default', () => {
    expect(el.variant).toBe('default');
    expect(el.getAttribute('variant')).toBe('default');
  });

  it('has default size of md', () => {
    expect(el.size).toBe('md');
    expect(el.getAttribute('size')).toBe('md');
  });

  it('can change variant', async () => {
    el.variant = 'error';
    await el.updateComplete;
    expect(el.getAttribute('variant')).toBe('error');
  });

  it('can change size', async () => {
    el.size = 'lg';
    await el.updateComplete;
    expect(el.getAttribute('size')).toBe('lg');
  });

  it('is not disabled by default', () => {
    expect(el.disabled).toBe(false);
    expect(el.hasAttribute('disabled')).toBe(false);
  });

  it('can be disabled', async () => {
    el.disabled = true;
    await el.updateComplete;
    const trigger = el.shadowRoot!.querySelector('.select-trigger')!;
    expect(trigger.getAttribute('aria-disabled')).toBe('true');
  });

  it('is not required by default', () => {
    expect(el.required).toBe(false);
  });

  it('shows required indicator when required', async () => {
    el.label = 'Select';
    el.required = true;
    await el.updateComplete;
    const indicator = el.shadowRoot!.querySelector('.required-indicator');
    expect(indicator).toBeTruthy();
  });

  it('renders all options in dropdown', () => {
    const options = el.shadowRoot!.querySelectorAll('.option');
    expect(options.length).toBe(mockOptions.length);
  });

  it('shows placeholder when no value is selected', () => {
    const valueSpan = el.shadowRoot!.querySelector('.select-value');
    expect(valueSpan?.classList.contains('placeholder')).toBe(true);
    expect(valueSpan?.textContent?.trim()).toBe('Select an option');
  });

  it('shows selected label when value is set', async () => {
    el.value = 'apple';
    await el.updateComplete;
    const valueSpan = el.shadowRoot!.querySelector('.select-value');
    expect(valueSpan?.classList.contains('placeholder')).toBe(false);
    expect(valueSpan?.textContent?.trim()).toBe('Apple');
  });

  it('opens dropdown when trigger is clicked', async () => {
    const trigger = el.shadowRoot!.querySelector('.select-trigger') as HTMLElement;
    expect(el.hasAttribute('open')).toBe(false);

    trigger.click();
    await el.updateComplete;

    expect(el.hasAttribute('open')).toBe(true);
  });

  it('closes dropdown when clicking outside', async () => {
    const trigger = el.shadowRoot!.querySelector('.select-trigger') as HTMLElement;

    trigger.click();
    await el.updateComplete;
    expect(el.hasAttribute('open')).toBe(true);

    // Simulate click outside
    document.body.click();
    await el.updateComplete;
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('selects an option when clicked', async () => {
    const trigger = el.shadowRoot!.querySelector('.select-trigger') as HTMLElement;
    trigger.click();
    await el.updateComplete;

    const option = el.shadowRoot!.querySelectorAll('.option')[1] as HTMLButtonElement;

    let eventFired = false;
    let eventValue = '';
    el.addEventListener('change', ((e: CustomEvent) => {
      eventFired = true;
      eventValue = e.detail.value;
    }) as EventListener);

    option.click();
    await el.updateComplete;

    expect(el.value).toBe('banana');
    expect(eventFired).toBe(true);
    expect(eventValue).toBe('banana');
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('does not select disabled option', async () => {
    const trigger = el.shadowRoot!.querySelector('.select-trigger') as HTMLElement;
    trigger.click();
    await el.updateComplete;

    const disabledOption = el.shadowRoot!.querySelectorAll('.option')[3] as HTMLButtonElement;
    const initialValue = el.value;

    disabledOption.click();
    await el.updateComplete;

    expect(el.value).toBe(initialValue);
  });

  it('supports all variants', async () => {
    const variants = ['default', 'success', 'warning', 'error'] as const;

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

  it('renders label when provided', async () => {
    el.label = 'Choose a fruit';
    await el.updateComplete;
    const label = el.shadowRoot!.querySelector('label');
    expect(label).toBeTruthy();
    expect(label?.textContent).toContain('Choose a fruit');
  });

  it('renders helper text when provided', async () => {
    el.helperText = 'Select your favorite fruit';
    await el.updateComplete;
    const helperText = el.shadowRoot!.querySelector('.helper-text');
    expect(helperText).toBeTruthy();
    expect(helperText?.textContent).toBe('Select your favorite fruit');
  });

  it('opens dropdown with Enter key', async () => {
    const trigger = el.shadowRoot!.querySelector('.select-trigger') as HTMLElement;
    expect(el.hasAttribute('open')).toBe(false);

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    trigger.dispatchEvent(event);
    await el.updateComplete;

    expect(el.hasAttribute('open')).toBe(true);
  });

  it('closes dropdown with Escape key', async () => {
    const trigger = el.shadowRoot!.querySelector('.select-trigger') as HTMLElement;

    trigger.click();
    await el.updateComplete;
    expect(el.hasAttribute('open')).toBe(true);

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    trigger.dispatchEvent(event);
    await el.updateComplete;

    expect(el.hasAttribute('open')).toBe(false);
  });
});
