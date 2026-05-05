import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Skeleton } from '../skeleton';
import '../skeleton';

describe('<lt-skeleton>', () => {
  let el: Skeleton;

  beforeEach(async () => {
    el = document.createElement('lt-skeleton') as Skeleton;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => { el.remove(); });

  it('renders in shadow DOM', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('defaults to rect variant', () => {
    expect(el.variant).toBe('rect');
    expect(el.getAttribute('variant')).toBe('rect');
  });

  it('defaults to animated', () => {
    expect(el.animated).toBe(true);
    expect(el.hasAttribute('animated')).toBe(true);
  });

  it('supports all variants', async () => {
    const variants = ['text', 'circle', 'rect'] as const;
    for (const v of variants) {
      el.variant = v;
      await el.updateComplete;
      expect(el.getAttribute('variant')).toBe(v);
    }
  });

  it('applies custom width via inline style', async () => {
    el.width = '200px';
    await el.updateComplete;
    const base = el.shadowRoot!.querySelector('[part="base"]') as HTMLElement;
    expect(base.style.width).toBe('200px');
  });

  it('applies custom height via inline style', async () => {
    el.height = '100px';
    await el.updateComplete;
    const base = el.shadowRoot!.querySelector('[part="base"]') as HTMLElement;
    expect(base.style.height).toBe('100px');
  });

  it('can disable animation', async () => {
    el.animated = false;
    await el.updateComplete;
    expect(el.hasAttribute('animated')).toBe(false);
  });
});
