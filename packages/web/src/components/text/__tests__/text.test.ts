import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Text } from '../text';
import '../text';

describe('<lt-text>', () => {
  let el: Text;

  beforeEach(async () => {
    el = document.createElement('lt-text') as Text;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders a shadow root', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('defaults to body variant', () => {
    expect(el.variant).toBe('body');
  });

  it('renders a <p> for body variant by default', async () => {
    expect(el.shadowRoot!.querySelector('p')).toBeTruthy();
  });

  it('renders the correct semantic tag for heading variants', async () => {
    for (const tag of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const) {
      el.variant = tag;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector(tag)).toBeTruthy();
    }
  });

  it('renders <span> for caption and overline', async () => {
    for (const v of ['caption', 'overline'] as const) {
      el.variant = v;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('span')).toBeTruthy();
    }
  });

  it('overrides the tag via the `as` attribute', async () => {
    el.variant = 'h1';
    el.as = 'h2';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('h2')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('h1')).toBeNull();
  });

  it('projects slot content', () => {
    el.textContent = 'Hello';
    expect(el.shadowRoot!.querySelector('slot')).toBeTruthy();
  });

  it('exposes a part="base" on the inner element', async () => {
    expect(el.shadowRoot!.querySelector('[part="base"]')).toBeTruthy();
  });

  describe('the as attribute', () => {
    it.each(['h1', 'h3', 'p', 'span', 'div', 'label', 'strong', 'em'] as const)(
      'renders <%s> when asked for it',
      async (tag) => {
        const t = document.createElement('lt-text') as Text;
        t.as = tag;
        document.body.appendChild(t);
        await t.updateComplete;
        expect(t.shadowRoot!.querySelector('[part="base"]')!.tagName.toLowerCase()).toBe(tag);
        t.remove();
      }
    );

    it.each([
      'p><img src=x onerror="window.__pwned=1"><p',
      'script',
      'iframe',
      'img',
      'a href=javascript:1',
      'H1 ',
      ''
    ])("ignores %j and keeps the variant's own tag, injecting nothing", async (as) => {
      (window as unknown as { __pwned?: number }).__pwned = 0;
      const t = document.createElement('lt-text') as Text;
      t.variant = 'h2';
      t.as = as as never;
      document.body.appendChild(t);
      await t.updateComplete;
      const root = t.shadowRoot!;
      expect(root.querySelector('[part="base"]')!.tagName.toLowerCase()).toBe('h2');
      expect(root.querySelector('img, script, iframe, a')).toBeNull();
      expect((window as unknown as { __pwned?: number }).__pwned).toBe(0);
      t.remove();
    });
  });
});

describe('dev-mode warnings (unknown as/variant)', () => {
  let warn: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
  });

  it('warns once when `as` is set to an unrecognized tag', async () => {
    const el = document.createElement('lt-text') as Text;
    el.as = 'blink' as never;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('[lt-text]'));
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('unknown `as` value "blink"'));
    el.remove();
  });

  it('does not warn for an allowed `as` value', async () => {
    const el = document.createElement('lt-text') as Text;
    el.as = 'span';
    document.body.appendChild(el);
    await el.updateComplete;
    expect(warn).not.toHaveBeenCalled();
    el.remove();
  });

  it('does not warn when `as` is left unset', async () => {
    const el = document.createElement('lt-text') as Text;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(warn).not.toHaveBeenCalled();
    el.remove();
  });

  it('warns when `variant` is set to an unrecognized value', async () => {
    const el = document.createElement('lt-text') as Text;
    el.variant = 'subtitle' as never;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('unknown `variant` value "subtitle"'));
    el.remove();
  });

  it('does not warn for the default variant', async () => {
    const el = document.createElement('lt-text') as Text;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(warn).not.toHaveBeenCalled();
    el.remove();
  });

  it('only warns again if the invalid value actually changes', async () => {
    const el = document.createElement('lt-text') as Text;
    el.as = 'blink' as never;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(warn).toHaveBeenCalledTimes(1);

    el.requestUpdate();
    await el.updateComplete;
    expect(warn).toHaveBeenCalledTimes(1);
  });
});
