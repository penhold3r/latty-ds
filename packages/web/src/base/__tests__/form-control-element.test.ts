import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { customElement, property } from 'lit/decorators.js';
import { FormControlElement } from '../form-control-element';

// A minimal concrete control, standing in for the eleven real ones — the base class is abstract, and this
// is the smallest thing that can exercise it.
@customElement('lt-test-form-control')
class TestFormControl extends FormControlElement {
  @property() value = '';
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Exposes the base class's internal disabled state for the assertions below. */
  get isDisabled(): boolean {
    return this._isDisabled;
  }

  protected override get _formValue(): string {
    return this.value;
  }

  protected override set _formValue(value: unknown) {
    this.value = value == null ? '' : String(value);
  }
}

describe('<FormControlElement>', () => {
  let el: TestFormControl;
  let form: HTMLFormElement;

  beforeEach(async () => {
    form = document.createElement('form');
    document.body.append(form);

    el = document.createElement('lt-test-form-control') as TestFormControl;
    el.setAttribute('name', 'q');
    // The default is captured the first time the control connects, so the markup's value has to be in
    // place before it joins the DOM — exactly like a native input's `defaultValue`.
    el.setAttribute('value', 'initial');
    form.append(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
    form.remove();
  });

  it('is form-associated through the inherited static', () => {
    // The static lives on the base class; a subclass inherits it through the prototype chain, which is
    // what lets `attachInternals()` succeed in the constructor.
    expect(TestFormControl.formAssociated).toBe(true);
    expect(el.form).toBe(form);
  });

  it('exposes the owning form, the way a native control does', () => {
    expect(el.form).toBe(form);
    el.remove();
    expect(el.form).toBeNull();
  });

  it('restores the value it had when it first connected', async () => {
    el.value = 'changed';
    await el.updateComplete;

    el.formResetCallback();
    expect(el.value).toBe('initial');
  });

  it('captures the default once, so a reconnect does not re-capture it', async () => {
    el.remove();
    form.append(el);
    await el.updateComplete;

    el.value = 'changed';
    el.formResetCallback();
    expect(el.value).toBe('initial');
  });

  it('repopulates itself from browser-restored form state', async () => {
    el.formStateRestoreCallback('restored', 'restore');
    expect(el.value).toBe('restored');
  });

  it('clears itself when the browser restores no state at all', async () => {
    el.value = 'something';
    el.formStateRestoreCallback(null, 'restore');
    expect(el.value).toBe('');
  });

  it('combines its own disabled state with an ancestor fieldset', () => {
    expect(el.isDisabled).toBe(false);

    el.disabled = true;
    expect(el.isDisabled).toBe(true);

    el.disabled = false;
    el.formDisabledCallback(true);
    expect(el.isDisabled).toBe(true);

    el.formDisabledCallback(false);
    expect(el.isDisabled).toBe(false);
  });

  it('delegates validity to the element internals', () => {
    // The base class owns the delegation, so every control reports the same way.
    expect(el.checkValidity()).toBe(true);
    expect(el.reportValidity()).toBe(true);
  });
});
