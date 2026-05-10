import { describe, it, expect, beforeEach, afterEach } from 'vitest';
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
});
