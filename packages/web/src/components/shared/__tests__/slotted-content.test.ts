import { describe, it, expect, vi } from 'vitest';
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { SlottedContentController } from '../slotted-content';

@customElement('slotted-content-probe')
class SlottedContentProbe extends LitElement {
  readonly slotted = new SlottedContentController(this);

  render() {
    return html`<slot @slotchange=${this.slotted.onSlotChange}></slot>`;
  }
}

describe('SlottedContentController', () => {
  it('starts false for an empty element', async () => {
    const el = document.createElement('slotted-content-probe') as SlottedContentProbe;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.slotted.hasContent).toBe(false);
    el.remove();
  });

  it('is true on first render when element markup has content', async () => {
    const el = document.createElement('slotted-content-probe') as SlottedContentProbe;
    el.textContent = 'Hello';
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.slotted.hasContent).toBe(true);
    el.remove();
  });

  it('is true for an element child, not just text', async () => {
    const el = document.createElement('slotted-content-probe') as SlottedContentProbe;
    el.innerHTML = '<strong>Hi</strong>';
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.slotted.hasContent).toBe(true);
    el.remove();
  });

  it('ignores whitespace-only text', async () => {
    const el = document.createElement('slotted-content-probe') as SlottedContentProbe;
    el.textContent = '   \n  ';
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.slotted.hasContent).toBe(false);
    el.remove();
  });

  it('updates and requests a host update on slotchange', async () => {
    const el = document.createElement('slotted-content-probe') as SlottedContentProbe;
    document.body.appendChild(el);
    await el.updateComplete;

    el.textContent = 'Added later';
    const spy = vi.spyOn(el, 'requestUpdate');
    el.shadowRoot!.querySelector('slot')!.dispatchEvent(new Event('slotchange'));
    expect(el.slotted.hasContent).toBe(true);
    expect(spy).toHaveBeenCalledOnce();
    el.remove();
  });

  it('does not request an update when slotchange fires but content state is unchanged', async () => {
    const el = document.createElement('slotted-content-probe') as SlottedContentProbe;
    el.textContent = 'Already here';
    document.body.appendChild(el);
    await el.updateComplete;

    const spy = vi.spyOn(el, 'requestUpdate');
    el.shadowRoot!.querySelector('slot')!.dispatchEvent(new Event('slotchange'));
    expect(spy).not.toHaveBeenCalled();
    el.remove();
  });
});
