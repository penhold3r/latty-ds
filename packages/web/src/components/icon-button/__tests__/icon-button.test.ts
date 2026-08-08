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

  it('is not bordered by default', () => {
    expect(el.bordered).toBe(false);
    expect(el.hasAttribute('bordered')).toBe(false);
  });

  it('reflects bordered to attribute', async () => {
    el.bordered = true;
    await el.updateComplete;
    expect(el.hasAttribute('bordered')).toBe(true);
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

  describe('aria forwarding', () => {
    // MutationObserver callbacks are async — flush them before asserting
    const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

    it.each(['aria-pressed', 'aria-expanded', 'aria-haspopup', 'aria-controls', 'aria-current'] as const)(
      'forwards %s onto the internal button',
      async (attr) => {
        el.setAttribute(attr, 'true');
        await tick();
        await el.updateComplete;
        expect(el.shadowRoot!.querySelector('button')!.getAttribute(attr)).toBe('true');
      }
    );

    it('removes the forwarded attribute when it is removed from the host', async () => {
      el.setAttribute('aria-expanded', 'true');
      await tick();
      await el.updateComplete;
      el.removeAttribute('aria-expanded');
      await tick();
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('button')!.hasAttribute('aria-expanded')).toBe(false);
    });
  });
});
