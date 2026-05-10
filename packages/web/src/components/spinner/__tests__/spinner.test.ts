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

  it.each(['sm', 'md', 'lg'] as const)('reflects %s size to attribute', async (size) => {
    el.size = size;
    await el.updateComplete;
    expect(el.getAttribute('size')).toBe(size);
  });

  it.each(['primary', 'secondary', 'neutral', 'current'] as const)(
    'reflects %s variant to attribute',
    async (variant) => {
      el.variant = variant;
      await el.updateComplete;
      expect(el.getAttribute('variant')).toBe(variant);
    }
  );
});
