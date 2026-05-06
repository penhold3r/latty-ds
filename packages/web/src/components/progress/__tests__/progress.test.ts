import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Progress } from '../progress';
import '../progress';

describe('<lt-progress>', () => {
  let el: Progress;

  beforeEach(async () => {
    el = document.createElement('lt-progress') as Progress;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => { el.remove(); });

  it('renders in shadow DOM', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('defaults to value 0', () => {
    expect(el.value).toBe(0);
  });

  it('defaults to primary variant', () => {
    expect(el.variant).toBe('primary');
    expect(el.getAttribute('variant')).toBe('primary');
  });

  it('defaults to md size', () => {
    expect(el.size).toBe('md');
    expect(el.getAttribute('size')).toBe('md');
  });

  it('defaults to not indeterminate', () => {
    expect(el.indeterminate).toBe(false);
    expect(el.hasAttribute('indeterminate')).toBe(false);
  });

  it('sets aria-valuenow from value', async () => {
    el.value = 50;
    await el.updateComplete;
    const track = el.shadowRoot!.querySelector('[part="track"]')!;
    expect(track.getAttribute('aria-valuenow')).toBe('50');
  });

  it('omits aria-valuenow when indeterminate', async () => {
    el.indeterminate = true;
    await el.updateComplete;
    const track = el.shadowRoot!.querySelector('[part="track"]')!;
    expect(track.hasAttribute('aria-valuenow')).toBe(false);
  });

  it('clamps value to 0–100', async () => {
    el.value = 150;
    await el.updateComplete;
    const track = el.shadowRoot!.querySelector('[part="track"]')!;
    expect(track.getAttribute('aria-valuenow')).toBe('100');

    el.value = -10;
    await el.updateComplete;
    expect(track.getAttribute('aria-valuenow')).toBe('0');
  });

  it.each(['primary', 'success', 'warning', 'error', 'neutral'] as const)('reflects %s variant to attribute', async (variant) => {
    el.variant = variant;
    await el.updateComplete;
    expect(el.getAttribute('variant')).toBe(variant);
  });

  it.each(['sm', 'md', 'lg'] as const)('reflects %s size to attribute', async (size) => {
    el.size = size;
    await el.updateComplete;
    expect(el.getAttribute('size')).toBe(size);
  });
});
