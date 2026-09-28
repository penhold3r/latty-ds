import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
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
    el.addEventListener('input', (e: Event) => events.push((e as CustomEvent<{ value: string }>).detail.value));
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

  describe('the native input/change event does not also reach the host (DTP-1)', () => {
    // A real native <input> event is composed (crosses the shadow boundary) — the earlier tests above dispatch
    // plain, non-composed events, which never exercise that path. Only exactly one event, our own re-dispatched
    // CustomEvent with a `detail`, should ever reach a host listener.
    it('fires input exactly once, with detail, for a composed/bubbling native input event', async () => {
      const handler = vi.fn();
      el.addEventListener('input', handler);
      const input = el.shadowRoot!.querySelector('input')!;
      input.value = '2025-06-01';
      input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      expect(handler).toHaveBeenCalledOnce();
      expect((handler.mock.calls[0][0] as CustomEvent<{ value: string }>).detail.value).toBe('2025-06-01');
    });

    it('fires change exactly once, with detail, for a composed/bubbling native change event', async () => {
      const handler = vi.fn();
      el.addEventListener('change', handler);
      const input = el.shadowRoot!.querySelector('input')!;
      input.value = '2025-06-15';
      input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
      expect(handler).toHaveBeenCalledOnce();
      expect((handler.mock.calls[0][0] as CustomEvent<{ value: string }>).detail.value).toBe('2025-06-15');
    });
  });

  describe('value is not reflected, and formResetCallback restores the markup default (TFD-1)', () => {
    it('does not reflect value as an attribute', async () => {
      el.value = '2026-05-19';
      await el.updateComplete;
      expect(el.hasAttribute('value')).toBe(false);
    });

    // jsdom doesn't implement the form-associated custom element reset lifecycle (form.reset() never calls
    // formResetCallback), so this calls it directly — the same thing a real form reset does per the HTML spec.
    it('restores the value set in markup, not empty', async () => {
      const fresh = document.createElement('lt-datepicker') as Datepicker;
      fresh.setAttribute('value', '2026-05-19');
      document.body.appendChild(fresh);
      await fresh.updateComplete;

      fresh.value = '2026-06-01';
      await fresh.updateComplete;
      fresh.formResetCallback();
      expect(fresh.value).toBe('2026-05-19');
      fresh.remove();
    });
  });

  describe('formDisabledCallback (a disabled ancestor <fieldset>, X1)', () => {
    it('disables the inner input without touching the disabled property/attribute', async () => {
      el.formDisabledCallback(true);
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      expect(input.disabled).toBe(true);
      expect(el.disabled).toBe(false);
      expect(el.hasAttribute('disabled')).toBe(false);
    });

    it('re-enables once the fieldset is enabled again', async () => {
      el.formDisabledCallback(true);
      await el.updateComplete;
      el.formDisabledCallback(false);
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      expect(input.disabled).toBe(false);
    });

    it('does not re-enable if it was also explicitly disabled', async () => {
      el.disabled = true;
      el.formDisabledCallback(true);
      await el.updateComplete;
      el.formDisabledCallback(false);
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      expect(input.disabled).toBe(true);
    });
  });

  // jsdom's ElementInternals is a partial stub (see vitest.setup.ts): setValidity is a no-op and
  // checkValidity()/reportValidity() are hard-coded to always return true, so el.checkValidity() can't actually
  // observe anything here. These spy on the calls our component makes to setValidity instead — verified
  // end-to-end (real checkValidity()/form.checkValidity()) in Chromium.
  describe('setValidity is called with the native validity + message (DTP-2)', () => {
    it('required + empty: valueMissing', async () => {
      el.required = true;
      const spy = vi.spyOn(ElementInternals.prototype, 'setValidity');
      await el.updateComplete;
      expect(spy.mock.lastCall?.[0]).toMatchObject({ valueMissing: true });
    });

    it('required + filled: valid (empty flags)', async () => {
      el.required = true;
      await el.updateComplete;
      const spy = vi.spyOn(ElementInternals.prototype, 'setValidity');
      el.value = '2026-06-15';
      await el.updateComplete;
      expect(spy.mock.lastCall?.[0]).toEqual({});
    });

    it('value before min: rangeUnderflow, via the native constraint', async () => {
      el.min = '2026-01-01';
      await el.updateComplete;
      const spy = vi.spyOn(ElementInternals.prototype, 'setValidity');
      el.value = '2025-12-31';
      await el.updateComplete;
      expect(spy.mock.lastCall?.[0]).toMatchObject({ rangeUnderflow: true });
    });

    it('value after max: rangeOverflow, via the native constraint', async () => {
      el.max = '2026-01-01';
      await el.updateComplete;
      const spy = vi.spyOn(ElementInternals.prototype, 'setValidity');
      el.value = '2026-01-02';
      await el.updateComplete;
      expect(spy.mock.lastCall?.[0]).toMatchObject({ rangeOverflow: true });
    });

    it('passes the inner input as the validation anchor', async () => {
      el.required = true;
      const spy = vi.spyOn(ElementInternals.prototype, 'setValidity');
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('input');
      expect(spy.mock.lastCall?.[2]).toBe(input);
    });
  });
});
