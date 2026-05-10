import { describe, it, expect, beforeEach, afterEach } from 'vitest';
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
});
