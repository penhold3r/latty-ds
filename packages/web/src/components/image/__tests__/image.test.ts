import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Image } from '../image';
import '../image';

describe('<lt-image>', () => {
  let el: Image;

  beforeEach(async () => {
    el = document.createElement('lt-image') as Image;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders in shadow DOM', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('renders an img element', () => {
    expect(el.shadowRoot!.querySelector('img')).toBeTruthy();
  });

  it('reflects src and alt onto the img', async () => {
    el.src = 'image.png';
    el.alt = 'A photo';
    await el.updateComplete;
    const img = el.shadowRoot!.querySelector('img')!;
    expect(img.getAttribute('src')).toBe('image.png');
    expect(img.getAttribute('alt')).toBe('A photo');
  });

  it('reflects responsive attribute', async () => {
    el.responsive = true;
    await el.updateComplete;
    expect(el.hasAttribute('responsive')).toBe(true);
  });

  it('applies default border-radius when rounded is empty string', async () => {
    el.rounded = '';
    await el.updateComplete;
    const img = el.shadowRoot!.querySelector('img')!;
    expect(img.getAttribute('style')).toContain('border-radius');
  });

  it('applies custom border-radius when rounded has a value', async () => {
    el.rounded = '50%';
    await el.updateComplete;
    const img = el.shadowRoot!.querySelector('img')!;
    expect(img.getAttribute('style')).toContain('50%');
  });

  it('applies no border-radius when rounded is null', async () => {
    el.rounded = null;
    await el.updateComplete;
    const img = el.shadowRoot!.querySelector('img')!;
    expect(img.getAttribute('style') ?? '').toBe('');
  });

  it('does not set loading on the img by default', () => {
    const img = el.shadowRoot!.querySelector('img')!;
    expect(img.hasAttribute('loading')).toBe(false);
  });

  it.each(['lazy', 'eager'] as const)('forwards loading="%s" to the img', async (loading) => {
    el.loading = loading;
    await el.updateComplete;
    const img = el.shadowRoot!.querySelector('img')!;
    expect(img.getAttribute('loading')).toBe(loading);
  });

  describe('load / error events', () => {
    it('re-dispatches a composed lt-load event when the img loads', async () => {
      el.src = 'image.png';
      await el.updateComplete;
      const onLoad = vi.fn();
      el.addEventListener('lt-load', onLoad);

      el.shadowRoot!.querySelector('img')!.dispatchEvent(new Event('load'));

      expect(onLoad).toHaveBeenCalledOnce();
      const event = onLoad.mock.calls[0][0] as CustomEvent<{ src: string }>;
      expect(event.detail.src).toBe('image.png');
      expect(event.composed).toBe(true);
      expect(event.bubbles).toBe(true);
    });

    it('re-dispatches a composed lt-error event when the img fails', async () => {
      el.src = 'broken.png';
      await el.updateComplete;
      const onError = vi.fn();
      el.addEventListener('lt-error', onError);

      el.shadowRoot!.querySelector('img')!.dispatchEvent(new Event('error'));

      expect(onError).toHaveBeenCalledOnce();
      const event = onError.mock.calls[0][0] as CustomEvent<{ src: string }>;
      expect(event.detail.src).toBe('broken.png');
      expect(event.composed).toBe(true);
    });
  });

  describe('fallback slot', () => {
    it('shows the fallback slot in place of the img on error', async () => {
      el.src = 'broken.png';
      await el.updateComplete;
      el.shadowRoot!.querySelector('img')!.dispatchEvent(new Event('error'));
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector('img')).toBeFalsy();
      expect(el.shadowRoot!.querySelector('slot[name="fallback"]')).toBeTruthy();
    });

    it('retries and hides the fallback when src changes', async () => {
      el.src = 'broken.png';
      await el.updateComplete;
      el.shadowRoot!.querySelector('img')!.dispatchEvent(new Event('error'));
      await el.updateComplete;

      el.src = 'other.png';
      await el.updateComplete;

      const img = el.shadowRoot!.querySelector('img')!;
      expect(img).toBeTruthy();
      expect(img.getAttribute('src')).toBe('other.png');
      expect(el.shadowRoot!.querySelector('slot[name="fallback"]')).toBeFalsy();
    });
  });
});
