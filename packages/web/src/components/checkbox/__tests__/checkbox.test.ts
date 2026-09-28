import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { axe } from 'vitest-axe';
import type { Checkbox } from '../checkbox';
import '../checkbox';

describe('<lt-checkbox>', () => {
  let el: Checkbox;

  beforeEach(async () => {
    el = document.createElement('lt-checkbox') as Checkbox;
    el.label = 'Test checkbox';
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('has no axe violations', async () => {
    expect(await axe(el)).toHaveNoViolations();
  });

  it('renders a checkbox input in shadow DOM', () => {
    const input = el.shadowRoot!.querySelector('input[type="checkbox"]');
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

  it('is not indeterminate by default', () => {
    expect(el.indeterminate).toBe(false);
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

  it('can be indeterminate', async () => {
    el.indeterminate = true;
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
  });

  it('can be disabled', async () => {
    el.disabled = true;
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('dispatches change event when clicked', async () => {
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

  it('does not double-fire change for consumers listening on the host', async () => {
    // Real browser change events on the native checkbox are composed (cross
    // the shadow boundary), so without stopPropagation() a consumer listening
    // on the host would see both our CustomEvent and the original native
    // event re-arriving — this reproduces that with an explicit composed dispatch.
    const handler = vi.fn();
    el.addEventListener('change', handler);

    const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('clears indeterminate state when checked', async () => {
    el.indeterminate = true;
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
    input.click();
    await el.updateComplete;

    expect(el.indeterminate).toBe(false);
    expect(el.checked).toBe(true);
  });

  it('renders label when provided', () => {
    const label = el.shadowRoot!.querySelector('.label');
    expect(label).toBeTruthy();
    expect(label?.textContent).toBe('Test checkbox');
  });

  it('does not render label when not provided', async () => {
    el.label = '';
    await el.updateComplete;
    const label = el.shadowRoot!.querySelector('.label');
    expect(label).toBeFalsy();
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
    el.name = 'test-checkbox';
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input.name).toBe('test-checkbox');
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

  describe('checked is not reflected, and formResetCallback restores the markup default (TFD-1)', () => {
    it('does not reflect checked as an attribute', async () => {
      el.checked = true;
      await el.updateComplete;
      expect(el.hasAttribute('checked')).toBe(false);
    });

    // jsdom doesn't implement the form-associated custom element reset lifecycle (form.reset() never calls
    // formResetCallback), so this calls it directly — the same thing a real form reset does per the HTML spec.
    it('restores the checked state set in markup, not false', async () => {
      const fresh = document.createElement('lt-checkbox') as Checkbox;
      fresh.setAttribute('checked', '');
      document.body.appendChild(fresh);
      await fresh.updateComplete;

      fresh.checked = false;
      await fresh.updateComplete;
      fresh.formResetCallback();
      expect(fresh.checked).toBe(true);
      fresh.remove();
    });
  });

  describe('formDisabledCallback (a disabled ancestor <fieldset>, X1)', () => {
    it('disables the inner input without touching the disabled property/attribute', async () => {
      el.formDisabledCallback(true);
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.disabled).toBe(true);
      expect(el.disabled).toBe(false);
      expect(el.hasAttribute('disabled')).toBe(false);
    });

    it('re-enables once the fieldset is enabled again', async () => {
      el.formDisabledCallback(true);
      await el.updateComplete;
      el.formDisabledCallback(false);
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.disabled).toBe(false);
    });

    it('does not re-enable if it was also explicitly disabled', async () => {
      el.disabled = true;
      el.formDisabledCallback(true);
      await el.updateComplete;
      el.formDisabledCallback(false);
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.disabled).toBe(true);
    });
  });
});
