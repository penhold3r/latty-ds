import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { IconButton } from '../icon-button';
import '../icon-button';

describe('<lt-icon-button>', () => {
  let el: IconButton;

  beforeEach(async () => {
    el = document.createElement('lt-icon-button') as IconButton;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders a button in shadow DOM', () => {
    const btn = el.shadowRoot!.querySelector('button[part="base"]');
    expect(btn).toBeTruthy();
  });

  it.each(['neutral', 'primary', 'secondary', 'success', 'warning', 'error', 'info'] as const)(
    'reflects %s variant to attribute',
    async (variant) => {
      el.variant = variant;
      await el.updateComplete;
      expect(el.getAttribute('variant')).toBe(variant);
    }
  );

  it.each(['ghost', 'filled', 'outlined'] as const)('reflects %s appearance to attribute', async (appearance) => {
    el.appearance = appearance;
    await el.updateComplete;
    expect(el.getAttribute('appearance')).toBe(appearance);
  });

  it.each(['sm', 'md', 'lg'] as const)('reflects %s size to attribute', async (size) => {
    el.size = size;
    await el.updateComplete;
    expect(el.getAttribute('size')).toBe(size);
  });

  it('sets aria-label from label attribute', async () => {
    el.label = 'Close dialog';
    await el.updateComplete;
    const btn = el.shadowRoot!.querySelector('button[part="base"]')!;
    expect(btn.getAttribute('aria-label')).toBe('Close dialog');
  });

  it('renders an anchor when href is set', async () => {
    el.href = '/some/path';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('a[part="base"]')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('button')).toBeFalsy();
  });

  it('disables the button', async () => {
    el.disabled = true;
    await el.updateComplete;
    const btn = el.shadowRoot!.querySelector('button[part="base"]') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it('reflects round attribute', async () => {
    el.round = true;
    await el.updateComplete;
    expect(el.hasAttribute('round')).toBe(true);
  });
});
