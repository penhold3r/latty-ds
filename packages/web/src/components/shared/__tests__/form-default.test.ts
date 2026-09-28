import { describe, it, expect } from 'vitest';
import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { FormDefaultController } from '../form-default';

@customElement('form-default-probe')
class FormDefaultProbe extends LitElement {
  @property() value = '';
  @property({ type: Boolean }) checked = false;

  readonly defaultValue = new FormDefaultController(this, () => this.value);
  readonly defaultChecked = new FormDefaultController(this, () => this.checked);
}

describe('FormDefaultController', () => {
  it('captures the value present at first connect', async () => {
    const el = document.createElement('form-default-probe') as FormDefaultProbe;
    el.value = 'initial';
    document.body.appendChild(el);
    await el.updateComplete;

    expect(el.defaultValue.value).toBe('initial');
    el.remove();
  });

  it('works with a boolean getter (checked)', async () => {
    const el = document.createElement('form-default-probe') as FormDefaultProbe;
    el.checked = true;
    document.body.appendChild(el);
    await el.updateComplete;

    expect(el.defaultChecked.value).toBe(true);
    el.remove();
  });

  it('does not update once the tracked value changes (user interaction)', async () => {
    const el = document.createElement('form-default-probe') as FormDefaultProbe;
    el.value = 'initial';
    document.body.appendChild(el);
    await el.updateComplete;

    el.value = 'typed by the user';
    await el.updateComplete;

    expect(el.defaultValue.value).toBe('initial');
    el.remove();
  });

  it('does not recapture on a reconnect (moving the element in the DOM)', async () => {
    const el = document.createElement('form-default-probe') as FormDefaultProbe;
    el.value = 'initial';
    document.body.appendChild(el);
    await el.updateComplete;

    el.value = 'typed by the user';
    await el.updateComplete;

    const otherParent = document.createElement('div');
    document.body.appendChild(otherParent);
    otherParent.appendChild(el); // disconnects then reconnects `el`
    await el.updateComplete;

    expect(el.defaultValue.value).toBe('initial');
    otherParent.remove();
  });
});
