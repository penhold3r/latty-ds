import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Slider } from '../slider';
import '../slider';

describe('<lt-slider>', () => {
  let el: Slider;

  beforeEach(async () => {
    el = document.createElement('lt-slider') as Slider;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => { el.remove(); });

  it('renders in shadow DOM', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('renders a range input', () => {
    expect(el.shadowRoot!.querySelector('input[type="range"]')).toBeTruthy();
  });

  it('has correct defaults', () => {
    expect(el.min).toBe(0);
    expect(el.max).toBe(100);
    expect(el.step).toBe(1);
    expect(el.value).toBe(0);
    expect(el.disabled).toBe(false);
    expect(el.showTooltip).toBe(false);
    expect(el.size).toBe('md');
  });

  it('show-tooltip is false by default and reflects the attribute', async () => {
    expect(el.hasAttribute('show-tooltip')).toBe(false);
    el.showTooltip = true;
    await el.updateComplete;
    expect(el.hasAttribute('show-tooltip')).toBe(true);
  });

  it('passes current value as tooltip content when show-tooltip is true', async () => {
    el.value = 42;
    el.showTooltip = true;
    await el.updateComplete;
    const tooltip = el.shadowRoot!.querySelector('lt-tooltip');
    expect(tooltip?.getAttribute('content')).toBe('42');
  });

  it('supports all sizes', async () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      el.size = size;
      await el.updateComplete;
      expect(el.getAttribute('size')).toBe(size);
    }
  });

  it('is not disabled by default', () => {
    expect(el.disabled).toBe(false);
    expect(el.hasAttribute('disabled')).toBe(false);
  });

  it('can be disabled', async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute('disabled')).toBe(true);
    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('sets min/max/step on the native input', async () => {
    el.min = 10;
    el.max = 50;
    el.step = 5;
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
    expect(input.min).toBe('10');
    expect(input.max).toBe('50');
    expect(input.step).toBe('5');
  });

  it('renders a label when the label property is set', async () => {
    el.label = 'Volume';
    await el.updateComplete;
    const label = el.shadowRoot!.querySelector('label');
    expect(label).toBeTruthy();
    expect(label!.textContent).toBe('Volume');
  });

  it('dispatches lt-input with value detail', async () => {
    await el.updateComplete;
    const spy = vi.fn();
    el.addEventListener('lt-input', spy);

    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
    input.value = '42';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0][0].detail).toEqual({ value: 42 });
  });

  it('dispatches lt-change with value detail', async () => {
    await el.updateComplete;
    const spy = vi.fn();
    el.addEventListener('lt-change', spy);

    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
    input.value = '75';
    input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));

    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0][0].detail).toEqual({ value: 75 });
  });
});
