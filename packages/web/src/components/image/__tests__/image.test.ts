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
    el.setAttribute('alt', 'A photo');
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
    el.setAttribute('loading', loading);
    await el.updateComplete;
    const img = el.shadowRoot!.querySelector('img')!;
    expect(img.getAttribute('loading')).toBe(loading);
  });

  describe('srcset, sizes, and native img attributes', () => {
    it('does not set srcset or sizes on the img by default', () => {
      const img = el.shadowRoot!.querySelector('img')!;
      expect(img.hasAttribute('srcset')).toBe(false);
      expect(img.hasAttribute('sizes')).toBe(false);
    });

    it('forwards srcset to the img', async () => {
      el.setAttribute('srcset', '/a.jpg 400w, /b.jpg 800w');
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('img')!.getAttribute('srcset')).toBe('/a.jpg 400w, /b.jpg 800w');
    });

    it('forwards sizes to the img', async () => {
      el.setAttribute('sizes', '(min-width: 768px) 50vw, 100vw');
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('img')!.getAttribute('sizes')).toBe('(min-width: 768px) 50vw, 100vw');
    });

    it('forwards arbitrary native img attributes (decoding, fetchpriority, crossorigin, referrerpolicy, width, height)', async () => {
      el.setAttribute('decoding', 'async');
      el.setAttribute('fetchpriority', 'high');
      el.setAttribute('crossorigin', 'anonymous');
      el.setAttribute('referrerpolicy', 'no-referrer');
      el.setAttribute('width', '400');
      el.setAttribute('height', '300');
      await el.updateComplete;
      const img = el.shadowRoot!.querySelector('img')!;
      expect(img.getAttribute('decoding')).toBe('async');
      expect(img.getAttribute('fetchpriority')).toBe('high');
      expect(img.getAttribute('crossorigin')).toBe('anonymous');
      expect(img.getAttribute('referrerpolicy')).toBe('no-referrer');
      expect(img.getAttribute('width')).toBe('400');
      expect(img.getAttribute('height')).toBe('300');
    });
  });

  describe('aspect-ratio', () => {
    it('does not set aspect-ratio on the img by default', () => {
      const img = el.shadowRoot!.querySelector('img')!;
      expect(img.getAttribute('style') ?? '').not.toContain('aspect-ratio');
    });

    it('reflects aspect-ratio to the host attribute', async () => {
      el.aspectRatio = '16/9';
      await el.updateComplete;
      expect(el.getAttribute('aspect-ratio')).toBe('16/9');
    });

    it('applies aspect-ratio, width, and object-fit to the img', async () => {
      el.aspectRatio = '16/9';
      await el.updateComplete;
      const style = el.shadowRoot!.querySelector('img')!.getAttribute('style')!;
      expect(style).toContain('aspect-ratio: 16/9');
      expect(style).toContain('width: 100%');
      expect(style).toContain('object-fit: cover');
    });

    it('combines with border-radius in the same style attribute', async () => {
      el.aspectRatio = '1';
      el.rounded = '8px';
      await el.updateComplete;
      const style = el.shadowRoot!.querySelector('img')!.getAttribute('style')!;
      expect(style).toContain('aspect-ratio: 1');
      expect(style).toContain('border-radius: 8px');
    });
  });

  describe('load / error events', () => {
    it('re-dispatches a native-style load event (with src) when the img loads', async () => {
      el.src = 'image.png';
      await el.updateComplete;
      const onLoad = vi.fn();
      el.addEventListener('load', onLoad);

      el.shadowRoot!.querySelector('img')!.dispatchEvent(new Event('load'));

      expect(onLoad).toHaveBeenCalledOnce();
      const event = onLoad.mock.calls[0][0] as CustomEvent<{ src: string }>;
      expect(event.detail.src).toBe('image.png');
      // Same as the native <img> event: doesn't bubble or cross shadow roots.
      expect(event.bubbles).toBe(false);
      expect(event.composed).toBe(false);
    });

    it('re-dispatches a native-style error event (with src) when the img fails', async () => {
      el.src = 'broken.png';
      await el.updateComplete;
      const onError = vi.fn();
      el.addEventListener('error', onError);

      el.shadowRoot!.querySelector('img')!.dispatchEvent(new Event('error'));

      expect(onError).toHaveBeenCalledOnce();
      const event = onError.mock.calls[0][0] as CustomEvent<{ src: string }>;
      expect(event.detail.src).toBe('broken.png');
      expect(event.bubbles).toBe(false);
      expect(event.composed).toBe(false);
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
