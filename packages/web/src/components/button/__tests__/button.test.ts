import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { axe } from 'vitest-axe';
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

  it.each(['filled', 'outlined', 'ghost'] as const)('reflects %s appearance to attribute', async (appearance) => {
    el.appearance = appearance;
    await el.updateComplete;
    expect(el.getAttribute('appearance')).toBe(appearance);
  });

  it('has no axe violations', async () => {
    expect(await axe(el)).toHaveNoViolations();
  });

  describe('type / form association', () => {
    it('defaults to type="button" and reflects', () => {
      expect(el.type).toBe('button');
      expect(el.getAttribute('type')).toBe('button');
    });

    it.each(['button', 'submit', 'reset'] as const)('reflects %s type to attribute', async (type) => {
      el.type = type;
      await el.updateComplete;
      expect(el.getAttribute('type')).toBe(type);
    });

    it('calls form.requestSubmit() when type="submit" and clicked', async () => {
      const form = document.createElement('form');
      form.appendChild(el);
      document.body.appendChild(form);

      const requestSubmit = vi.fn();
      vi.spyOn(form, 'requestSubmit').mockImplementation(requestSubmit);

      el.type = 'submit';
      await el.updateComplete;
      el.shadowRoot!.querySelector('button')!.click();

      expect(requestSubmit).toHaveBeenCalledOnce();
      form.remove();
    });

    it('calls form.reset() when type="reset" and clicked', async () => {
      const form = document.createElement('form');
      form.appendChild(el);
      document.body.appendChild(form);

      const reset = vi.fn();
      vi.spyOn(form, 'reset').mockImplementation(reset);

      el.type = 'reset';
      await el.updateComplete;
      el.shadowRoot!.querySelector('button')!.click();

      expect(reset).toHaveBeenCalledOnce();
      form.remove();
    });

    it('does not submit when disabled', async () => {
      const form = document.createElement('form');
      form.appendChild(el);
      document.body.appendChild(form);

      const requestSubmit = vi.fn();
      vi.spyOn(form, 'requestSubmit').mockImplementation(requestSubmit);

      el.type = 'submit';
      el.disabled = true;
      await el.updateComplete;
      el.shadowRoot!.querySelector('button')!.click();

      expect(requestSubmit).not.toHaveBeenCalled();
      form.remove();
    });

    it('does not submit when loading', async () => {
      const form = document.createElement('form');
      form.appendChild(el);
      document.body.appendChild(form);

      const requestSubmit = vi.fn();
      vi.spyOn(form, 'requestSubmit').mockImplementation(requestSubmit);

      el.type = 'submit';
      el.loading = true;
      await el.updateComplete;
      el.shadowRoot!.querySelector('button')!.click();

      expect(requestSubmit).not.toHaveBeenCalled();
      form.remove();
    });
  });

  describe('aria forwarding', () => {
    // MutationObserver callbacks are async — flush them before asserting
    const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

    it('forwards aria-pressed set before connect to the internal button', async () => {
      const pressed = document.createElement('lt-button') as Button;
      pressed.setAttribute('aria-pressed', 'true');
      document.body.appendChild(pressed);
      await pressed.updateComplete;
      expect(pressed.shadowRoot!.querySelector('button')!.getAttribute('aria-pressed')).toBe('true');
      pressed.remove();
    });

    it.each(['aria-pressed', 'aria-expanded', 'aria-haspopup', 'aria-controls', 'aria-current'] as const)(
      'forwards %s onto the internal button',
      async (attr) => {
        el.setAttribute(attr, 'true');
        await tick();
        await el.updateComplete;
        expect(el.shadowRoot!.querySelector('button')!.getAttribute(attr)).toBe('true');
      }
    );

    it('re-forwards when the host attribute changes', async () => {
      el.setAttribute('aria-pressed', 'true');
      await tick();
      await el.updateComplete;
      el.setAttribute('aria-pressed', 'false');
      await tick();
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('button')!.getAttribute('aria-pressed')).toBe('false');
    });

    it('removes the forwarded attribute when it is removed from the host', async () => {
      el.setAttribute('aria-pressed', 'true');
      await tick();
      await el.updateComplete;
      el.removeAttribute('aria-pressed');
      await tick();
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('button')!.hasAttribute('aria-pressed')).toBe(false);
    });

    it('forwards onto the anchor when href is set', async () => {
      el.href = '/dashboard';
      el.setAttribute('aria-current', 'page');
      await tick();
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('a')!.getAttribute('aria-current')).toBe('page');
    });

    it('has no axe violations with aria-pressed set', async () => {
      el.setAttribute('aria-pressed', 'true');
      await tick();
      await el.updateComplete;
      expect(await axe(el)).toHaveNoViolations();
    });
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
