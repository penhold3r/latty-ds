import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Radio } from '../radio';
import '../radio';

describe('<lt-radio>', () => {
  let el: Radio;

  beforeEach(async () => {
    el = document.createElement('lt-radio') as Radio;
    el.label = 'Test radio';
    el.name = 'test-group';
    el.value = 'test-value';
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders a radio input in shadow DOM', () => {
    const input = el.shadowRoot!.querySelector('input[type="radio"]');
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
    const input = el.shadowRoot!.querySelector('input[type="radio"]') as HTMLInputElement;
    expect(input.checked).toBe(false);
  });

  it('is not disabled by default', () => {
    expect(el.disabled).toBe(false);
  });

  it('does not double-fire change for consumers listening on the host', async () => {
    // Real browser change events on the native radio input are composed
    // (cross the shadow boundary), so without stopPropagation() a consumer
    // listening on the host would see both our CustomEvent and the original
    // native event re-arriving — this reproduces that with an explicit composed dispatch.
    const handler = vi.fn();
    el.addEventListener('change', handler);

    const input = el.shadowRoot!.querySelector('input[type="radio"]') as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('can be checked', async () => {
    el.checked = true;
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('input[type="radio"]') as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it('can be disabled', async () => {
    el.disabled = true;
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('input[type="radio"]') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('dispatches change event when clicked', async () => {
    let eventFired = false;
    let eventValue = '';
    let eventChecked = false;

    el.addEventListener('change', ((e: CustomEvent) => {
      eventFired = true;
      eventValue = e.detail.value;
      eventChecked = e.detail.checked;
    }) as EventListener);

    const input = el.shadowRoot!.querySelector('input[type="radio"]') as HTMLInputElement;
    input.click();
    await el.updateComplete;

    expect(eventFired).toBe(true);
    expect(eventValue).toBe('test-value');
    expect(eventChecked).toBe(true);
    expect(el.checked).toBe(true);
  });

  it('renders label when provided', () => {
    const label = el.shadowRoot!.querySelector('.label');
    expect(label).toBeTruthy();
    expect(label?.textContent).toBe('Test radio');
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
    const input = el.shadowRoot!.querySelector('input[type="radio"]') as HTMLInputElement;
    expect(input.name).toBe('test-group');
  });

  it('supports value attribute', async () => {
    const input = el.shadowRoot!.querySelector('input[type="radio"]') as HTMLInputElement;
    expect(input.value).toBe('test-value');
  });

  it('supports required attribute', async () => {
    el.required = true;
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('input[type="radio"]') as HTMLInputElement;
    expect(input.required).toBe(true);
  });

  describe('grouping without lt-radio-group', () => {
    // Each <lt-radio> renders its own native <input> in its own separate shadow root, so the browser's native
    // radio grouping (which only ever sees one input per shadow tree) can never do this by itself — these
    // radios coordinate directly, without any wrapping <lt-radio-group>.
    let a: Radio;
    let b: Radio;

    beforeEach(async () => {
      a = document.createElement('lt-radio') as Radio;
      a.name = 'bare-group';
      a.value = 'a';
      b = document.createElement('lt-radio') as Radio;
      b.name = 'bare-group';
      b.value = 'b';
      document.body.append(a, b);
      await Promise.all([a.updateComplete, b.updateComplete]);
    });

    afterEach(() => {
      a.remove();
      b.remove();
    });

    it('checking one unchecks the other', async () => {
      const inputA = a.shadowRoot!.querySelector('input') as HTMLInputElement;
      const inputB = b.shadowRoot!.querySelector('input') as HTMLInputElement;
      inputA.checked = true;
      inputA.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
      await a.updateComplete;
      expect(a.checked).toBe(true);
      expect(b.checked).toBe(false);

      inputB.checked = true;
      inputB.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
      await b.updateComplete;
      expect(a.checked).toBe(false);
      expect(b.checked).toBe(true);
    });

    it('does not affect a radio with a different name', async () => {
      const c = document.createElement('lt-radio') as Radio;
      c.name = 'a-different-group';
      c.value = 'c';
      c.checked = true;
      document.body.appendChild(c);
      await c.updateComplete;

      const inputA = a.shadowRoot!.querySelector('input') as HTMLInputElement;
      inputA.checked = true;
      inputA.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
      await a.updateComplete;

      expect(c.checked).toBe(true);
      c.remove();
    });

    it('stops excluding its old group once renamed out of it', async () => {
      b.checked = true;
      await b.updateComplete;
      b.name = 'a-different-group';
      await b.updateComplete;

      // b left the group, so checking a must not reach into (and uncheck) it anymore.
      const inputA = a.shadowRoot!.querySelector('input') as HTMLInputElement;
      inputA.checked = true;
      inputA.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
      await a.updateComplete;
      expect(b.checked).toBe(true);
    });
  });

  it('renders dot when checked', async () => {
    el.checked = true;
    await el.updateComplete;
    const dot = el.shadowRoot!.querySelector('.dot');
    expect(dot).toBeTruthy();
    // Dot should be visible when checked
    const input = el.shadowRoot!.querySelector('input[type="radio"]') as HTMLInputElement;
    expect(input.checked).toBe(true);
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
      const fresh = document.createElement('lt-radio') as Radio;
      fresh.name = 'reset-test';
      fresh.value = 'x';
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
      const input = el.shadowRoot!.querySelector('input[type="radio"]') as HTMLInputElement;
      expect(input.disabled).toBe(true);
      expect(el.disabled).toBe(false);
      expect(el.hasAttribute('disabled')).toBe(false);
    });

    it('re-enables once the fieldset is enabled again', async () => {
      el.formDisabledCallback(true);
      await el.updateComplete;
      el.formDisabledCallback(false);
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('input[type="radio"]') as HTMLInputElement;
      expect(input.disabled).toBe(false);
    });

    it('does not re-enable if it was also explicitly disabled', async () => {
      el.disabled = true;
      el.formDisabledCallback(true);
      await el.updateComplete;
      el.formDisabledCallback(false);
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('input[type="radio"]') as HTMLInputElement;
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
      expect(spy.mock.lastCall?.[1]).toBe('Please select this option');
    });

    it('overrides the required-field validation message via labels', async () => {
      const spy = vi.spyOn(ElementInternals.prototype, 'setValidity');
      el.labels = { validationMessage: 'Veuillez sélectionner cette option' };
      el.required = true;
      await el.updateComplete;
      expect(spy.mock.lastCall?.[1]).toBe('Veuillez sélectionner cette option');
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
    const el = document.createElement('lt-radio') as Radio;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('[lt-radio]'));
    el.remove();
  });

  it('does not warn when a label is set', async () => {
    const el = document.createElement('lt-radio') as Radio;
    el.label = 'Option';
    document.body.appendChild(el);
    await el.updateComplete;
    expect(warn).not.toHaveBeenCalled();
    el.remove();
  });

  it('does not warn when there is slotted content but no label prop', async () => {
    const el = document.createElement('lt-radio') as Radio;
    el.textContent = 'Option';
    document.body.appendChild(el);
    await el.updateComplete;
    expect(warn).not.toHaveBeenCalled();
    el.remove();
  });
});

describe('rich label content (slot)', () => {
  let el: Radio;

  afterEach(() => {
    el.remove();
  });

  it('wraps slotted content in the label, with no redundant aria-label', async () => {
    el = document.createElement('lt-radio') as Radio;
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
    el = document.createElement('lt-radio') as Radio;
    el.label = 'Option';
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.label')!.textContent!.trim()).toBe('Option');
  });

  it('picks up content added after construction (slotchange)', async () => {
    el = document.createElement('lt-radio') as Radio;
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
  let el: Radio;

  beforeEach(async () => {
    el = document.createElement('lt-radio') as Radio;
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
