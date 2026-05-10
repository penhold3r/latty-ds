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

  afterEach(() => {
    el.remove();
  });

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

  it.each(['primary', 'secondary', 'success', 'warning', 'error', 'neutral'] as const)(
    'reflects %s variant to attribute',
    async (variant) => {
      el.variant = variant;
      await el.updateComplete;
      expect(el.getAttribute('variant')).toBe(variant);
    }
  );

  it('has default size of md', () => {
    expect(el.size).toBe('md');
    expect(el.getAttribute('size')).toBe('md');
  });

  it.each(['sm', 'md', 'lg'] as const)('reflects %s size to attribute', async (size) => {
    el.size = size;
    await el.updateComplete;
    expect(el.getAttribute('size')).toBe(size);
  });
});
