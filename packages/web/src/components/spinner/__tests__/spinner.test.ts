import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Spinner } from '../spinner';
import '../spinner';

describe('<lt-spinner>', () => {
  let el: Spinner;

  beforeEach(async () => {
    el = document.createElement('lt-spinner') as Spinner;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders a spinner element in shadow DOM', () => {
    const spinner = el.shadowRoot!.querySelector('.spinner');
    expect(spinner).toBeTruthy();
  });

  it('has aria-hidden attribute', () => {
    const spinner = el.shadowRoot!.querySelector('.spinner');
    expect(spinner?.getAttribute('aria-hidden')).toBe('true');
  });

  it('has default size of md', () => {
    expect(el.size).toBe('md');
    expect(el.getAttribute('size')).toBe('md');
  });

  it('has default variant of current', () => {
    expect(el.variant).toBe('current');
    expect(el.getAttribute('variant')).toBe('current');
  });

  it('can change size', async () => {
    el.size = 'lg';
    await el.updateComplete;
    expect(el.getAttribute('size')).toBe('lg');
  });

  it('can change variant', async () => {
    el.variant = 'primary';
    await el.updateComplete;
    expect(el.getAttribute('variant')).toBe('primary');
  });

  it('supports all sizes', async () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    for (const size of sizes) {
      el.size = size;
      await el.updateComplete;
      expect(el.getAttribute('size')).toBe(size);
    }
  });

  it('supports all variants', async () => {
    const variants = ['primary', 'secondary', 'neutral', 'current'] as const;

    for (const variant of variants) {
      el.variant = variant;
      await el.updateComplete;
      expect(el.getAttribute('variant')).toBe(variant);
    }
  });

  it('reflects size property to attribute', async () => {
    el.size = 'sm';
    await el.updateComplete;
    expect(el.hasAttribute('size')).toBe(true);
    expect(el.getAttribute('size')).toBe('sm');
  });

  it('reflects variant property to attribute', async () => {
    el.variant = 'secondary';
    await el.updateComplete;
    expect(el.hasAttribute('variant')).toBe(true);
    expect(el.getAttribute('variant')).toBe('secondary');
  });
});
