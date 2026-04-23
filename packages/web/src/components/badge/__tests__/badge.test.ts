import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Badge } from '../badge';
import '../badge';

describe('<lt-badge>', () => {
  let el: Badge;

  beforeEach(async () => {
    el = document.createElement('lt-badge') as Badge;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => { el.remove(); });

  it('renders in shadow DOM', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('renders content attribute as text', async () => {
    el.content = 'Active';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('span[part="base"]')!.textContent!.trim()).toBe('Active');
    expect(el.getAttribute('content')).toBe('Active');
  });

  it('has no content by default (circle mode)', () => {
    expect(el.content).toBe('');
    expect(el.getAttribute('content')).toBe('');
  });

  it('has default variant of primary', () => {
    expect(el.variant).toBe('primary');
    expect(el.getAttribute('variant')).toBe('primary');
  });

  it('supports all variants', async () => {
    const variants = ['primary', 'secondary', 'success', 'warning', 'error', 'neutral'] as const;
    for (const variant of variants) {
      el.variant = variant;
      await el.updateComplete;
      expect(el.getAttribute('variant')).toBe(variant);
    }
  });

  it('has default size of md', () => {
    expect(el.size).toBe('md');
    expect(el.getAttribute('size')).toBe('md');
  });

  it('supports all sizes', async () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    for (const size of sizes) {
      el.size = size;
      await el.updateComplete;
      expect(el.getAttribute('size')).toBe(size);
    }
  });
});
