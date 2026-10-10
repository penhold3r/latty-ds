import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Chip } from '../chip';
import '../chip';

describe('<lt-chip>', () => {
  let el: Chip;

  beforeEach(async () => {
    el = document.createElement('lt-chip') as Chip;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders in shadow DOM', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('projects slot content', () => {
    el.textContent = 'Hello';
    expect(el.shadowRoot!.querySelector('slot')).toBeTruthy();
  });

  it('has default appearance of filled', () => {
    expect(el.appearance).toBe('filled');
    expect(el.getAttribute('appearance')).toBe('filled');
  });

  it.each(['filled', 'outlined'] as const)('reflects %s appearance to attribute', async (appearance) => {
    el.appearance = appearance;
    await el.updateComplete;
    expect(el.getAttribute('appearance')).toBe(appearance);
  });

  it('has default variant of primary', () => {
    expect(el.variant).toBe('primary');
    expect(el.getAttribute('variant')).toBe('primary');
  });

  it.each(['primary', 'secondary', 'neutral', 'success', 'warning', 'error', 'info'] as const)(
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

  it('is not disabled by default', () => {
    expect(el.disabled).toBe(false);
    expect(el.hasAttribute('disabled')).toBe(false);
  });

  it('can be disabled', async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute('disabled')).toBe(true);
  });

  it('does not show delete button by default', () => {
    expect(el.shadowRoot!.querySelector('.delete')).toBeNull();
  });

  it('shows delete button when deletable', async () => {
    el.deletable = true;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.delete')).toBeTruthy();
  });

  it('dispatches lt-delete event when delete button clicked', async () => {
    el.deletable = true;
    await el.updateComplete;
    let fired = false;
    el.addEventListener('delete', () => {
      fired = true;
    });
    el.shadowRoot!.querySelector<HTMLButtonElement>('.delete')!.click();
    expect(fired).toBe(true);
  });

  it('dispatches lt-delete event via internal handler', () => {
    let fired = false;
    el.addEventListener('delete', () => {
      fired = true;
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (el as any)._handleDelete(new MouseEvent('click'));
    expect(fired).toBe(true);
  });

  describe('labels (i18n, X5)', () => {
    it('defaults the delete button label to English', async () => {
      el.deletable = true;
      await el.updateComplete;
      const btn = el.shadowRoot!.querySelector('.delete');
      expect(btn?.getAttribute('aria-label')).toBe('Remove');
    });

    it('overrides the delete button label via labels', async () => {
      el.deletable = true;
      el.labels = { remove: 'Supprimer' };
      await el.updateComplete;
      const btn = el.shadowRoot!.querySelector('.delete');
      expect(btn?.getAttribute('aria-label')).toBe('Supprimer');
    });
  });
});

describe('selectable (filter chip)', () => {
  let el: Chip;

  const base = () => el.shadowRoot!.querySelector<HTMLElement>('[part="base"]')!;

  beforeEach(async () => {
    el = document.createElement('lt-chip') as Chip;
    el.selectable = true;
    el.textContent = 'In stock';
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('is not a toggle button unless selectable is set', async () => {
    el.selectable = false;
    await el.updateComplete;
    expect(base().hasAttribute('role')).toBe(false);
    expect(base().hasAttribute('tabindex')).toBe(false);
    expect(base().hasAttribute('aria-pressed')).toBe(false);
  });

  it('exposes role=button, a Tab stop, and aria-pressed reflecting selected', async () => {
    expect(base().getAttribute('role')).toBe('button');
    expect(base().getAttribute('tabindex')).toBe('0');
    expect(base().getAttribute('aria-pressed')).toBe('false');
    el.selected = true;
    await el.updateComplete;
    expect(base().getAttribute('aria-pressed')).toBe('true');
  });

  it('toggles selected and dispatches change on click', async () => {
    const handler = vi.fn();
    el.addEventListener('change', handler);
    base().click();
    await el.updateComplete;
    expect(el.selected).toBe(true);
    expect(handler.mock.calls[0][0].detail).toEqual({ selected: true });

    base().click();
    await el.updateComplete;
    expect(el.selected).toBe(false);
  });

  it('toggles on Enter and Space when the chip itself has focus', async () => {
    base().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    await el.updateComplete;
    expect(el.selected).toBe(true);

    base().dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
    await el.updateComplete;
    expect(el.selected).toBe(false);
  });

  it('is not interactive while disabled', async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(base().hasAttribute('tabindex')).toBe(false);
    expect(base().getAttribute('aria-disabled')).toBe('true');
    base().click();
    await el.updateComplete;
    expect(el.selected).toBe(false);
  });

  it('removing the chip via the delete button does not also toggle selected', async () => {
    el.deletable = true;
    await el.updateComplete;
    const deleteHandler = vi.fn();
    const changeHandler = vi.fn();
    el.addEventListener('delete', deleteHandler);
    el.addEventListener('change', changeHandler);
    el.shadowRoot!.querySelector<HTMLButtonElement>('.delete')!.click();
    expect(deleteHandler).toHaveBeenCalledOnce();
    expect(changeHandler).not.toHaveBeenCalled();
    expect(el.selected).toBe(false);
  });

  it('pressing Enter/Space while the delete button has focus does not also toggle selected', async () => {
    el.deletable = true;
    await el.updateComplete;
    const changeHandler = vi.fn();
    el.addEventListener('change', changeHandler);
    const deleteBtn = el.shadowRoot!.querySelector<HTMLButtonElement>('.delete')!;
    deleteBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    await el.updateComplete;
    expect(changeHandler).not.toHaveBeenCalled();
    expect(el.selected).toBe(false);
  });
});

describe('Backspace-to-delete', () => {
  let el: Chip;

  beforeEach(async () => {
    el = document.createElement('lt-chip') as Chip;
    el.deletable = true;
    el.textContent = 'Design';
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('fires delete when Backspace is pressed on the delete button', async () => {
    const handler = vi.fn();
    el.addEventListener('delete', handler);
    el.shadowRoot!.querySelector('.delete')!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true, cancelable: true })
    );
    expect(handler).toHaveBeenCalledOnce();
  });

  it('fires delete when Backspace is pressed on a selectable chip itself', async () => {
    el.selectable = true;
    await el.updateComplete;
    const handler = vi.fn();
    el.addEventListener('delete', handler);
    el.shadowRoot!.querySelector('[part="base"]')!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true, cancelable: true })
    );
    expect(handler).toHaveBeenCalledOnce();
  });

  it('does nothing when not deletable', async () => {
    el.deletable = false;
    await el.updateComplete;
    const handler = vi.fn();
    el.addEventListener('delete', handler);
    el.shadowRoot!.querySelector('[part="base"]')!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true, cancelable: true })
    );
    expect(handler).not.toHaveBeenCalled();
  });

  it('does nothing while disabled', async () => {
    el.disabled = true;
    await el.updateComplete;
    const handler = vi.fn();
    el.addEventListener('delete', handler);
    el.shadowRoot!.querySelector('[part="base"]')!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true, cancelable: true })
    );
    expect(handler).not.toHaveBeenCalled();
  });
});
