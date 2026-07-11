import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { ColorInput } from '../color-input';
import '../color-input';

describe('<lt-color-input>', () => {
  let el: ColorInput;

  beforeEach(async () => {
    el = document.createElement('lt-color-input') as ColorInput;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders in shadow DOM', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('forwards name to the native color picker', async () => {
    el.name = 'brand-color';
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('input[type="color"]')!;
    expect(input.getAttribute('name')).toBe('brand-color');
  });

  it('omits the name attribute on the native picker when unset', () => {
    const input = el.shadowRoot!.querySelector('input[type="color"]')!;
    expect(input.hasAttribute('name')).toBe(false);
  });

  it('reflects size attribute', async () => {
    el.setAttribute('size', 'lg');
    await el.updateComplete;
    expect(el.getAttribute('size')).toBe('lg');
  });

  it('reflects disabled attribute', async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute('disabled')).toBe(true);
  });

  it('dispatches change event with hex value by default', async () => {
    const events: CustomEvent[] = [];
    el.addEventListener('change', (e) => events.push(e as CustomEvent));
    const picker = el.shadowRoot!.querySelector('.native-picker') as HTMLInputElement;
    picker.value = '#ff0000';
    picker.dispatchEvent(new Event('change'));
    await el.updateComplete;
    expect(events).toHaveLength(1);
    expect(events[0].detail.value).toBe('#ff0000');
  });

  it('does not double-fire change for consumers listening on the host', async () => {
    // Real browser change events on the native color picker are composed
    // (cross the shadow boundary), so without stopPropagation() a consumer
    // listening on the host would see both our CustomEvent and the original
    // native event re-arriving — this reproduces that with composed: true.
    const events: CustomEvent[] = [];
    el.addEventListener('change', (e) => events.push(e as CustomEvent));
    const picker = el.shadowRoot!.querySelector('.native-picker') as HTMLInputElement;
    picker.value = '#ff0000';
    picker.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(events).toHaveLength(1);
    expect(events[0].detail.value).toBe('#ff0000');
  });

  it('emits rgb format when format="rgb"', async () => {
    el.format = 'rgb';
    await el.updateComplete;
    const events: CustomEvent[] = [];
    el.addEventListener('change', (e) => events.push(e as CustomEvent));
    const picker = el.shadowRoot!.querySelector('.native-picker') as HTMLInputElement;
    picker.value = '#ff0000';
    picker.dispatchEvent(new Event('change'));
    await el.updateComplete;
    expect(events[0].detail.value).toBe('rgb(255, 0, 0)');
  });

  it('emits hsl format when format="hsl"', async () => {
    el.format = 'hsl';
    await el.updateComplete;
    const events: CustomEvent[] = [];
    el.addEventListener('change', (e) => events.push(e as CustomEvent));
    const picker = el.shadowRoot!.querySelector('.native-picker') as HTMLInputElement;
    picker.value = '#ff0000';
    picker.dispatchEvent(new Event('change'));
    await el.updateComplete;
    expect(events[0].detail.value).toBe('hsl(0, 100%, 50%)');
  });

  it('converts rgb value to hex for the native picker', async () => {
    el.value = 'rgb(255, 0, 0)';
    await el.updateComplete;
    const picker = el.shadowRoot!.querySelector('.native-picker') as HTMLInputElement;
    expect(picker.value).toBe('#ff0000');
  });

  it('converts hsl value to hex for the native picker', async () => {
    el.value = 'hsl(0, 100%, 50%)';
    await el.updateComplete;
    const picker = el.shadowRoot!.querySelector('.native-picker') as HTMLInputElement;
    expect(picker.value).toBe('#ff0000');
  });

  it('shows placeholder when no value is set', () => {
    el.placeholder = 'Pick a color';
    const display = el.shadowRoot!.querySelector('.display-value');
    expect(display?.textContent?.trim()).toBe('Pick a color');
  });

  it('shows the value string in the display', async () => {
    el.value = '#7c3aed';
    await el.updateComplete;
    const display = el.shadowRoot!.querySelector('.display-value');
    expect(display?.textContent?.trim()).toBe('#7c3aed');
  });
});
