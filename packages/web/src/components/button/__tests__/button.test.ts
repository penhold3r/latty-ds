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

  it.each(['primary', 'secondary', 'neutral', 'success', 'warning', 'error', 'info'] as const)(
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

  it.each(['filled', 'outlined'] as const)('reflects %s appearance to attribute', async (appearance) => {
    el.appearance = appearance;
    await el.updateComplete;
    expect(el.getAttribute('appearance')).toBe(appearance);
  });

  describe('href / link rendering', () => {
    it('renders an anchor when href is set', async () => {
      el.href = '/dashboard';
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('a')).toBeTruthy();
      expect(el.shadowRoot!.querySelector('button')).toBeFalsy();
    });

    it('renders a button when href is empty', () => {
      expect(el.shadowRoot!.querySelector('button')).toBeTruthy();
      expect(el.shadowRoot!.querySelector('a')).toBeFalsy();
    });

    it('sets href on the anchor', async () => {
      el.href = '/dashboard';
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('a')!.getAttribute('href')).toBe('/dashboard');
    });

    it('forwards target to anchor', async () => {
      el.href = '/dashboard';
      el.target = '_blank';
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('a')!.getAttribute('target')).toBe('_blank');
    });

    it('auto-sets rel=noopener noreferrer when target=_blank', async () => {
      el.href = '/dashboard';
      el.target = '_blank';
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('a')!.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('uses explicit rel when provided', async () => {
      el.href = '/dashboard';
      el.target = '_blank';
      el.rel = 'noopener';
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('a')!.getAttribute('rel')).toBe('noopener');
    });

    it('sets aria-disabled on anchor when disabled', async () => {
      el.href = '/dashboard';
      el.disabled = true;
      await el.updateComplete;
      const a = el.shadowRoot!.querySelector('a')!;
      expect(a.getAttribute('aria-disabled')).toBe('true');
      expect(a.getAttribute('tabindex')).toBe('-1');
    });

    it('sets aria-disabled on anchor when loading', async () => {
      el.href = '/dashboard';
      el.loading = true;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('a')!.getAttribute('aria-disabled')).toBe('true');
    });
  });
});
