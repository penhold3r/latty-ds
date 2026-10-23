import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
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
    el.setAttribute('name', 'test-switch');
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

  describe('checked is not reflected, and formResetCallback restores the markup default (TFD-1)', () => {
    it('does not reflect checked as an attribute', async () => {
      el.checked = true;
      await el.updateComplete;
      expect(el.hasAttribute('checked')).toBe(false);
    });

    // jsdom doesn't implement the form-associated custom element reset lifecycle (form.reset() never calls
    // formResetCallback), so this calls it directly — the same thing a real form reset does per the HTML spec.
    it('restores the checked state set in markup, not false', async () => {
      const fresh = document.createElement('lt-switch') as Switch;
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
      // FormDisabledController defers its requestUpdate() to a microtask (so it's never reentrant with an
      // update already in flight — see the controller's own doc comment), so this needs an extra tick before
      // updateComplete reflects it.
      await Promise.resolve();
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

  // jsdom's ElementInternals.setValidity is a stubbed no-op (see vitest.setup.ts), so these spy on the call our
  // component makes rather than reading back a real validationMessage.
  describe('labels (i18n, X5)', () => {
    it('defaults the required-field validation message to English', async () => {
      const spy = vi.spyOn(ElementInternals.prototype, 'setValidity');
      el.required = true;
      await el.updateComplete;
      expect(spy.mock.lastCall?.[1]).toBe('Please check this switch');
    });

    it('overrides the required-field validation message via labels', async () => {
      const spy = vi.spyOn(ElementInternals.prototype, 'setValidity');
      el.labels = { validationMessage: 'Veuillez activer ce commutateur' };
      el.required = true;
      await el.updateComplete;
      expect(spy.mock.lastCall?.[1]).toBe('Veuillez activer ce commutateur');
    });
  });
});

describe('dev-mode warnings (label slot)', () => {
  let warn: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
  });

  it('warns when there is no label and nothing slotted', async () => {
    const el = document.createElement('lt-switch') as Switch;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('[lt-switch]'));
    el.remove();
  });

  it('does not warn when a label is set', async () => {
    const el = document.createElement('lt-switch') as Switch;
    el.label = 'Option';
    document.body.appendChild(el);
    await el.updateComplete;
    expect(warn).not.toHaveBeenCalled();
    el.remove();
  });

  it('does not warn when there is slotted content but no label prop', async () => {
    const el = document.createElement('lt-switch') as Switch;
    el.textContent = 'Option';
    document.body.appendChild(el);
    await el.updateComplete;
    expect(warn).not.toHaveBeenCalled();
    el.remove();
  });
});

describe('rich label content (slot)', () => {
  let el: Switch;

  afterEach(() => {
    el.remove();
  });

  it('wraps slotted content in the label, with no redundant aria-label', async () => {
    el = document.createElement('lt-switch') as Switch;
    el.innerHTML = 'I agree to the <a href="/terms">terms</a>';
    document.body.appendChild(el);
    await el.updateComplete;

    const labelSpan = el.shadowRoot!.querySelector('.label');
    expect(labelSpan).toBeTruthy();
    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.hasAttribute('aria-label')).toBe(false);
    const slot = el.shadowRoot!.querySelector('slot')!;
    expect(slot.assignedNodes({ flatten: true }).length).toBeGreaterThan(0);
  });

  it('falls back to the label attribute when nothing is slotted', async () => {
    el = document.createElement('lt-switch') as Switch;
    el.label = 'Option';
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.label')!.textContent!.trim()).toBe('Option');
  });

  it('picks up content added after construction (slotchange)', async () => {
    el = document.createElement('lt-switch') as Switch;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.label')).toBeNull();

    el.textContent = 'Added later';
    el.shadowRoot!.querySelector('slot')!.dispatchEvent(new Event('slotchange'));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.label')).toBeTruthy();
  });
});

describe('helper text', () => {
  let el: Switch;

  beforeEach(async () => {
    el = document.createElement('lt-switch') as Switch;
    el.label = 'Option';
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('is not rendered by default', () => {
    expect(el.shadowRoot!.querySelector('.helper-text')).toBeNull();
    expect(el.shadowRoot!.querySelector('input')!.hasAttribute('aria-describedby')).toBe(false);
  });

  it('renders and links to the input via aria-describedby', async () => {
    el.helperText = 'Required to continue';
    await el.updateComplete;
    const helper = el.shadowRoot!.querySelector('.helper-text')!;
    expect(helper.textContent!.trim()).toBe('Required to continue');
    expect(el.shadowRoot!.querySelector('input')!.getAttribute('aria-describedby')).toBe(helper.id);
  });
});
