import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Button } from '../button';
import '../button';

describe('<lt-button>', () => {
  let el: Button;

  beforeEach(async () => {
    el = document.createElement('lt-button') as Button;
    el.textContent = 'Click me';
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders a button in shadow DOM', () => {
    const btn = el.shadowRoot!.querySelector('button');
    expect(btn).toBeTruthy();
  });

  it('projects content into the slot', () => {
    const slot = el.shadowRoot!.querySelector('slot')!;
    const assigned = slot.assignedNodes({ flatten: true });
    expect(assigned.map((n) => n.textContent).join('')).toContain('Click me');
  });

  it('has default variant of primary', () => {
    expect(el.variant).toBe('primary');
    expect(el.getAttribute('variant')).toBe('primary');
  });

  it('has default size of md', () => {
    expect(el.size).toBe('md');
    expect(el.getAttribute('size')).toBe('md');
  });

  it('has default appearance of filled', () => {
    expect(el.appearance).toBe('filled');
    expect(el.getAttribute('appearance')).toBe('filled');
  });

  it('can change variant', async () => {
    el.variant = 'secondary';
    await el.updateComplete;
    expect(el.getAttribute('variant')).toBe('secondary');
  });

  it('can change size', async () => {
    el.size = 'lg';
    await el.updateComplete;
    expect(el.getAttribute('size')).toBe('lg');
  });

  it('is not disabled by default', () => {
    const btn = el.shadowRoot!.querySelector('button')!;
    expect(el.disabled).toBe(false);
    expect(btn.hasAttribute('disabled')).toBe(false);
  });

  it('can be disabled', async () => {
    el.disabled = true;
    await el.updateComplete;
    const btn = el.shadowRoot!.querySelector('button')!;
    expect(btn.hasAttribute('disabled')).toBe(true);
  });

  it('is not loading by default', () => {
    expect(el.loading).toBe(false);
  });

  it('shows spinner when loading', async () => {
    el.loading = true;
    await el.updateComplete;
    const spinner = el.shadowRoot!.querySelector('lt-spinner');
    expect(spinner).toBeTruthy();
  });

  it('disables button when loading', async () => {
    el.loading = true;
    await el.updateComplete;
    const btn = el.shadowRoot!.querySelector('button')!;
    expect(btn.hasAttribute('disabled')).toBe(true);
    expect(btn.getAttribute('aria-busy')).toBe('true');
  });

  it('hides slot content when loading', async () => {
    el.loading = true;
    await el.updateComplete;
    const slot = el.shadowRoot!.querySelector('slot');
    expect(slot).toBeFalsy();
  });

  it('supports all variants', async () => {
    const variants = ['primary', 'secondary', 'neutral', 'success', 'warning', 'error', 'info'] as const;

    for (const variant of variants) {
      el.variant = variant;
      await el.updateComplete;
      expect(el.getAttribute('variant')).toBe(variant);
    }
  });

  it('supports all sizes', async () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    for (const size of sizes) {
      el.size = size;
      await el.updateComplete;
      expect(el.getAttribute('size')).toBe(size);
    }
  });

  it('supports all appearances', async () => {
    const appearances = ['filled', 'outlined'] as const;

    for (const appearance of appearances) {
      el.appearance = appearance;
      await el.updateComplete;
      expect(el.getAttribute('appearance')).toBe(appearance);
    }
  });

  it('can change appearance', async () => {
    el.appearance = 'outlined';
    await el.updateComplete;
    expect(el.getAttribute('appearance')).toBe('outlined');
  });
});
