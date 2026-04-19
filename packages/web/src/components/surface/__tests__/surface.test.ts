import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Surface } from '../surface';
import '../surface';

describe('<lt-surface>', () => {
  let el: Surface;

  beforeEach(async () => {
    el = document.createElement('lt-surface') as Surface;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders a surface container in shadow DOM', () => {
    const surface = el.shadowRoot!.querySelector('.surface');
    expect(surface).toBeTruthy();
  });

  it('has default elevation of 1', () => {
    expect(el.elevation).toBe('1');
    expect(el.getAttribute('elevation')).toBe('1');
  });

  it('has default variant of filled', () => {
    expect(el.variant).toBe('filled');
    expect(el.getAttribute('variant')).toBe('filled');
  });

  it('can change elevation', async () => {
    el.elevation = '3';
    await el.updateComplete;
    expect(el.getAttribute('elevation')).toBe('3');
  });

  it('can change variant', async () => {
    el.variant = 'outlined';
    await el.updateComplete;
    expect(el.getAttribute('variant')).toBe('outlined');
  });

  it('supports all elevation levels', async () => {
    const elevations = ['0', '1', '2', '3', '4', '5'] as const;

    for (const elevation of elevations) {
      el.elevation = elevation;
      await el.updateComplete;
      expect(el.getAttribute('elevation')).toBe(elevation);
    }
  });

  it('supports all variants', async () => {
    const variants = ['filled', 'outlined'] as const;

    for (const variant of variants) {
      el.variant = variant;
      await el.updateComplete;
      expect(el.getAttribute('variant')).toBe(variant);
    }
  });

  it('renders slotted content', async () => {
    el.textContent = 'Test content';
    await el.updateComplete;

    const slot = el.shadowRoot!.querySelector('slot')!;
    const assigned = slot.assignedNodes({ flatten: true });
    expect(assigned.map((n) => n.textContent).join('')).toContain('Test content');
  });

  it('applies correct CSS class', () => {
    const surface = el.shadowRoot!.querySelector('.surface');
    expect(surface).toBeTruthy();
  });
});
