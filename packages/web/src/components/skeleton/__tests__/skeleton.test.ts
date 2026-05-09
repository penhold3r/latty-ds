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

  it('defaults to rect shape', () => {
    expect(el.shape).toBe('rect');
    expect(el.getAttribute('shape')).toBe('rect');
  });

  it('defaults to animated', () => {
    expect(el.animated).toBe(true);
    expect(el.hasAttribute('animated')).toBe(true);
  });

  it.each(['text', 'circle', 'rect'] as const)('reflects %s shape to attribute', async (shape) => {
    el.shape = shape;
    await el.updateComplete;
    expect(el.getAttribute('shape')).toBe(shape);
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
