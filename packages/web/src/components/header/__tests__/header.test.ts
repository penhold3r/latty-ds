import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Header } from '../header';
import '../header';

describe('<lt-header>', () => {
  let el: Header;

  beforeEach(async () => {
    el = document.createElement('lt-header') as Header;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => { el.remove(); });

  it('renders in shadow DOM', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('projects slot content', () => {
    el.textContent = 'Hello';
    expect(el.shadowRoot!.querySelector('slot')).toBeTruthy();
  });

  it('has default variant of primary', () => {
    expect(el.variant).toBe('primary');
    expect(el.getAttribute('variant')).toBe('primary');
  });

  it.each(['primary', 'surface'] as const)('reflects %s variant to attribute', async (variant) => {
    el.variant = variant;
    await el.updateComplete;
    expect(el.getAttribute('variant')).toBe(variant);
  });
});
