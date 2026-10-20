import { describe, it, expect, afterEach } from 'vitest';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { NativeAttrsController } from '../native-attrs';

@customElement('lt-test-native-attrs')
class TestNativeAttrs extends LitElement {
  @property({ reflect: true }) variant = 'default';
  @property({ attribute: 'icon-start' }) iconStart = '';
  @property({ reflect: true }) mode: 'input' | 'textarea' = 'input';

  private _nativeAttrs = new NativeAttrsController(this, () => this.shadowRoot?.querySelector('input, textarea'), {
    exclude: ['aria-invalid'],
    aliases: { 'input-mode': 'inputmode' },
    filter: (attr, target) => {
      if (target.tagName === 'TEXTAREA') return attr !== 'pattern';
      return true;
    }
  });

  render() {
    return this.mode === 'textarea'
      ? html`<textarea id="inner-id" class="inner-class" aria-invalid="false"></textarea>`
      : html`<input id="inner-id" class="inner-class" aria-invalid="false" />`;
  }
}

describe('NativeAttrsController', () => {
  let el: TestNativeAttrs;

  afterEach(() => {
    el?.remove();
  });

  it('forwards non-custom native and aria-* attributes to the inner control', async () => {
    el = document.createElement('lt-test-native-attrs') as TestNativeAttrs;
    el.setAttribute('autocomplete', 'email');
    el.setAttribute('maxlength', '32');
    el.setAttribute('enterkeyhint', 'send');
    el.setAttribute('aria-label', 'Email address');
    document.body.appendChild(el);
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.getAttribute('autocomplete')).toBe('email');
    expect(input.getAttribute('maxlength')).toBe('32');
    expect(input.getAttribute('enterkeyhint')).toBe('send');
    expect(input.getAttribute('aria-label')).toBe('Email address');
  });

  it('never forwards host-only, data-*, excluded, or @property-declared attributes', async () => {
    el = document.createElement('lt-test-native-attrs') as TestNativeAttrs;
    el.id = 'host-id';
    el.className = 'host-class';
    el.setAttribute('style', 'color: red');
    el.setAttribute('data-testid', 'field');
    el.setAttribute('aria-invalid', 'true');
    el.variant = 'error';
    el.iconStart = 'search';
    document.body.appendChild(el);
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.id).toBe('inner-id');
    expect(input.className).toBe('inner-class');
    expect(input.hasAttribute('style')).toBe(false);
    expect(input.hasAttribute('data-testid')).toBe(false);
    expect(input.getAttribute('aria-invalid')).toBe('false');
    expect(input.hasAttribute('variant')).toBe(false);
    expect(input.hasAttribute('icon-start')).toBe(false);
  });

  it('cleans up forwarded attributes when removed from the host without clobbering Lit bindings', async () => {
    el = document.createElement('lt-test-native-attrs') as TestNativeAttrs;
    el.setAttribute('placeholder', 'Type here');
    document.body.appendChild(el);
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.getAttribute('placeholder')).toBe('Type here');

    el.removeAttribute('placeholder');
    await el.updateComplete;
    expect(input.hasAttribute('placeholder')).toBe(false);
    expect(input.id).toBe('inner-id');
    expect(input.getAttribute('aria-invalid')).toBe('false');
  });

  it('re-applies forwarded attributes and respects filter when switching inner element tag', async () => {
    el = document.createElement('lt-test-native-attrs') as TestNativeAttrs;
    el.setAttribute('autocomplete', 'off');
    el.setAttribute('pattern', '[0-9]+');
    document.body.appendChild(el);
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.getAttribute('autocomplete')).toBe('off');
    expect(input.getAttribute('pattern')).toBe('[0-9]+');

    el.mode = 'textarea';
    await el.updateComplete;

    const textarea = el.shadowRoot!.querySelector('textarea')!;
    expect(textarea.getAttribute('autocomplete')).toBe('off');
    expect(textarea.hasAttribute('pattern')).toBe(false);
  });

  it('maps legacy attribute aliases to canonical native attribute names', async () => {
    el = document.createElement('lt-test-native-attrs') as TestNativeAttrs;
    el.setAttribute('input-mode', 'decimal');
    document.body.appendChild(el);
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.getAttribute('inputmode')).toBe('decimal');
    expect(input.hasAttribute('input-mode')).toBe(false);
  });
});
