import { describe, it, expect, vi } from 'vitest';
import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { FormDisabledController } from '../form-disabled';

@customElement('form-disabled-probe')
class FormDisabledProbe extends LitElement {
  readonly fieldset = new FormDisabledController(this);
}

describe('FormDisabledController', () => {
  it('starts false', () => {
    const el = document.createElement('form-disabled-probe') as FormDisabledProbe;
    expect(el.fieldset.fieldsetDisabled).toBe(false);
  });

  it('reflects the value passed to setFieldsetDisabled', () => {
    const el = document.createElement('form-disabled-probe') as FormDisabledProbe;
    el.fieldset.setFieldsetDisabled(true);
    expect(el.fieldset.fieldsetDisabled).toBe(true);

    el.fieldset.setFieldsetDisabled(false);
    expect(el.fieldset.fieldsetDisabled).toBe(false);
  });

  it('requests a host update when the value actually changes', async () => {
    const el = document.createElement('form-disabled-probe') as FormDisabledProbe;
    const spy = vi.spyOn(el, 'requestUpdate');

    el.fieldset.setFieldsetDisabled(true);
    // Deferred to a microtask (not called synchronously) — see the class doc comment: formDisabledCallback can
    // fire from inside the host's own in-progress update, so requestUpdate() must never be reentrant with it.
    expect(spy).not.toHaveBeenCalled();
    await Promise.resolve();
    expect(spy).toHaveBeenCalledOnce();
  });

  it('does not request an update when set to the same value', () => {
    const el = document.createElement('form-disabled-probe') as FormDisabledProbe;
    el.fieldset.setFieldsetDisabled(true);
    const spy = vi.spyOn(el, 'requestUpdate');

    el.fieldset.setFieldsetDisabled(true);
    expect(spy).not.toHaveBeenCalled();
  });
});
