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

  afterEach(() => {
    el.remove();
  });

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

  it.each(['primary', 'success', 'warning', 'error', 'neutral'] as const)(
    'reflects %s variant to attribute',
    async (variant) => {
      el.variant = variant;
      await el.updateComplete;
      expect(el.getAttribute('variant')).toBe(variant);
    }
  );

  it.each(['sm', 'md', 'lg'] as const)('reflects %s size to attribute', async (size) => {
    el.size = size;
    await el.updateComplete;
    expect(el.getAttribute('size')).toBe(size);
  });

  it.each([NaN, Infinity, -Infinity])('shows an empty bar rather than a NaN width for the value %s', async (value) => {
    el.value = value;
    await el.updateComplete;
    const fill = el.shadowRoot!.querySelector<HTMLElement>('[part="fill"]')!;
    expect(fill.style.width).not.toContain('NaN');
    expect(el.shadowRoot!.querySelector('[role="progressbar"]')!.getAttribute('aria-valuenow')).toBe('0');
  });

  it('defaults to max 100', () => {
    expect(el.max).toBe(100);
  });

  it('reports value and max on their own scale instead of renormalizing to a percentage', async () => {
    el.max = 5;
    el.value = 3;
    await el.updateComplete;
    const track = el.shadowRoot!.querySelector('[role="progressbar"]')!;
    expect(track.getAttribute('aria-valuenow')).toBe('3');
    expect(track.getAttribute('aria-valuemax')).toBe('5');
    const fill = el.shadowRoot!.querySelector<HTMLElement>('[part="fill"]')!;
    expect(fill.style.width).toBe('60%');
  });

  it.each([NaN, 0, -5])('falls back to a max of 100 for an invalid max %s', async (max) => {
    el.max = max;
    el.value = 50;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('[role="progressbar"]')!.getAttribute('aria-valuemax')).toBe('100');
  });

  it('omits aria-valuetext by default and sets it from valueText when given', async () => {
    const track = () => el.shadowRoot!.querySelector('[role="progressbar"]')!;
    expect(track().hasAttribute('aria-valuetext')).toBe(false);

    el.valueText = 'Step 3 of 5';
    await el.updateComplete;
    expect(track().getAttribute('aria-valuetext')).toBe('Step 3 of 5');
  });

  it('omits aria-valuetext when indeterminate, even with valueText set', async () => {
    el.valueText = 'Step 3 of 5';
    el.indeterminate = true;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('[role="progressbar"]')!.hasAttribute('aria-valuetext')).toBe(false);
  });
});
